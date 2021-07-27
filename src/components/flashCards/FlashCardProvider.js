import React, { useState, createContext } from "react";

const userId = parseInt(sessionStorage.getItem("pandaAja_user"));

export const FlashCardContext = createContext();

export const FlashCardProvider = (props) => {

    const [flashCards, setFlashCards] = useState([]);
    const [userDeckFlashCards, setCardsInTheDeck] = useState([]);

    const getFlashCards = () => {
        return fetch("http://localhost:8088/flashCards?_expand=deck&_expand=user")
        .then(res => res.json())
        .then(setFlashCards)
    };

    // this function gets all the flashcards of the user that is logged in that are related to the deck that was selected.
    const getAllCardsInThisDeck = (deckId) => {
        console.log('deck id', deckId);
        // this is here in case the user refreshes the page so that the app can remember what deck they were looking at.
        if (typeof deckId === 'undefined') {
            deckId = parseInt(sessionStorage.getItem("lastDeckView"));    
        }
        return fetch("http://localhost:8088/flashCards?_expand=deck&_expand=user")
        .then(res => res.json())
        .then((flashCards) => {
            let filteredDeckFlashCards = flashCards.filter((flashCard) => {
                console.log("flash card", flashCard);
                if (deckId === flashCard.deckId) {
                    return flashCard;
                }
            });
            console.log('filtered flashcards', filteredDeckFlashCards);
            return setCardsInTheDeck(filteredDeckFlashCards);
        })
    };

    const addFlashCard = (flashCardObj) => {
        return fetch("http://localhost:8088/flashCards", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(flashCardObj)
        })
        .then(getFlashCards)
    };

    const getFlashCardById = (id) => {
        return fetch(`http://localhost:8088/flashCards/${id}?_expand=deck`)
            .then(res => res.json())
    };

    const deleteFlashCard = (flashCardId) => {
        return fetch(`http://localhost:8088/flashCards/${flashCardId}`, {
            method: "DELETE"
        })
            .then(getFlashCards)
    };  

    const updateFlashCard = (flashCard) => {
        return fetch(`http://localhost:8088/flashCards/${flashCard.id}`, {
          method: "PUT",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify(flashCard)
        })
          .then(getFlashCards)
    };

    return (
        <FlashCardContext.Provider value={{
            flashCards, getFlashCards, addFlashCard, deleteFlashCard, getFlashCardById, updateFlashCard, getAllCardsInThisDeck, userDeckFlashCards
        }}>
            {props.children}
        </FlashCardContext.Provider>
    );
};