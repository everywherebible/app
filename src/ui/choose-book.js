import React, {Component} from 'react';
import {Link} from 'react-router-dom';

import {books} from '../data';
import './choose-book.css';

export default class ChooseBook extends Component {
  onChange = event => this.setState({q: event.currentTarget.value});

  item = (book, i) =>
    <Link
        to={`${this.props.match.path}/${book}`}
        key={book}
        style={{
          display: 'block',
          textAlign: 'left',
          textDecoration: 'none',
          color: 'black',
          padding: '1rem',
          borderTop: `${i === 0? 0 : 1}px solid #555`,
        }}>
      {book}
    </Link>;


  constructor() {
    super();
    this.state = {q: ''};
  }

  emptyQueryResults() {
    return <div>{books.map(this.item)}</div>;
  }

  results() {
    const q = this.state.q.toLowerCase();
    const matches = books
        .filter(book => book.toLowerCase().includes(q))
        .map(this.item);

    if (matches.length)
      // TODO: tokenize
      return <div>{matches}</div>;
    else
      return <div style={{padding: '1rem'}}>No matches found</div>;
  }

  render() {
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
      {this.state.q? this.results() : this.emptyQueryResults()}
    </div>;
  }
}
