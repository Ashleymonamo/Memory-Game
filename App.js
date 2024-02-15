import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, TouchableOpacity, Modal, TextInput, Button } from 'react-native';


const Card = ({ card, onPress }) => {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress}>
      <Text style={styles.cardText}>{card.isFaceUp ? card.value : 'X'}</Text>
    </TouchableOpacity>
  );
};

export default function App() {

   // State variables to manage game data
  const [players, setPlayers] = useState([]); // Store player information and scores
  const [cards, setCards] = useState([]);// Store currently flipped cards
  const [flippedCards, setFlippedCards] = useState([]);// Control the visibility of the modal for entering player names
  const [modalVisible, setModalVisible] = useState(true); // Store player 1's name
  const [player1Name, setPlayer1Name] = useState('');// Store player 2's name
  const [player2Name, setPlayer2Name] = useState('');// Store player 1's name
  const [currentPlayer, setCurrentPlayer] = useState(0);// Track the current player

   // Generate cards for the game and initialize their state
  useEffect(() => {
    const generateCards = () => {
      const suits = ['♠', '♣', '♥', '♦'];
      const values = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];
      const deck = [];
      for (let suit of suits) {
        for (let value of values) {
          deck.push({ value, suit });
        }
      }
      return [...deck, { value: 'Joker', suit: 'Joker' }, { value: 'Joker', suit: 'Joker' }];
    };
    setCards(generateCards().map((card, index) => ({ ...card, isFaceUp: false, id: index })));
  }, []);

    // Handle when a card is pressed (flipped)
  const handleCardPress = (index) => {
    if (flippedCards.length === 2 || cards[index].isFaceUp) return;
    const newCards = [...cards];
    newCards[index].isFaceUp = true;
    setCards(newCards);
    setFlippedCards([...flippedCards, newCards[index]]);
  };

   // Check if the flipped cards match and update game state accordingly
  const checkMatch = () => {
    if (flippedCards.length === 2) {
      if (flippedCards[0].value === flippedCards[1].value && flippedCards[0].suit === flippedCards[1].suit) {
        setPlayers([
          ...players.slice(0, currentPlayer),
          { ...players[currentPlayer], score: players[currentPlayer].score + 1 },
          ...players.slice(currentPlayer + 1),
        ]);
        setFlippedCards([]);
      } else {
        setTimeout(() => {
          const newCards = cards.map(card => {
            if (flippedCards.some(flippedCard => flippedCard.id === card.id)) {
              return { ...card, isFaceUp: false };
            }
            return card;
          });
          setCards(newCards);
          setFlippedCards([]);
          setCurrentPlayer((currentPlayer + 1) % 2);
        }, 1000);
      }
    }
  };

  
  // Check for matches whenever flippedCards state changes
  useEffect(() => {
    checkMatch();
  }, [flippedCards]);

    // Start the game by setting player names and hiding the modal
  const handleStartGame = () => {
    setPlayers([
      { name: player1Name, score: 0 },
      { name: player2Name, score: 0 },
    ]);
    setModalVisible(false);
  };
  return (
    <View style={styles.container}>
      <Text>Open up App.js to start working on your app!</Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
