import React, {Component} from 'react';
import './App.css';

import $ from 'jquery';

class App extends Component {

  constructor(props) {
    super(props);

    this.state = {
      searchResults: [],
      searchHistory: [],
      searchTerm: ''
    }

    this.updateSearchTerm = this.updateSearchTerm.bind(this);
    this.search = this.search.bind(this);
    this.onKeyDown = this.onKeyDown.bind(this);
  }

  componentDidMount() {
    $.get('http://api.giphy.com/v1/gifs/trending?api_key=C4tpE7Q8Zqw1IldhFdtqKX74memLM6qh', function(data) {
      this.setState({searchResults: data.data});
    }.bind(this));
  }

  updateSearchTerm(e) {
    let searchTerm = e.target ? e.target.value : e;
    this.setState({searchTerm: searchTerm});
    return !e.target && this.search(searchTerm);
  }

  search(input) {
    let searchTerm = typeof input === 'string' ? input : this.state.searchTerm;
    let searchHistory = this.state.searchHistory;
    searchHistory.unshift(searchTerm);

    $.get('http://api.giphy.com/v1/gifs/search?api_key=C4tpE7Q8Zqw1IldhFdtqKX74memLM6qh&q=' + searchTerm, function(data) {
      this.setState({searchHistory: searchHistory, searchResults: data.data});

    }.bind(this));
  }

  onKeyDown(e) {
    if (e.key === 'Enter') {
      this.search();
    }
  }

  render() {
    return (<div className="App">
      <header className="App-header">
        <h1 className="App-title">Next-Gen Giphy</h1>
      </header>
      <div style={{
          display: 'flex',
          flexDirection: 'row'
        }}>
        <div style={{
            display: 'flex',
            flex: 3,
            flexDirection: 'row',
            flexWrap: 'wrap'
          }}>
          {
            this.state.searchResults.map((d, i) => {
              return (
                <div key={i}>
                  <img width="100%" src={d.images.original.url}/>
                </div>
              )
            })
          }
        </div>
        <div style={{
            display: 'flex',
            flex: 1,
            flexDirection: 'column'
          }}>
          <input autoFocus type="text"
            onChange={this.updateSearchTerm}
            value={this.state.searchTerm}
            onKeyDown={this.onKeyDown} />
          <button onClick={this.search}>Search</button>
          <p>Search history</p>
          {
            this.state.searchHistory.map((d, i) => {
              return (<p key={i} onClick={() => {this.updateSearchTerm(d)}}>{d}</p>)
            })
          }
        </div>
      </div>
    </div>);
  }
}

export default App;
