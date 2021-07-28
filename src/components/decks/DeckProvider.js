import React, { useState, createContext } from "react";


export const DeckContext = createContext();

export const DeckProvider = (props) => {

    const [decks, setDecks] = useState([]);
    const [currentDeck, setCurrentDeck] = useState({});

    const getDecks = () => {
        return fetch("http://localhost:8088/decks?_expand=user")
        .then(res => res.json())
        .then(setDecks)
    };

    const addDeck = (deckObj) => {
        return fetch("http://localhost:8088/decks", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(deckObj)
        })
        .then(getDecks)
    };

    const getDeckById = (id) => {
        return fetch(`http://localhost:8088/decks/${id}?_expand=user`)
            .then(res => res.json())
    };

    const deleteDeck = (deckId) => {
        return fetch(`http://localhost:8088/decks/${deckId}`, {
            method: "DELETE"
        })
            .then(getDecks)
    };  

    const updateDeck = (deck) => {
        return fetch(`http://localhost:8088/decks/${deck.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(deck)
        })
          .then(getDecks)
    };

    const assignCurrentDeck = (currentlySelectedDeck) => {
        setCurrentDeck(currentlySelectedDeck);
    }

    return (
        <DeckContext.Provider value={{
            decks, getDecks, addDeck, deleteDeck, getDeckById, updateDeck, currentDeck, assignCurrentDeck
        }}>
            {props.children}
        </DeckContext.Provider>
    );
};