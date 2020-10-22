import React from 'react';
import ReactDOM from 'react-dom';

import AppBar from '@material-ui/core/AppBar';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';

import _ from 'underscore'

import './index.css';

const BOARDWIDTH = 4;
const BOARDHEIGHT = 4;
const BOARDSIZE = BOARDWIDTH * BOARDHEIGHT;
const NUMBER_OF_PLAYERS = 2;
const PLAYER_NAMES = ["Player 1", "Player 2"];


class Card extends React.Component {
	constructor(props){
		super(props);
		this.state = {
			image: props.image,
		}
	}

	render () {
		return (
			<Button 
				className={`card ${this.props.flipped ? 'card-'+this.state.image : 'card-back'}`}
				key={'button-card-'+this.state.image}
				onClick={() => {
					this.props.onClick();
				}}>

			</Button>
		);		
	}
}


class Game extends React.Component {
	constructor(props){
		super(props);
		this.state = {
			cardValues:_.shuffle(Array.from({length: BOARDSIZE}, (_, i) => Math.ceil((i+1)/2))),
			showFront: Array(BOARDSIZE).fill(false),
			activeCards: Array(2).fill(null),
			playerScores: Array(NUMBER_OF_PLAYERS).fill(0),
			currentPlayer: 0,
		}  
	}

  handleClick(i) {
  	let showFront = this.state.showFront.slice();
		let activeCards = this.state.activeCards.slice();
		let playerScores = this.state.playerScores.slice();
  	let cardValues = this.state.cardValues;
		let currentPlayer = this.state.currentPlayer;

  	if (showFront[i] === true){ return; }

  	if (activeCards[0] != null && activeCards[1] != null){
	  	if (!(calculatePair(activeCards[0], activeCards[1], cardValues)))	 {
	  		showFront[activeCards[0]] = false;
	  		showFront[activeCards[1]] = false;
	  		this.setState({
	  			showFront: showFront,
	  		})
  		}
  		activeCards = Array(2).fill(null);
		}

  	showFront[i] = true;

  	var active = activeCards[0] === null ? 0 : 1;
  	activeCards[active] = i;

  	if (activeCards[0] != null && activeCards[1] != null){
   		if (calculatePair(activeCards[0], activeCards[1], cardValues)) {
	  		playerScores[currentPlayer] = playerScores[currentPlayer] + 1;
			}
	  	currentPlayer = (currentPlayer+1)%NUMBER_OF_PLAYERS;	
  	}

  	this.setState({
  		playerScores: playerScores,
  		showFront: showFront,
  		currentPlayer: currentPlayer,
  		activeCards: activeCards,
  	});
  }

  renderCard(index, image) {
    return (
    	<Card 
    		flipped={this.state.showFront[index]}
    		image={image}
    		onClick={() => this.handleClick(index)}
    		key={"card-"+index}
			/>
		);
  }

	render() {
		let boardList = [];
		for (var row = 0; row < BOARDHEIGHT; row++) {
			let cardList = [];
			for (var card = 0; card < BOARDWIDTH; card++) {
				let i = card + BOARDWIDTH*row;
				cardList.push(
					<Box
						boxShadow={3}
						m={1}
						p={1}
						style={{width: '6rem', heigh: '5rem'}}
						key={"box-"+i}
					>
						{this.renderCard(i, this.state.cardValues[i])}
					</Box>
				)
			};

			boardList.push(
				<Grid container className="board-row" key={"board-row-"+row}>
					{cardList}
        </Grid>
			)
		}

		return (
			<div>
				<HeaderBar/>
				<Grid container spacing={1} className="game" justify="center">
					<GameInfo className="game-info" playerScores={this.state.playerScores} currentPlayer={this.state.currentPlayer}/>
    			<Grid item xs={6}>
						<Box className="game-board">
							{boardList}
						</Box>
      		</Grid>
				</Grid>
			</div>
  	);
	}
}

class GameInfo extends React.Component {
	render() {
		let status = PLAYER_NAMES[this.props.currentPlayer] + "'s Turn";
		if (calculateWinner(this.props.playerScores)){
			if (this.props.playerScores.every((val, i) => val === this.props.playerScores[0])){
				status = "Tie Game";
			}
			else {	
				let maxIndex = _.indexOf(this.props.playerScores, _.max(this.props.playerScores));
				status = PLAYER_NAMES[maxIndex] + " wins!";
			}
		}

		let scores = this.props.playerScores;
		let scoreList = [];
		scores.forEach((score, index) => {
			scoreList.push(
				<Grid item xs={12} sm={4} key={"grid-player-score-"+index}>
					<Box bgcolor="info.main" color="info.contrastText" p={2} key={"player-score"+index}>
	        	{PLAYER_NAMES[index]}: {score}
		    	</Box>
				</Grid>
			)
		})

		return (
			<Grid container spacing={1} className="game-info">
		  	{scoreList}
		  	<Grid item xs={12} sm={4}>
					<Box className="status" bgcolor="info.main" color="info.contrastText" p={2}>
						{status}
        	</Box>
				</Grid>
			</Grid>
		)
	}
}


class HeaderBar extends React.Component {
  render() {
	  return (
	  	<div>
	      <AppBar position="static">
	        <Toolbar>
	          <Typography variant="h4" className="title">
	            Memory Matching Game
	          </Typography>
	        </Toolbar>
	      </AppBar>
	    </div>
	  );
	}
}


class MemoryMatchApp extends React.Component {
	render() {
		return (
			<div className="memory-match-app">
				<link rel="stylesheet" href="https://fonts.googleapis.com/css?family=Roboto:300,400,500,700&display=swap" />
   			<Game/>
			</div>
		)
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
	let sum = _.reduce(scores, (a, b)=>{return a+b});
	if (sum === BOARDSIZE/2) {
		return true;
	}

	return false;
}

// ========================================

ReactDOM.render(
  <MemoryMatchApp/>,
  document.getElementById('root')
);
