import React, { Component } from "react";
import "./App.css";
import Card from "./components/Card";

import { scroller } from "react-scroll";
import { Element } from "react-scroll";

class App extends Component {
  state = {
    username: "",
    champs: undefined,
    version: undefined
  };

  handleInput = event => {
    this.setState({ username: event.target.value });
  };

  getSummonerData = event => {
    event.preventDefault();
    const url = `http://localhost:4000/api?name=${this.state.username}`;
    fetch(url)
      .then(response => response.json())
      .then(myJson =>
        this.setState({ champs: myJson.result, version: myJson.version })
      );
  };

  showCards() {
    // prevent access to state before it's set
    if (this.state.champs !== undefined) {
      let champs = this.state.champs;
      let imgUrl = `http://ddragon.leagueoflegends.com/cdn/${
        this.state.version
      }/img/champion/`;

      return champs.map(champ => (
        <Card key={champ} name={champ} imgSrc={`${imgUrl}${champ}.png`} />
      ));
    } else {
      return;
    }
  }

  scrollToElement = element => {
    scroller.scrollTo(element, {
      duration: 1500,
      delay: 100,
      smooth: true
    });
  };

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
            <input
              type="submit"
              value="Submit"
              onClick={() => this.scrollToElement("cards")}
            />
          </form>
        </div>

        <Element name="cards">
          <div className="card_wrapper">{this.showCards()}</div>
        </Element>
      </div>
    );
  }
}

export default App;
