import React, { Component } from "react";
import "./App.css";

class App extends Component {
  state = {
    username: "",
    id: null
  };

  handleInput = event => {
    this.setState({ username: event.target.value });
  };

  getSummonerId = event => {
    event.preventDefault();
    const url = `http://localhost:4000/calling?name=${this.state.username}`;
    fetch(url)
      .then(response => response.json())
      .then(myJson => this.setState({ id: JSON.stringify(myJson) }));
  };

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <p>Username: {this.state.username}</p>
          <p>ID: {this.state.id}</p>
          <form onSubmit={this.getSummonerId}>
            <label>
              Name:
              <input
                type="text"
                value={this.state.username}
                placeholder="Enter summoner name"
                onChange={this.handleInput}
                autofocus="true"
              />
            </label>
            <br />
            <br />
            <input type="submit" value="Submit" />
          </form>
        </header>
      </div>
    );
  }
}

export default App;
