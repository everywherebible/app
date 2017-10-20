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

export function* addDropCapsClassToFirstLetter(tagsAndText) {
  let sawFirstReferenceNumber = false;
  let sawClosingSpan = false;
  let addedClass = false;

  for (let item of tagsAndText) {
    if (addedClass) {
      yield item;
      continue;
    }

    const {type, name, isStart, value, attributes} = item;

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

    if (sawClosingSpan && type === 'text') {
      const parts = value.match(/^(\W*)(\w)(.*)/);

      if (!parts) {
        yield item;
        continue;
      }

      const [, leadingWhitespace, firstLetter, rest] = parts;

      if (leadingWhitespace)
        yield {type: 'text', value: leadingWhitespace};

      yield {
        type: 'tag',
        isStart: true,
        value: `<span class="first-letter">`,
        name: 'span',
        attributes: {class: 'first-letter'},
      }

      yield {type: 'text', value: firstLetter};

      yield {
        type: 'tag',
        isStart: false,
        value: '</span>',
        name: 'span',
        attributes: {},
      };

      if (rest)
        yield {type: 'text', value: rest};

      addedClass = true;
      continue;
    }

    yield item;
  }
}

export default text => Array.from(
    addDropCapsClassToFirstLetter(
      addSpansAroundVerses(
        stripTags('script',
          stripTags('object',
            tagsAndText(text))))))
  .map(i => i.value)
  .join('');
