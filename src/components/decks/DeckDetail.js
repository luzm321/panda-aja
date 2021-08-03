import React, { useContext, useEffect, useState } from "react";
import { useHistory, Link } from "react-router-dom";
import { FlashCardContext } from "../flashCards/FlashCardProvider";
import { DeckContext } from "./DeckProvider";
// import "./FlashCard.css";


export const DeckDetail = () => {

    const { getAllCardsInThisDeck, userDeckFlashCards, assignCurrentCard, currentCard, patchFlashCard } = useContext(FlashCardContext);
    const { currentDeck, searchCardTerms } = useContext(DeckContext);

    // Since no longer ALWAYS displaying all of the cards:
    const [ filteredCards, setFilteredCards ] = useState([])
    const history = useHistory();

    // searchTerms will cause a change
    useEffect(() => {
        if (searchCardTerms !== "") {
            // If the search field is not blank, display matching flashcards by transliteration property
            const subset = userDeckFlashCards.filter(flashcard => flashcard.transliteration.toLowerCase().includes(searchCardTerms))
            setFilteredCards(subset)
          } else {
          // If the search field is blank, display all flashcards
          setFilteredCards(userDeckFlashCards)
          getAllCardsInThisDeck(currentDeck.id);
          }
        
    }, [searchCardTerms, userDeckFlashCards]);

     //Reroute to deck list/profile page on click
     const handleClickReturnToDecks = (event) => {
        event.preventDefault() //Prevents the browser from refreshing when submitting the form/clicking cancel button
        history.push("/decks")
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
        <div className="deckDetailDiv">
            <h1 className="flashCardHeader">My Flashcards</h1>
            {/* Ternary below conditionally renders add new card affordance only if the current logged in user matches the deck userId or the deck id from sessionStorage */}
            {
                parseInt(sessionStorage.getItem("pandaAja_user")) === currentDeck.userId ? 
                    <button className="button is-rounded addCardButton" onClick={() => {history.push(`/decks/detail/${sessionStorage.getItem("lastDeckView")}/create`)}}>
                        Add New Card
                    </button>
                :
                    null
            }

            {
                filteredCards.map((flashCard) => {
                    return <div className="flashCardDiv" onMouseOver={() => {
                        assignCurrentCard(flashCard);
                        }}>
                            <br></br>
                            <button className="button is-rounded flipBut" onClick={(event) => {toggleCardSide(event, flashCard)}}>Flip Card</button>
                            {flashCard.isFlipped ? 
                            <div className="flip-card">
                                <div className="flip-card-inner">
                                    <div className="card flip-card-front">
                                        <div className="card-content-detail">
                                                <div className="">
                                                    <h1>{flashCard.frontSide}</h1>
                                                    <h2>{flashCard.transliteration}</h2>
                                                </div>
                                        </div>
                                    </div>
                                    <div className="card flip-card-back">
                                        <div className="card-content-detail">
                                            <h1>{flashCard.backSide}</h1>
                                        </div>
                                    </div>
                                </div>
                            </div>
                            :
                            <div className="flip-card">
                                    <div className="flip-card-inner">
                                        <div className="card flip-card-front">
                                            <div className="card-content-detail">
                                                    <div className="">
                                                        <h1>{flashCard.backSide}</h1>
                                                    </div>
                                            </div>
                                        </div>
                                        <div className="card flip-card-back">
                                            <div className="card-content-detail">
                                                <h1>{flashCard.frontSide}</h1>
                                                <h2>{flashCard.transliteration}</h2>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            }
                            
                            <Link to={`/decks/detail/${sessionStorage.getItem("lastDeckView")}/flashcard/${flashCard.id}`}>
                                <button className="button is-rounded showDetailBut" onClick={() => {assignCurrentCard(flashCard);sessionStorage.setItem("currentCard", JSON.stringify(flashCard));}}>
                                    Show Card Detail
                                </button>
                            </Link>
                    </div>
                })
            }
            
            <button className="button is-rounded return__button" onClick={(event) => {handleClickReturnToDecks(event)}}>Return to Decks</button>
        </div>
    )
};