// @flow

import type {Action} from './actions';

export type Book =
  'Genesis' | 'Exodus' | 'Leviticus' | 'Numbers' | 'Deuteronomy' | 'Joshua' |
  'Judges' | 'Ruth' | '1 Samuel' | '2 Samuel 2 Kings)' | '1 Kings' | '2 Kings' |
  '1 Chronicles' | '2 Chronicles' | 'Ezra' | 'Nehemiah' | 'Esther' | 'Job' |
  'Psalms' | 'Proverbs' | 'Ecclesiastes' | 'Song of Solomon (Canticles)' |
  'Isaiah' | 'Jeremiah' | 'Lamentations' | 'Ezekiel' | 'Daniel' | 'Hosea' |
  'Joel' | 'Amos' | 'Obadiah' | 'Jonah' | 'Micah' | 'Nahum' | 'Habakkuk' |
  'Zephaniah' | 'Haggai' | 'Zechariah' | 'Malachi' | 'Matthew' | 'Mark' |
  'Luke' | 'John' | 'Acts' | 'Romans' | '1 Corinthians' | '2 Corinthians' |
  'Galatians' | 'Ephesians' | 'Philippians' | 'Colossians' | '1 Thessalonians' |
  '2 Thessalonians' | '1 Timothy' | '2 Timothy' | 'Titus' | 'Philemon' |
  'Hebrews' | 'James' | '1 Peter' | '2 Peter' | '1 John' | '2 John' | '3 John' |
  'Jude' | 'Revelation';

export type Reference = {
  +book: string,
  +chapter: number,
  +verse?: number
}

export type Chapter = {
  +reference: Reference,
  +text: string
}

export type State = {
  +reading: Reference
}

export const DEFAULT = {reading: {book: 'Genesis', chapter: 1}};

export default (state: State = DEFAULT, action: Action) => {
  switch (action.type) {
    case 'next':
      return {
        reading: {book: state.reading.book, chapter: state.reading.chapter++}
      };
    default:
      (action: empty); // eslint-disable-line
      return state;
  }
};
