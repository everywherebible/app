import React, {Component} from 'react';
import {Link} from 'react-router-dom';

import {books, referenceToLocation} from '../data/model';
import './choose-book.css';

let _tokens;

const tokens = () => {
  if (!_tokens) {
    _tokens = books.reduce((_tokens, book) => {
      const parts = book.split(' ');

      while (!Number.isNaN(parseInt(parts[0], 10)))
        parts.shift();

      const token = parts.join(' ').toLowerCase();

      _tokens.set(token, [...(_tokens.get(token) || []), book]);

      return _tokens;
    }, new Map());
  }

  return _tokens;
};

export const results = (query, recents) => {
  if (query) {
    const q = query.toLowerCase();
    const recentBooks = new Set(recents.map(r => r.book));
    const matchingBooks = Array.from(tokens().entries())
      .filter(([k, v]) => k.startsWith(q))
      .reduce((matching, [k, v]) => [...matching, ...v], []);
    const matchingRecents = recents.filter(r => matchingBooks.includes(r.book));

    return [
      ...matchingRecents,
      ...matchingBooks.filter(book => !recentBooks.has(book))
    ];
  } else {
    if (recents.length)
      if (recents.length < 10)
        return [...recents, ...books.slice(0, 10 - recents.length)];
      else
        return recents;
    else
      return books;
  }
};

const LookupLink = ({to, text, i, onClick}) =>
  <Link
      to={to}
      onClick={onClick}
      style={{
        display: 'block',
        textAlign: 'left',
        textDecoration: 'none',
        padding: '1rem',
        borderTop: `${i === 0? 0 : 1}px solid #555`,
      }}>
    {text}
  </Link>;

export default class ChooseBook extends Component {
  onChange = event => this.setState({q: event.currentTarget.value});

  item = (object, i) =>
    object.book != null && object.chapter != null && object.verse != null?
      <LookupLink
        to={referenceToLocation(object)}
        text={`${object.book} ${object.chapter}`}
        key={i}
        i={i}
        onClick={() => this.props.addRecent(object)}/> :
      <LookupLink
        to={`${this.props.match.path}/${object}`}
        text={object}
        key={i}
        i={i}/>;

  constructor() {
    super();
    this.state = {q: ''};
  }

  componentDidMount() {
    this.props.populateStoreWithRecents();
  }

  render() {
    const r = results(this.state.q, this.props.recents);
    return <div
        className="fit"
        style={{textAlign: 'center', paddingTop: '1rem', overflowY: 'scroll'}}>
      <input
        type='search'
        value={this.state.q}
        placeholder='Enter a book'
        autoFocus
        className='find-input'
        style={{
        }}
        onChange={this.onChange}/>
      {r.length?
        r.map(this.item) :
        <div style={{padding: '1rem'}}>No matches found</div>}
    </div>;
  }
}
