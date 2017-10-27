const last = a => a[a.length - 1];

export function* tagsAndText(html) {
  const context = [{type: 'document', start: 0}];
  let index = -1;
  let metadata;

  while (index++ < html.length) {
    const ctx = last(context);
    if (ctx.type === 'document') {
      if (html[index] === '<') {
        if (ctx.start !== index)
          yield {
            type: 'text',
            value: html.substring(ctx.start, index),
          };

        context.push({type: 'tag', start: index});
        metadata = {isStart: html[index + 1] !== '/', attributes: {}};

        if (html[index + 1] === '/')
          index++;

        context.push({type: 'tagname', start: index + 1});
      }
    } else if (ctx.type === 'tag') {
      if (html[index] === '>') {
        if (ctx.type === 'tagname')
          metadata.name = html.substring(metadata.isStart? 1 : 2, index);

        yield Object.assign({
          type: 'tag',
          value: html.substring(ctx.start, index + 1),
        }, metadata);

        context.pop();
        last(context).start = index + 1;
      } else if (html[index] !== ' ' && html[index] !== '/') {
        context.push({type: 'attribute', start: index});
        context.push({type: 'attributeName', start: index});
      }
    } else if (ctx.type === 'tagname') {
      if (html[index] === ' ' || html[index] === '>') {
        metadata.name = html.substring(ctx.start, index);
        context.pop();

        if (html[index] === '>')
          index--;
      }
    } else if (ctx.type === 'attributeName') {
      if (html[index] === '=') {
        const attributeName = html.substring(ctx.start, index);
        context.pop();
        last(context).name = attributeName;
        if (html[index + 1] === '"') {
          last(context).isQuoted = true;
          index++;
        }
        last(context).start = index + 1;
      }
    } else if (ctx.type === 'attribute') {
      const isAttribteEnd = ctx.isQuoted?
        html[index] === '"' && html[index - 1] !== '\\' :
        html[index] === ' ' || html[index] === '>';
      if (isAttribteEnd) {
        metadata.attributes[ctx.name] = html.substring(ctx.start, index);
        context.pop();
        if (!ctx.isQuoted && html[index] === '>')
          index--;
      }
    }
  }

  const ctx = last(context);
  if (ctx.type === 'document' && ctx.start < index - 1)
    yield {type: 'text', value: html.substring(ctx.start, index)};
}

export function* stripTags(tagName, tagsAndText) {
  let inObjectTag = false;

  for (let item of tagsAndText) {
    if (item.type === 'tag' &&
        item.isStart &&
        item.name === tagName) {
      inObjectTag = true;
    } else if (item.type === 'tag' &&
               !item.isStart &&
               item.name === tagName) {
      inObjectTag = false;
    } else if (!inObjectTag) {
      yield item;
    }
  }
}


export function* addSpansAroundVerses(tagsAndText) {
  let inVerse = false;

  for (let item of tagsAndText) {
    const {type, name, isStart, attributes} = item;
    if (inVerse && type === 'tag' && name === 'p' && !isStart) {
      yield {
        type: 'tag',
        isStart: false,
        value: '</span>',
        name: 'span',
        attributes: {},
      };
      inVerse = false;
    } else if (type === 'tag' && /^(chapter|verse)-num$/.test(attributes.class)) {
      if (inVerse) {
        yield {
          type: 'tag',
          isStart: false,
          value: '</span>',
          name: 'span',
          attributes: {},
        };
      }
      inVerse = true;
      const id = attributes.id.replace(/^v/, 'vt');
      yield {
        type: 'tag',
        isStart: true,
        value: `<span class="verse" id="${id}">`,
        name: 'span',
        attributes: {class: 'verse', id},
      };
    }

    yield item;
  }
}

export function* withTagStack(tagsAndText) {
  const stack = [];

  for (let item of tagsAndText) {
    yield Object.assign({stack: stack.slice(0)}, item);

    if (item.type === 'tag') {
      if (item.isStart)
        stack.push(item);
      else
        stack.pop();
    }
  }
}

export function* addDropCapsClassToFirstLetter(tagsAndTextWithStack) {
  let sawFirstReferenceNumber = false;
  let sawClosingSpan = false;
  let addedClass = false;

  for (let item of tagsAndTextWithStack) {
    if (addedClass) {
      yield item;
      continue;
    }

    const {type, name, isStart, value, attributes, stack} = item;

    if (!sawFirstReferenceNumber &&
        type === 'tag' &&
        /^(chapter|verse)-num$/.test(attributes.class)) {
      sawFirstReferenceNumber = true;
      yield item;
      continue;
    }

    if (sawFirstReferenceNumber &&
        !sawClosingSpan &&
        type === 'tag' &&
        name === 'span' &&
        !isStart) {
      sawClosingSpan = true;
      yield item;
      continue;
    }

    if (sawClosingSpan &&
        (last(stack).attributes && last(stack).attributes.class === 'verse') &&
        type === 'text') {
      const parts = value.match(/^(\s*)(&#?[\w]+;)*(\w)(.*)/);

      if (!parts) {
        yield item;
        continue;
      }

      const [, leadingWhitespace, leadingEntities, firstLetter, rest] = parts;

      if (leadingWhitespace)
        yield {type: 'text', value: leadingWhitespace};

      yield {
        type: 'tag',
        isStart: true,
        value: `<span class="first-letter">`,
        name: 'span',
        attributes: {class: 'first-letter'},
      }

      if (leadingEntities)
        yield {type: 'text', value: leadingEntities};
      else
        yield {type: 'text', value: firstLetter};

      yield {
        type: 'tag',
        isStart: false,
        value: '</span>',
        name: 'span',
        attributes: {},
      };

      if (rest)
        if (leadingEntities)
          yield {type: 'text', value: firstLetter + rest};
        else
          yield {type: 'text', value: rest};

      addedClass = true;
      continue;
    }

    yield item;
  }
}

export function* withSurroundingEvents(tagsAndText) {
  const window = [null];

  for (let item of tagsAndText) {
    if (window.length === 3)
      yield Object.assign({before: window[0], after: window[2]}, window[1]);

    window.push(item);

    if (window.length > 3)
      window.shift();
  }

  yield Object.assign({before: window[0], after: window[2]}, window[1]);
  yield Object.assign({before: window[1], after: null}, window[2]);
}

export function* stripCopyright(tagsAndTextWithSurroundingEvents) {
  let inTag = false;

  for (let item of tagsAndTextWithSurroundingEvents) {
    if (item.type === 'text' &&
        item.value[item.value.length - 1] === '(' &&
        item.after.attributes &&
        item.after.attributes.class === 'copyright') {
      yield {
        type: 'text',
        value: item.value.substring(0, item.value.length - 1),
      };
    } else if (item.type === 'tag' &&
               item.attributes.class === 'copyright') {
      // Don't yield this item
      inTag = true;
    } else if (inTag) {
      if (item.type === 'tag' && !item.isStart)
        inTag = false;
    } else if (item.type === 'text' &&
               item.value[0] === ')' &&
               last(item.before.stack).attributes &&
               last(item.before.stack).attributes.class === 'copyright') {
      const value = item.value.substring(1);
      if (value)
        yield {type: 'text', value};
    } else {
      yield item;
    }
  }
}

export default text => Array.from(
    stripCopyright(
      withSurroundingEvents(
        addDropCapsClassToFirstLetter(
          withTagStack(
            addSpansAroundVerses(
              stripTags('script',
                stripTags('object',
                  tagsAndText(text)))))))))
  .map(i => i.value)
  .join('');
