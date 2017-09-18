// @flow

// const chapterCounts = {
//   Genesis: 50,
//   Exodus: 40,
//   Leviticus: 27,
//   Numbers: 36,
//   Deuteronomy: 34,
//   Joshua: 24,
//   Judges: 21,
//   Ruth: 4,
//   '1 Samuel': 31,
//   '2 Samuel': 24,
//   '1 Kings': 22,
//   '2 Kings': 25,
//   '1 Chronicles': 29,
//   '2 Chronicles': 36,
//   Ezra: 10,
//   Nehemiah: 13,
//   Esther: 10,
//   Job: 42,
//   Psalm: 150,
//   Proverbs: 31,
//   Ecclesiastes: 12,
//   SongOfSolomon: 8,
//   Isaiah: 66,
//   Jeremiah: 52,
//   Lamentations: 5,
//   Ezekiel: 48,
//   Daniel: 12,
//   Hosea: 14,
//   Joel: 3,
//   Amos: 9,
//   Obadiah: 1,
//   Jonah: 4,
//   Micah: 7,
//   Nahum: 3,
//   Habakkuk: 3,
//   Zephaniah: 3,
//   Haggai: 2,
//   Zechariah: 14,
//   Malachi: 4,
//   Matthew: 28,
//   Mark: 16,
//   Luke: 24,
//   John: 21,
//   Acts: 28,
//   Romans: 16,
//   '1 Corinthians': 16,
//   '2 Corinthians': 13,
//   Galatians: 6,
//   Ephesians: 6,
//   Philippians: 4,
//   Colossians: 4,
//   '1 Thessalonians': 5,
//   '2 Thessalonians': 3,
//   '1 Timothy': 6,
//   '2 Timothy': 4,
//   Titus: 3,
//   Philemon: 1,
//   Hebrews: 13,
//   James: 5,
//   '1 Peter': 5,
//   '2 Peter': 3,
//   '1 John': 5,
//   '2 John': 1,
//   '3 John': 1,
//   Jude: 1,
//   Revelation: 22,
// };

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
  SongOfSolomon: 671,
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

// type Book = $Keys<typeof chapterCounts>;

export type Reference = {
  +book: string,
  +chapter: number,
  +verse?: number
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

  for (let current of Object.getOwnPropertyNames(chaptersBefore))
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

export const locationToReference = (location: Location): Reference => {
  const referenceString = location.pathname
    .slice(1)
    .replace(/\++/g, ' ')
    .replace(/^\s+/, '')
    .replace(/\s+$/, '')

  let [bookNumber, book, chapterAndVerse] = referenceString.split(/\s/);
  if (!/^\d+$/.test(bookNumber))
    [book, chapterAndVerse, bookNumber] = [bookNumber, book, ''];

  const [chapter, verse] = chapterAndVerse != null?
    chapterAndVerse.split(':') : [1, 1];

  return {
    book: (bookNumber? bookNumber + ' ' : '') +
          book[0].toUpperCase() +
          book.slice(1).toLowerCase(),
    chapter: parseInt(chapter, 10),
    verse: verse == null? 1 : parseInt(verse, 10)
  };
};

