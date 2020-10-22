import React from 'react';
import ReactDOM from 'react-dom';
import _ from 'underscore'
import './index.css';


// TODO - boardsize setting (difficulty setting)
// TODO - number of players setting
// TODO - new game button
// TODO - undo button
// TODO - redo button


const BOARDSIZE = 16;
const NUMBER_OF_PLAYERS = 2;

class Card extends React.Component {
	constructor(props){
		super(props);
		this.state = {
			image: props.image,
		}
	}

	render () {
		return (
			<button 
				className={`card ${this.props.flipped ? 'card-'+this.state.image : 'cardBack'}`}
				onClick={() => {
					this.props.onClick();
				}}>
			</button>
		);		
	}
}

class Board extends React.Component {
  constructor(props){
  	super(props);
  	this.state = {
  		cardValues: _.shuffle([1, 1, 2, 2, 3, 3, 4, 4, 5, 5, 6, 6, 7, 7, 8, 8]), 
  		showFront: Array(BOARDSIZE).fill(false),
  		activeCards: Array(2).fill(null),
  		playerScores: Array(NUMBER_OF_PLAYERS).fill(0),
  		player1turn: true,
  	};
  }

  handleClick(i) {
  	// data is immutable
  	let showFront = this.state.showFront.slice();
	let activeCards = this.state.activeCards.slice();
	let playerScores = this.state.playerScores.slice();
  	let cardValues = this.state.cardValues;
	let player1turn = this.state.player1turn;

  	// ignore case of a clicked card already being turned over
  	if (showFront[i] === true){
  		return;
  	}


	// some extra calculations if both cards are face up 
  	if (activeCards[0] != null && activeCards[1] != null){
   		if (calculatePair(activeCards[0], activeCards[1], cardValues)) {
	   		// increment current player's score
	  		if (player1turn){
	  			playerScores[0] = playerScores[0] + 1;
	  		}
	  		else {
	  			playerScores[1] = playerScores[1] + 1;
	  		}
  		}

  		// flip two cards back if they're not a pair
	  	else {
	  		showFront[activeCards[0]] = false;
	  		showFront[activeCards[1]] = false;
	  		this.setState({
	  			showFront: showFront,
	  		})
  		}

	  	if (calculateWinner(this.state.playerScores)) {
  			return;
  		}

	  	// it's the next player's turn
	  	player1turn = !player1turn;	
  		activeCards = Array(2).fill(null);
	}

	// flip the clicked card over
  	showFront[i] = true;

  	// set active cards 
  	var active = activeCards[0] === null ? 0 : 1;
  	activeCards[active] = i;


  	// update our state
  	this.setState({
  		playerScores: playerScores,
  		showFront: showFront,
  		player1turn: player1turn,
  		activeCards: activeCards,
  	});
  }

  renderCard(index, image) {
    return (
    	<Card 
    		flipped={this.state.showFront[index]}
    		image={image}
    		onClick={() => this.handleClick(index)}
		/>
	);
  }

  render() {
	let playerturn = this.state.player1turn ? 'Player 1\'s turn' : 'Player 2\'s turn';
	let player1score = 'Player 1: ' + this.state.playerScores[0];
	let player2score = 'Player 2: ' + this.state.playerScores[1];
	
	return (
		// TODO - this is a mess too 
      <div>
        <div className="status">
        	<div>{playerturn}</div>
        	<div>{player1score}</div>
        	<div>{player2score}</div>
        </div>
        <div className="board-row">
          {this.renderCard(0, this.state.cardValues[0])}
          {this.renderCard(1, this.state.cardValues[1])}
          {this.renderCard(2, this.state.cardValues[2])}
          {this.renderCard(3, this.state.cardValues[3])}
        </div>
        <div className="board-row">
          {this.renderCard(4, this.state.cardValues[4])}
          {this.renderCard(5, this.state.cardValues[5])}
          {this.renderCard(6, this.state.cardValues[6])}
          {this.renderCard(7, this.state.cardValues[7])}
        </div>
        <div className="board-row">
          {this.renderCard(8, this.state.cardValues[8])}
          {this.renderCard(9, this.state.cardValues[9])}
          {this.renderCard(10, this.state.cardValues[10])}
          {this.renderCard(11, this.state.cardValues[11])}
        </div>
        <div className="board-row">
          {this.renderCard(12, this.state.cardValues[12])}
          {this.renderCard(13, this.state.cardValues[13])}
          {this.renderCard(14, this.state.cardValues[14])}
          {this.renderCard(15, this.state.cardValues[15])}
        </div>
      </div>
    );
  }
}

class Game extends React.Component {
  render() {
    return (
      <div className="game">
        <div className="game-board">
          <Board />
        </div>
        <div className="game-info">
          <div>{/* status */}</div>
          <ol>{/* TODO */}</ol>
        </div>
      </div>
    );
  }
}
	
	
function calculatePair(card1, card2, cardValues) {
	if (card1 === null){
		return;
	}
	if (card2 === null){
		return;
	}

	if (cardValues[card1] === cardValues[card2]) {
		return true;
	}
	return false;
}

function calculateWinner(scores) {
	let player1 = scores[0];
	let player2 = scores[1];

	if (player1 + player2 === 8) {
		return true;
	}
	return false;
}

// ========================================

ReactDOM.render(
  <Game />,
  document.getElementById('root')
);
