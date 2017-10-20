import {join} from 'path';
import {readFileSync} from 'fs';

import {
  tagsAndText,
  stripTags,
  addSpansAroundVerses,
  addDropCapsClassToFirstLetter,
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
            addSpansAroundVerses(
              stripTags('script',
                stripTags('object',
                  tagsAndText(GENESIS_6))))));
      require('fs').writeFileSync('/tmp/genesis6.html', actual);
      expect(actual).toBe(GENESIS_6_NO_OBJECT_WITH_SPANS_WITH_DROP_CAPS);
    });
  });
});
