import React, { useContext, useEffect } from "react";
import { useHistory, Link } from "react-router-dom";
import { FlashCardContext } from "../flashCards/FlashCardProvider";
import { DeckContext } from "./DeckProvider";
// import "./FlashCard.css";


export const DeckDetail = () => {

    const { getAllCardsInThisDeck, userDeckFlashCards, assignCurrentCard, currentCard, patchFlashCard } = useContext(FlashCardContext);
    const { currentDeck } = useContext(DeckContext);
    const history = useHistory();

    useEffect(() => {
        getAllCardsInThisDeck(currentDeck.id);
    }, []);

     //Reroute to deck detail page on cancel
     const handleClickCancel = (event) => {
        event.preventDefault() //Prevents the browser from refreshing when submitting the form/clicking cancel button
        window.history.back();
    };

    // function to toggle flashcard from front (default) to back side and vice versa
    const toggleCardSide = (event, flashCard) => {
        event.preventDefault();
        let newCurrentCard = currentCard;
        newCurrentCard["isFlipped"] = !flashCard.isFlipped;
        assignCurrentCard(newCurrentCard);
        // patch
        let patchedProperty = {
            isFlipped: !flashCard.isFlipped
        }
        patchFlashCard(patchedProperty, flashCard.id);
    };

    return (
        <>
            <h1>Flashcards</h1>
            {/* Ternary below conditionally renders add new card affordance only if the current logged in user matches the deck userId or the deck id from sessionStorage */}
            {
                parseInt(sessionStorage.getItem("pandaAja_user")) === currentDeck.userId || parseInt(sessionStorage.getItem("lastDeckView")) ? 
                    <button className="addCardBut" onClick={() => {history.push(`/decks/detail/${sessionStorage.getItem("lastDeckView")}/create`)}}>
                        Add New Card
                    </button>
                :
                    null
            }

            {
                userDeckFlashCards.map((flashCard) => {
                    return <div onMouseOver={() => {
                        assignCurrentCard(flashCard);
                        }}>
                            <br></br>
                            <button onClick={(event) => {toggleCardSide(event, flashCard)}}>Flip Card</button>
                            {flashCard.isFlipped ? 
                            <div className="flip-card">
                                <div className="flip-card-inner">
                                    <div className="card flip-card-front">
                                        <div className="card-content">
                                                <div className="">
                                                    <h1>{flashCard.frontSide}</h1>
                                                    <h2>{flashCard.transliteration}</h2>
                                                </div>
                                        </div>
                                    </div>
                                    <div className="card flip-card-back">
                                        <div className="card-content">
                                            <h1>{flashCard.backSide}</h1>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            :
                            <div className="flip-card">
                                    <div className="flip-card-inner">
                                        <div className="card flip-card-front">
                                            <div className="card-content">
                                                    <div className="">
                                                        <h1>{flashCard.backSide}</h1>
                                                    </div>
                                            </div>
                                        </div>
                                        <div className="card flip-card-back">
                                            <div className="card-content">
                                                <h1>{flashCard.frontSide}</h1>
                                                <h2>{flashCard.transliteration}</h2>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            }
                            
                            <Link to={`/decks/detail/${sessionStorage.getItem("lastDeckView")}/flashcard/${flashCard.id}`}>
                                <button onClick={() => {assignCurrentCard(flashCard);sessionStorage.setItem("currentCard", JSON.stringify(flashCard));}}>
                                    Show Card Detail
                                </button>
                            </Link>
                    </div>
                })
            }
            
            <button className="cancel__btn" onClick={(event) => {handleClickCancel(event)}}>Return to Decks</button>
        </>
    )
};