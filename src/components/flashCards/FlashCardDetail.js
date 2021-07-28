import React, { useContext, useEffect, useState } from "react";
import { FlashCardContext } from "../flashCards/FlashCardProvider";
import { useParams, useHistory } from "react-router-dom";
import { FlashCardFront } from "./FlashCardFront";
import { FlashCardBack } from "./FlashCardBack";
import "./FlashCard.css";



export const FlashCardDetail = () => {

    const history = useHistory();

    const { getFlashCardById, deleteFlashCard, currentCard, updateFlashCard, patchFlashCard } = useContext(FlashCardContext);

    const [flashcard, setFlashCard] = useState({});
    const [flashCardToggle, setFlashCardSide] = useState(currentCard.isFlipped); // initial value of isFlipped property of card is true (front side)

	const {flashCardId} = useParams(); //dynamic routing parameter for ApplicationViews

    //Initial state of unedited flashcard object:
    const [uneditedCard, setUneditedCard] = useState({
        cardState: false
    });

    useEffect(() => {
        console.log("useEffect", flashCardId)
        getFlashCardById(flashCardId)
        .then((response) => {
          setFlashCard(response)
        })
    }, []);

     //Function for handling and toggling edited vs unedited card views:
     const handleEdit = () => {
        setUneditedCard(true)
    };

    //Initial state of updated flashcard object with pre-populated data:
      const [updatedCard, setUpdatedCard] = useState({
        id: flashcard.id,
        // userId: parseInt(sessionStorage.getItem("pandaAja_user"))
        userId: flashcard.userId,
        // deckId: parseInt(sessionStorage.getItem("lastDeckView"))
        deckId: flashcard.deckId,
        frontSide: flashcard.frontSide,
        backSide: flashcard.backSide,
        transliteration: flashcard.transliteration,
        isFlipped: true
    });

    
    //Change event listener for recording new flashcard input
    const handleControlledInputChange = (event) => {
        /* When changing a state object or array,
        always create a copy, make changes, and then set state.*/
        const newCard = { ...updatedCard }
        /* Card is an object with properties.
        Set the property to the new value
        using object bracket notation. */
        newCard[event.target.id] = event.target.value 
        // update state
        setUpdatedCard(newCard);
    };

     //Edit Flashcard function:
     const saveEditCard = () => {
        if (updatedCard.frontSide.length === 0 || updatedCard.backSide.length === 0) {
            updatedCard.frontSide = flashcard.frontSide
            updatedCard.backSide = flashcard.backSide
                updateFlashCard(updatedCard);
                setUneditedCard(false);
                alert("You cannot save an empty card! 🙅");
        } else {
            if (updatedCard.frontSide === flashcard.frontSide || updatedCard.backSide === flashcard.backSide) {
                updateFlashCard(updatedCard);
                setUneditedCard(false);
                alert("You cannot save an empty card! 🙅");
            } else {
                updateFlashCard(updatedCard);
                setUneditedCard(false);
            }
        }
    };

    //Text area for message input conditionally rendered whether in unedited or updating state:

    let cardInput;
    if (uneditedCard === true) {
        cardInput = 
        <div className="update__card">
            <input id="backSide" className="card__backSide" defaultValue={flashcard.backSide} onChange={(event) => {handleControlledInputChange(event)}}/>
            <button className="update__button" onClick={() => {saveEditCard()}}>Save</button>                 
        </div>
    } else {
        cardInput = 
        <div className="update__card">
            <input type="text" className="card__backSide" value={flashcard.backSide} />  
            <select className="langSelect">
            <option className="langSelect" value="ko--Kore">Korean</option>
            <option className="langSelect" value="en--Latn">English</option>
            </select>
            <button>Translate</button>        
        </div>
    };

    // Function for deleting a card:
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
                <FlashCardFront uneditedCardState={uneditedCard} updatedCardState={updatedCard} cardInput={cardInput} handleInputChange={handleControlledInputChange}/>    
            :
                <FlashCardBack uneditedCardState={uneditedCard} updatedCardState={updatedCard} cardInput={cardInput} handleInputChange={handleControlledInputChange}/>
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
                            <a onClick={() => {handleEdit(flashcard)}} className="card-footer-item">Edit<img className="pencilIcon" src="https://img.icons8.com/ios-glyphs/30/000000/pencil--v1.png"/></a>
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