import React, { useContext, useEffect, useState } from "react";
import { DeckContext } from "../decks/DeckProvider";
import { FlashCardContext } from "../flashCards/FlashCardProvider";
import { QuizDetail } from "./QuizDetail";
import "./Quiz.css"
import { QuizViewModal } from "./QuizViewModal";




export const Quiz = () => {

    const { decks, getDecks } = useContext(DeckContext);
    const { getAllCardsInThisDeckForQuiz, getAllCardsInThisDeck } = useContext(FlashCardContext);
    const [showQuizViewModal, setShowQuizViewModal] = useState(false)


    const [quizSelection, setQuizSelection] = useState({
        isQuizSelected: false,
        deckId: 0,
        flashcards: [],
        currentDeck: {},
    });

    useEffect(() => {
        getDecks()
    }, []);

    const handleDeckSelection = (event) => {
        const deck = event
        const newDeckQuiz = {...quizSelection}
        getAllCardsInThisDeckForQuiz(deck.id).then(deckFlashCards => {
            // if user clicks on the same deck again, value of isQuizSelected will stay false so quiz detail component is not rendered
            if (newDeckQuiz["deckId"] === deck.id) { 
                newDeckQuiz["deckId"] = deck.id
                newDeckQuiz["isQuizSelected"] = false
                newDeckQuiz["flashcards"] = deckFlashCards
                newDeckQuiz["currentDeck"] = deck;
            // else, change value of isQuizSelected property to true to render the QuizDetail component
            } else {
                newDeckQuiz["deckId"] = deck.id
                newDeckQuiz["isQuizSelected"] = true
                newDeckQuiz["flashcards"] = deckFlashCards
                newDeckQuiz["currentDeck"] = deck;
            }
            //setting state with new values
            setQuizSelection(newDeckQuiz)
        });
    };

    // this function updates the state in this module/component that forces a re-render, this allows the quizViewModal to re-render and show the
    // flipped card. This function is being invoked in the QuizViewModal component after being passed as a prop to that component.
    const updateQuiz = (quizSelection) => {
        getAllCardsInThisDeckForQuiz(quizSelection.deckId).then(deckFlashCards => {
            console.log('flash', deckFlashCards)
            let updatedQuizObj = {
                isQuizSelected: quizSelection.isQuizSelected,
                deckId: quizSelection.deckId,
                flashcards: deckFlashCards,
                currentDeck: quizSelection.currentDeck
            }
            setQuizSelection(updatedQuizObj);
        });
    };

    return (
        <div className="quizDiv">
            {/* Ternary will conditionally render the QuizViewModal based on whether boolean value is true or false */}
            {
            showQuizViewModal ?
                <QuizViewModal setShowQuizViewModal={setShowQuizViewModal} quizSelection={quizSelection} updateQuiz={updateQuiz}/>
            :
                null
            }
            <h1 className="quizHeader">Quiz Self</h1>
            <div className="deckDropdown">
                <label className="quizLabel" htmlFor="deckTopicSelect">Select Deck: </label>
                <div className="select is-rounded select is-primary">
                    <select onChange={(event) => {
                        // Need to use JSON.parse() method on the event.target.value because we need to extract the data without strings for the id
                        //and event object which will contain the chosen deck object itself
                        let parsedEventTargetValue = JSON.parse(event.target.value);
                        handleDeckSelection(parsedEventTargetValue)}} className="deckSelect" id="deckId" >
                        <option defaultValue value="0">Deck Topic...</option>
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
                            <QuizDetail quizSelection={quizSelection} setShowQuizViewModal={setShowQuizViewModal}/> 
                        : 
                        null
                    }
                </div>
            </div>
        </div>
    )

};



