import React, { Component } from "react";
import "./App.css";
import Card from "./components/Card";

class App extends Component {
  state = {
    username: "",
    champs: null
  };

  handleInput = event => {
    this.setState({ username: event.target.value });
  };

  getSummonerData = event => {
    event.preventDefault();
    const url = `http://localhost:4000/calling?name=${this.state.username}`;
    fetch(url)
      .then(response => response.json())
      .then(myJson => this.setState({ champs: myJson }));
  };

  showCards() {
    // prevent access to state before it's set
    if (this.state.champs !== null) {
      let champs = this.state.champs;
      let imgUrl =
        "http://ddragon.leagueoflegends.com/cdn/8.23.1/img/champion/";

      return champs.map(champ => (
        <Card key={champ} name={champ} imgSrc={`${imgUrl}${champ}.png`} />
      ));
    }
  }

  capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  render() {
    return (
      <div className="App">
        <div className="App_main">
          <p>Username: {this.state.username}</p>
          <form onSubmit={this.getSummonerData}>
            <label>
              Name:
              <input
                type="text"
                value={this.state.username}
                placeholder="Enter summoner name"
                onChange={this.handleInput}
                autoFocus={true}
                required
              />
            </label>
            <br />
            <br />
            <input type="submit" value="Submit" />
          </form>
        </div>

        <div className="card_wrapper">{this.showCards()}</div>
      </div>
    );
  }
}

export default App;
