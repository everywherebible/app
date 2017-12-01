// @flow

const last = a => a[a.length - 1];

type TagEvent = {
  +type: 'tag',
  +name: string,
  +isStart: boolean,
  +attributes: {[string]: string},
  +value: string,
};

type TextEvent = {
  +type: 'text',
  +value: string,
};

type ParseEvent = TagEvent | TextEvent;

type ParseEventWithStack = ParseEvent & {+stack: Array<TagEvent>};

export function* tagsAndText(html: string): Generator<ParseEvent, void, void> {
  const context: Array<any> = [{type: 'document', start: 0}];
  let index = -1;
  let metadata: any = {};

  while (index++ < html.length) {
    const ctx: any = last(context);
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
        const lastCtx: any = last(context);
        lastCtx.start = index + 1;
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
        const lastCtx: any = last(context);
        lastCtx.name = attributeName;
        if (html[index + 1] === '"') {
          lastCtx.isQuoted = true;
          index++;
        }
        lastCtx.start = index + 1;
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

  const ctx: any = last(context);
  if (ctx.type === 'document' && ctx.start < index - 1)
    yield {type: 'text', value: html.substring(ctx.start, index)};
}

export function* stripTags(tagName: string, tagsAndText: Iterable<ParseEvent>):
    Generator<ParseEvent, void, void> {
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

export function* addSpansAroundVerses(tagsAndText: Iterable<ParseEvent>):
    Generator<ParseEvent, void, void> {
  let inVerse = false;

  for (let item of tagsAndText) {
    if (inVerse &&
        item.type === 'tag' &&
        item.name === 'p' &&
        !item.isStart) {
      yield {
        type: 'tag',
        isStart: false,
        value: '</span>',
        name: 'span',
        attributes: {},
      };
      inVerse = false;
    } else if (item.type === 'tag' &&
               /^(chapter|verse)-num(\s.*)?$/.test(item.attributes.class)) {
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
      const id = item.attributes.id.replace(/^v/, 'vt');
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

export function* withTagStack(tagsAndText: Iterable<ParseEvent>):
    Generator<ParseEventWithStack, void, void> {
  const stack: Array<TagEvent> = [];

  for (let item of tagsAndText) {
    if (item.type === 'tag')
      yield {
        type: 'tag',
        name: item.name,
        isStart: item.isStart,
        attributes: item.attributes,
        value: item.value,
        stack: stack.slice(0),
      };
    else
      yield {...item, stack: stack.slice(0)};

    if (item.type === 'tag')
      if (item.isStart)
        stack.push(item);
      else
        stack.pop();
  }
}

export function* addDropCapsClassToFirstLetter(
    tagsAndTextWithStack: Iterable<any>): Generator<ParseEvent, void, void> {
  let sawFirstReferenceNumber = false;
  let sawClosingSpanOrB = false;
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
        !sawClosingSpanOrB &&
        type === 'tag' &&
        (name === 'span' || name === 'b') &&
        !isStart) {
      sawClosingSpanOrB = true;
      yield item;
      continue;
    }

    if (sawClosingSpanOrB &&
        (last(stack) &&
         last(stack).attributes &&
         (last(stack).attributes.class === 'verse' ||
          last(stack).attributes.class === 'woc')) &&
        type === 'text') {
      const parts = value.match(/^([\s"]*)(&#?[\w]+;)*([\w“])(.*)/);

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

export function* withSurroundingEvents(tagsAndText: Iterable<any>):
    Generator<any, void, void> {
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

export function* stripCopyright(
    tagsAndTextWithSurroundingEvents: Iterable<any>):
      Generator<any, void, void> {
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

export default (text: string): string => Array.from(
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
