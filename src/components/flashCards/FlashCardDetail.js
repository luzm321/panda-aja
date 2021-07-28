import React, { useContext, useEffect, useState } from "react";
import { FlashCardContext } from "../flashCards/FlashCardProvider";
import { useParams, useHistory } from "react-router-dom";
import { FlashCardFront } from "./FlashCardFront";
import { FlashCardBack } from "./FlashCardBack";
import "./FlashCard.css";



export const FlashCardDetail = () => {

    const history = useHistory();

    const { getFlashCardById, deleteFlashCard, currentCard, patchFlashCard } = useContext(FlashCardContext);

    const [flashcard, setFlashCard] = useState({});
    const [flashCardToggle, setFlashCardSide] = useState(currentCard.isFlipped); // initial value of isFlipped property of card is true (front side)

	const {flashCardId} = useParams();

    useEffect(() => {
        console.log("useEffect", flashCardId)
        getFlashCardById(flashCardId)
        .then((response) => {
          setFlashCard(response)
        })
    }, []);

    const handleDeleteCard = () => {
        deleteFlashCard(flashCardId)
          .then(() => {
            history.push(`/decks/detail/${sessionStorage.getItem("lastDeckView")}`)
          })
    };

     //Reroute to deck detail page/flashcards list on click
     const handleClickReturnToCards = (event) => {
        event.preventDefault() //Prevents the browser from refreshing when submitting the form/clicking cancel button
        history.push(`/decks/detail/${sessionStorage.getItem("lastDeckView")}`)
    };

    // function to toggle flashcard from front (default) to back side and vice versa
    const toggleCardSide = () => {
        setFlashCardSide(!flashCardToggle);
        let newCurrentCard = currentCard;
        newCurrentCard["isFlipped"] = !flashCardToggle;
        // need to stringify it because we are putting in session storage
        sessionStorage.setItem("currentCard", JSON.stringify(newCurrentCard))
        // patch
        let patchedProperty = {
            isFlipped: !flashCardToggle
        }
        patchFlashCard(patchedProperty, currentCard.id);
    };
   
    return (
        <>
            <h1 className="cardViewHeader">Flashcard View</h1>

            <label className="flipToggle">Flip Card</label>
            <label className="switch">
            {/* Ternary below conditionally renders which side of flashcard to display based on the flashCardToggle state (isFlipped property value) */}
            {flashCardToggle ?
                <input type="checkbox" onClick={() => {
                    toggleCardSide()
                }}/> :
                <input type="checkbox" defaultChecked onClick={() => {
                    toggleCardSide()
                }}/>
            }
                <span className="slider round"></span>
            </label>

            {/* Ternary below conditionally renders which side of flashcard to display based on the flashCardToggle state (isFlipped property value) */}
            {flashCardToggle ? 
                <FlashCardFront />    
            :
                <FlashCardBack />
            }
            
            {/* Ternary below conditionally renders the edit/delete affordances only for the current/active user in sessionStorage */}
            {
                parseInt(sessionStorage.getItem("pandaAja_user")) === flashcard.userId ?
                <>
                
                    <div className="card">
                        <footer className="card-footer">
                            <a className="card-footer-item">Speak<img src="https://img.icons8.com/ios/50/000000/parrot-speaking.png"/></a>
                            <a className="card-footer-item">Test Self<img src="https://img.icons8.com/office/40/000000/microphone--v1.png"/></a>
                        </footer>
                    </div>
                    <div className="card">
                        <footer className="card-footer">
                            <a className="card-footer-item">Edit<img className="pencilIcon" src="https://img.icons8.com/ios-glyphs/30/000000/pencil--v1.png"/></a>
                            <a onClick={() => {handleDeleteCard()}} className="card-footer-item">Delete<img className="trashIcon" src="https://img.icons8.com/material/24/000000/trash--v1.png"/></a>
                        </footer>
                    </div>
                </>
                :
                <>
                    <div className="card">
                        <footer className="card-footer">
                            <a className="card-footer-item">Speak<img src="https://img.icons8.com/ios/50/000000/parrot-speaking.png"/></a>
                            <a className="card-footer-item">Test Self<img src="https://img.icons8.com/office/40/000000/microphone--v1.png"/></a>
                        </footer>
                    </div>
                </>
            }

            <button className="cancel__btn" onClick={(event) => {handleClickReturnToCards(event)}}>Return to Flashcards</button>
        </>
    )
};