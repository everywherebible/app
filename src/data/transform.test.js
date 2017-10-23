import {join} from 'path';
import {readFileSync} from 'fs';

import transform, {
  tagsAndText,
  stripTags,
  addSpansAroundVerses,
  withTagStack,
  addDropCapsClassToFirstLetter,
  withSurroundingEvents,
} from './transform';

const load = name =>
  readFileSync(join(__dirname, `../../test-data/${name}.html`))
    .toString()
    .trim();

const GENESIS_6 = load('genesis-6');
const GENESIS_6_NO_OBJECT = load('genesis-6-no-object');
const GENESIS_6_NO_OBJECT_WITH_SPANS = load('genesis-6-no-object-with-spans');
const GENESIS_6_NO_OBJECT_WITH_SPANS_WITH_DROP_CAPS =
  load('genesis-6-no-object-with-spans-with-drop-caps');
const GENESIS_6_NO_OBJECT_WITH_SPANS_WITH_DROP_CAPS_NO_COPYRIGHT =
  load('genesis-6-no-object-with-spans-with-drop-caps-no-copyright');
const HOSEA_2 = load('hosea-2');
const HOSEA_2_NO_OBJECT_WITH_SPANS_WITH_DROP_CAPS =
  load('hosea-2-no-object-with-spans-with-drop-caps');
const HOSEA_2_NO_OBJECT_WITH_SPANS_WITH_DROP_CAPS_NO_COPYRIGHT =
  load('hosea-2-no-object-with-spans-with-drop-caps-no-copyright');

const concat = g => Array.from(g).map(i => i.value).join('');

describe('transform', () => {
  describe('tagsAndText', () => {
    it('correctly parses tags without attributes', () => {
      expect(Array.from(tagsAndText('<h2>flerg<span>blerg</span></h2>')))
        .toEqual([
          {
            "type": "tag",
            "value": "<h2>",
            "isStart": true,
            "attributes": {},
            "name": "h2"
          },
          {
            "type": "text",
            "value": "flerg"
          },
          {
            "type": "tag",
            "value": "<span>",
            "isStart": true,
            "attributes": {},
            "name": "span"
          },
          {
            "type": "text",
            "value": "blerg"
          },
          {
            "type": "tag",
            "value": "</span>",
            "isStart": false,
            "attributes": {},
            "name": "span"
          },
          {
            "type": "tag",
            "value": "</h2>",
            "isStart": false,
            "attributes": {},
            "name": "h2"
          }
        ]);
    });

    it('correctly parses simple attributes', () => {
      expect(Array.from(tagsAndText('<div class="foo">bar</div>')))
        .toEqual([
          {
            "type": "tag",
            "value": "<div class=\"foo\">",
            "isStart": true,
            "attributes": {
              "class": "foo"
            },
            "name": "div"
          },
          {
            "type": "text",
            "value": "bar"
          },
          {
            "type": "tag",
            "value": "</div>",
            "isStart": false,
            "attributes": {},
            "name": "div"
          }
        ]);
    });

    it('correctly parses attributes with space before closing caret', () => {
      expect(Array.from(tagsAndText('<div class="foo" >bar</div>')))
        .toEqual([
          {
            "type": "tag",
            "value": "<div class=\"foo\" >",
            "isStart": true,
            "attributes": {
              "class": "foo"
            },
            "name": "div"
          },
          {
            "type": "text",
            "value": "bar"
          },
          {
            "type": "tag",
            "value": "</div>",
            "isStart": false,
            "attributes": {},
            "name": "div"
          }
        ]);
    });

    it('correctly parses unquoted attributes', () => {
      expect(Array.from(tagsAndText('<div class=foo>')))
        .toEqual([
          {
            "type": "tag",
            "value": "<div class=foo>",
            "isStart": true,
            "attributes": {
              "class": "foo"
            },
            "name": "div"
          }
        ]);
    });

    it('correctly parses unquoted attributes with a space', () => {
      expect(Array.from(tagsAndText('<div class=foo />')))
        .toEqual([
          {
            "type": "tag",
            "value": "<div class=foo />",
            "isStart": true,
            "attributes": {
              "class": "foo"
            },
            "name": "div"
          }
        ]);
    });

    it('correctly parses unquoted attributes with no closing slash', () => {
      expect(Array.from(tagsAndText('<div class=foo>')))
        .toEqual([
          {
            "type": "tag",
            "value": "<div class=foo>",
            "isStart": true,
            "attributes": {
              "class": "foo"
            },
            "name": "div"
          }
        ]);
    });

    it('correctly parses genesis 6', () => {
      const actual = concat(tagsAndText(GENESIS_6));
      expect(actual).toBe(GENESIS_6);
    });

    [
      'foo',
      '<div/>',
      '<div>foo</div>',
      '<div class="bar"><span>baz</span> boom</div>',
      'foo<div/>',
      '<div/>foo',
    ].forEach(s => it(`maintains structure for \`${s}\``, () => {
      const actual = concat(withSurroundingEvents(tagsAndText(s)));
      expect(actual).toBe(s);
    }));
  });

  describe('stripTags', () => {
    it('correctly parses genesis 6', () => {
      const actual = concat(
          stripTags('script',
            stripTags('object',
              tagsAndText(GENESIS_6))));
      expect(actual).toBe(GENESIS_6_NO_OBJECT);
    });
  });

  describe('addSpansAroundVerses', () => {
    it('correctly parses genesis 6', () => {
      const actual = concat(
          addSpansAroundVerses(
            stripTags('script',
              stripTags('object',
                tagsAndText(GENESIS_6)))));
      expect(actual).toBe(GENESIS_6_NO_OBJECT_WITH_SPANS);
    });
  });

  describe('addDropCapsClassToFirstLetter', () => {
    it('correctly parses genesis 6', () => {
      const actual = concat(
          addDropCapsClassToFirstLetter(
            withTagStack(
              addSpansAroundVerses(
                stripTags('script',
                  stripTags('object',
                    tagsAndText(GENESIS_6)))))));
      expect(actual).toBe(GENESIS_6_NO_OBJECT_WITH_SPANS_WITH_DROP_CAPS);
    });

    it('correctly parses chapter with footnote first', () => {
      const actual = concat(
          withSurroundingEvents(
            addDropCapsClassToFirstLetter(
              withTagStack(
                addSpansAroundVerses(
                  stripTags('script',
                    stripTags('object',
                      tagsAndText(HOSEA_2))))))));
      expect(actual).toBe(HOSEA_2_NO_OBJECT_WITH_SPANS_WITH_DROP_CAPS);
    });
  });

  describe('withSurroundingEvents', () => {
    [
      'foo',
      '<div/>',
      '<div>foo</div>',
      '<div class="bar"><span>baz</span> boom</div>',
    ].forEach(s => it(`maintains structure for \`${s}\``, () => {
      const actual = concat(withSurroundingEvents(tagsAndText(s)));
      expect(actual).toBe(s);
    }));
  });

  describe('default export', () => {
    it('correctly parses genesis 6', () => {
      const actual = transform(GENESIS_6);
      const expected =
        GENESIS_6_NO_OBJECT_WITH_SPANS_WITH_DROP_CAPS_NO_COPYRIGHT;
      expect(actual).toBe(expected);
    });

    it('correctly parses hosea 2', () => {
      const actual = transform(HOSEA_2);
      const expected = HOSEA_2_NO_OBJECT_WITH_SPANS_WITH_DROP_CAPS_NO_COPYRIGHT;
      expect(actual).toBe(expected);
    });
  });
});
