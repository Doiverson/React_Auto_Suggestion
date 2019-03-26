import React, { Component } from 'react';
import './App.css';
import AutoSuggest from './connection/autoSuggest';
import Mulitiple from './connection/mulitipleAutoSuggestion'

class App extends Component {


  render() {
    return (
      <div className="App">
        <AutoSuggest/>
        <Mulitiple/>
      </div>
    );
  }
}

export default App;
