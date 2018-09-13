// @flow

const _translations = {'kjv': 1, 'esv': 1};
export type Translation = $Keys<typeof _translations>;
export const translations: Array<Translation> = Object.keys(_translations);

export const chaptersBefore = {
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

export type Book = $Keys<typeof chaptersBefore>;

export const books: Array<Book> = Object.getOwnPropertyNames(chaptersBefore);

export const chapterCounts = books.reduce((chapterCounts, book, i) => {
  if (i === 0)
    return chapterCounts;
  else if (i === 1)
    chapterCounts[books[i - 1]] = chaptersBefore[book];
  else
    chapterCounts[books[i - 1]] =
      chaptersBefore[book] - chaptersBefore[books[i - 1]];

  return chapterCounts;
}, {});

export type Reference = {|
  +book: Book,
  +chapter: number,
  +verse: number
|};

export type Chapter = {|
  +reference: Reference,
  +text: string
|};

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

export const pathStringToReference = (referenceString: string): Reference => {
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

export const apiPathToReference = (pathname: string): Reference => {
  let [,,,, dashedBook, chapterDotHtml] = pathname.split('/');
  dashedBook = dashedBook.replace('psalms', 'psalm');
  const book = books
    .filter(b => b.toLowerCase().replace(/ /g, '-') === dashedBook)[0];
  const chapter = parseInt(chapterDotHtml.split('.')[0], 10);

  if (!book || Number.isNaN(chapter))
    throw new Error(`Could not convert ${pathname} to a reference.`);

  return {book, chapter, verse: 1};
}

export const locationToReference = (location: Location): Reference =>
  pathStringToReference(decodeURI(location.pathname)
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
 * This has also been updated to handle the markup pre-processing I do that
 * wraps the entire verse in a span that starts with "vt", so something like
 * "vt01001001-1".
 *
 * This is the inverse of referenceToVerseNumId.
 */
export const verseNumIdToReference = (id: string): Reference => {
  const parsed = id.match(/^vt?(\d\d)(\d\d\d)(\d\d\d)/);

  if (parsed == null)
    throw new Error(`cannot convert ${id} to reference`);

  const [, book, chapter, verse] = parsed;

  return {
    book: books[parseInt(book, 10) - 1],
    chapter: parseInt(chapter, 10),
    verse: parseInt(verse, 10),
  };
};


