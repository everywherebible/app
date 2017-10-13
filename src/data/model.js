// @flow

export const chapterCounts = {
  Genesis: 50,
  Exodus: 40,
  Leviticus: 27,
  Numbers: 36,
  Deuteronomy: 34,
  Joshua: 24,
  Judges: 21,
  Ruth: 4,
  '1 Samuel': 31,
  '2 Samuel': 24,
  '1 Kings': 22,
  '2 Kings': 25,
  '1 Chronicles': 29,
  '2 Chronicles': 36,
  Ezra: 10,
  Nehemiah: 13,
  Esther: 10,
  Job: 42,
  Psalm: 150,
  Proverbs: 31,
  Ecclesiastes: 12,
  'Song of Solomon': 8,
  Isaiah: 66,
  Jeremiah: 52,
  Lamentations: 5,
  Ezekiel: 48,
  Daniel: 12,
  Hosea: 14,
  Joel: 3,
  Amos: 9,
  Obadiah: 1,
  Jonah: 4,
  Micah: 7,
  Nahum: 3,
  Habakkuk: 3,
  Zephaniah: 3,
  Haggai: 2,
  Zechariah: 14,
  Malachi: 4,
  Matthew: 28,
  Mark: 16,
  Luke: 24,
  John: 21,
  Acts: 28,
  Romans: 16,
  '1 Corinthians': 16,
  '2 Corinthians': 13,
  Galatians: 6,
  Ephesians: 6,
  Philippians: 4,
  Colossians: 4,
  '1 Thessalonians': 5,
  '2 Thessalonians': 3,
  '1 Timothy': 6,
  '2 Timothy': 4,
  Titus: 3,
  Philemon: 1,
  Hebrews: 13,
  James: 5,
  '1 Peter': 5,
  '2 Peter': 3,
  '1 John': 5,
  '2 John': 1,
  '3 John': 1,
  Jude: 1,
  Revelation: 22,
};

const chaptersBefore = {
  Genesis: 0,
  Exodus: 50,
  Leviticus: 90,
  Numbers: 117,
  Deuteronomy: 153,
  Joshua: 187,
  Judges: 211,
  Ruth: 232,
  '1 Samuel': 236,
  '2 Samuel': 267,
  '1 Kings': 291,
  '2 Kings': 313,
  '1 Chronicles': 338,
  '2 Chronicles': 367,
  Ezra: 403,
  Nehemiah: 413,
  Esther: 426,
  Job: 436,
  Psalm: 478,
  Proverbs: 628,
  Ecclesiastes: 659,
  'Song of Solomon': 671,
  Isaiah: 679,
  Jeremiah: 745,
  Lamentations: 797,
  Ezekiel: 802,
  Daniel: 850,
  Hosea: 862,
  Joel: 876,
  Amos: 879,
  Obadiah: 888,
  Jonah: 889,
  Micah: 893,
  Nahum: 900,
  Habakkuk: 903,
  Zephaniah: 906,
  Haggai: 909,
  Zechariah: 911,
  Malachi: 925,
  Matthew: 929,
  Mark: 957,
  Luke: 973,
  John: 997,
  Acts: 1018,
  Romans: 1046,
  '1 Corinthians': 1062,
  '2 Corinthians': 1078,
  Galatians: 1091,
  Ephesians: 1097,
  Philippians: 1103,
  Colossians: 1107,
  '1 Thessalonians': 1111,
  '2 Thessalonians': 1116,
  '1 Timothy': 1119,
  '2 Timothy': 1125,
  Titus: 1129,
  Philemon: 1132,
  Hebrews: 1133,
  James: 1146,
  '1 Peter': 1151,
  '2 Peter': 1156,
  '1 John': 1159,
  '2 John': 1164,
  '3 John': 1165,
  Jude: 1166,
  Revelation: 1167
};

export const CHAPTER_COUNT = 1189;

type Book = $Keys<typeof chapterCounts>;

export const books: Array<Book> = Object.getOwnPropertyNames(chaptersBefore);

export type Reference = {
  +book: Book,
  +chapter: number,
  +verse: number
}

export type Chapter = {
  +reference: Reference,
  +text: string
}

export const chapterIndex = (reference: Reference): number => {
  return chaptersBefore[reference.book] + reference.chapter - 1;
}

export const reference = (index: number): Reference => {
  let book;

  for (let current of books)
    if (chaptersBefore[current] <= index)
      book = current
    else
      break;

  if (book == null)
    throw new Error('reference index is out of range');

  return {book, chapter: index - chaptersBefore[book] + 1, verse: 1};
}

export const before = (ref: Reference): Reference => {
  const index = chapterIndex(ref);
  const indexBefore =
    (((index - 1) % CHAPTER_COUNT) + CHAPTER_COUNT) % CHAPTER_COUNT
  return reference(indexBefore);
}

export const after = (ref: Reference): Reference =>
  reference((chapterIndex(ref) + 1) % CHAPTER_COUNT);

export const stringToReference = (referenceString: string): Reference => {
  let [bookNumber, book, chapterAndVerse] = referenceString.split(/\s/);

  if (!/^\d+$/.test(bookNumber))
    [book, chapterAndVerse, bookNumber] = [bookNumber, book, ''];

  const [chapter, verse] = chapterAndVerse != null?
    chapterAndVerse.split(':') : [1, 1];

  return {
    book: (((bookNumber? bookNumber + ' ' : '') +
          book[0].toUpperCase() +
          book.slice(1).toLowerCase()): any),
    chapter: parseInt(chapter, 10),
    verse: verse == null? 1 : parseInt(verse, 10)
  };
}

export const locationToReference = (location: Location): Reference =>
  stringToReference(decodeURI(location.pathname)
    .slice(1)
    .replace(/\++/g, ' ')
    .replace(/^\s+/, '')
    .replace(/\s+$/, ''));

export const chapterToLocation = ({book, chapter}: Reference): string =>
  `/${book}+${chapter}`;

export const referenceToLocation = (reference: Reference): string =>
  `/${reference.book}+${reference.chapter}:${reference.verse}`;

export const isEqual = (a: Reference, b: Reference): boolean =>
  a.book === b.book && a.chapter === b.chapter && a.verse === b.verse;

/** Convert a Reference to the element ID the ESV API puts in their markup.
 *
 * The v2 ESV API marks up the verses with:
 *
 *     <span class=verse-num id=vBBCCCVVV-X>VVV</span>
 *
 * Where BB is the book number, CCC is the chapter number, and VVV is the verse
 * number. These numbers are all 0-padded and start at one, so Genesis 1:1
 * would be v01001001-1.
 *
 * This is the inverse of verseNumIdToReference.
 */
export const referenceToVerseNumId = (r: Reference): string => {
  const bookIdx = books.indexOf(r.book) + 1;
  const book = bookIdx.toLocaleString('en', {minimumIntegerDigits: 2});
  const chapter = r.chapter.toLocaleString('en', {minimumIntegerDigits: 3});
  const verse = r.verse.toLocaleString('en', {minimumIntegerDigits: 3});

  return `v${book}${chapter}${verse}-1`;
};

/** Convert an element ID the ESV API puts in their markup to a reference.
 *
 * The v2 ESV API marks up the verses with:
 *
 *     <span class=verse-num id=vBBCCCVVV-X>VVV</span>
 *
 * Where BB is the book number, CCC is the chapter number, and VVV is the verse
 * number. These numbers are all 0-padded and start at one, so Genesis 1:1
 * would be v01001001-1.
 *
 * This is the inverse of referenceToVerseNumId.
 */
export const verseNumIdToReference = (id: string): Reference => {
  const parsed = id.match(/^v(\d\d)(\d\d\d)(\d\d\d)/);

  if (parsed == null)
    throw new Error(`cannot convert ${id} to reference`);

  const [, book, chapter, verse] = parsed;

  return {
    book: books[parseInt(book, 10) - 1],
    chapter: parseInt(chapter, 10),
    verse: parseInt(verse, 10),
  };
};


