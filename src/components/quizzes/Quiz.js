import React, { useContext, useEffect, useState } from "react";
import { DeckContext } from "../decks/DeckProvider";
import { FlashCardContext } from "../flashCards/FlashCardProvider";
import { QuizDetail } from "./QuizDetail";
import "./Quiz.css"



export const Quiz = () => {

    const { decks, getDecks } = useContext(DeckContext);
    const { userDeckFlashCards, getAllCardsInThisDeck } = useContext(FlashCardContext);

    const [quizSelection, setQuizSelection] = useState({
        isQuizSelected: false,
        deckId: 0,
        flashcards: [],
        currentDeck: {},
    });

    useEffect(() => {
        getDecks()
        .then(getAllCardsInThisDeck)
    }, []);

    const handleDeckSelection = (event) => {
        const deck = event
        const newDeckQuiz = {...quizSelection}
        // if user clicks on the same deck again, value of isQuizSelected will stay false so quiz detail component is not rendered
        if (newDeckQuiz["deckId"] === deck.id) { 
            newDeckQuiz["deckId"] = deck.id
            newDeckQuiz["isQuizSelected"] = false
            newDeckQuiz["flashcards"] = userDeckFlashCards
            newDeckQuiz["currentDeck"] = deck;
        // else, change value of isQuizSelected property to true to render the QuizDetail component
        } else {
            newDeckQuiz["deckId"] = deck.id
            newDeckQuiz["isQuizSelected"] = true
            newDeckQuiz["flashcards"] = userDeckFlashCards
            newDeckQuiz["currentDeck"] = deck;
        }
        // console.log("new deck quiz", newDeckQuiz, "event", event);
        //setting state with new values
        setQuizSelection(newDeckQuiz)
    };

    const showNextFlashCard = (cardsInDeck) => {

        //for each loop through userDeckFlashCards instead and store data in next card?
        let nextCard = cardsInDeck[cardsInDeck.length]
        setQuizSelection({
            currentCard: nextCard
        })
    };


    return (
        <div className="quizDiv">
            <h1 className="quizHeader">Quiz Self</h1>
            <div className="deckDropdown">
                <label className="quizLabel" htmlFor="deckTopicSelect">Select Deck: </label>
                <div className="select is-rounded select is-success">
                    <select onChange={(event) => {
                        // Need to use JSON.parse() method on the event.target.value because we need to extract the data without strings for the id
                        //and event object which will contain the chosen deck object itself
                        let parsedEventTargetValue = JSON.parse(event.target.value);
                        getAllCardsInThisDeck(parsedEventTargetValue.id);
                        handleDeckSelection(parsedEventTargetValue)}} className="deckSelect" id="deckId" >
                        <option value="0">Deck Topic...</option>
                            {
                                decks.map(deck => {
                                //Need to use JSON.stringify() method on the deck object because the value attribute needs the value to be a string
                                    return <option key={deck.id} value={JSON.stringify(deck)}>{deck.topic}</option>
                                })
                            }
                    </select>
                {/* Ternary below will conditionally render the QuizDetail component based on boolean value of isQuizSelected property: */}
                    {
                        quizSelection.isQuizSelected ? 
                            <QuizDetail quizSelection={quizSelection}/> 
                        : 
                            null
                    }
                </div>
            </div>
        </div>
    )

};



