import assert from "assert";

import {results} from "./choose-book";
import {books} from "../data/model";

const MARK_1 = {book: "Mark", chapter: 1, verse: 1};
const ONE_TIMOTHY_3 = {book: "1 Timothy", chapter: 3, verse: 1};
const ONE_JOHN_2 = {book: "1 John", chapter: 2, verse: 1};
const JOHN = {book: "John", chapter: 4, verse: 1};

describe("choose-book", () => {
  describe("results", () => {
    it("returns a list of books for no query or recents", () => {
      const actual = results("", []);
      assert.deepStrictEqual(actual, books);
    });

    it("returns recents and books when < 10 recents and no query", () => {
      const actual = results("", [MARK_1, ONE_TIMOTHY_3]);
      const expected = [MARK_1, ONE_TIMOTHY_3, ...books.slice(0, 8)];
      assert.deepStrictEqual(actual, expected);
    });

    it("returns matches with query", () => {
      const actual = results("ma", []);
      const expected = ["Malachi", "Matthew", "Mark"];
      assert.deepStrictEqual(actual, expected);
    });

    it("sorts recent matches above others", () => {
      const actual = results("ma", [MARK_1]);
      const expected = [MARK_1, "Malachi", "Matthew", "Mark"];
      assert.deepStrictEqual(actual, expected);
    });

    it("correctly tokenizes numbered books", () => {
      const actual = results("jo", [ONE_JOHN_2]);
      const expected = [
        ONE_JOHN_2,
        "Joshua",
        "Job",
        "Joel",
        "Jonah",
        "John",
        "1 John",
        "2 John",
        "3 John",
      ];
      assert.deepStrictEqual(actual, expected);
    });
  });
});
