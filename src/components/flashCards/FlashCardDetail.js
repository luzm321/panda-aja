import React, { useContext, useEffect, useState } from "react";
import { FlashCardContext } from "../flashCards/FlashCardProvider";
import { useParams, useHistory } from "react-router-dom";
import { FlashCardFront } from "./FlashCardFront";
import { FlashCardBack } from "./FlashCardBack";
import "./FlashCard.css";



export const FlashCardDetail = () => {

    const history = useHistory();

    const { getFlashCardById, deleteFlashCard, currentCard, updateFlashCard, patchFlashCard, assignCurrentCard } = useContext(FlashCardContext);

    const [flashcard, setFlashCard] = useState({
        // setting initial values of flashcard object key-value pairs with data from the sessionStorage so it is not empty on initial render
        id: parseInt(JSON.parse(sessionStorage.getItem("currentCard")).id),
        userId: parseInt(sessionStorage.getItem("pandaAja_user")),
        deckId: parseInt(sessionStorage.getItem("lastDeckView")),
        frontSide:JSON.parse(sessionStorage.getItem("currentCard")).frontSide,
        backSide: JSON.parse(sessionStorage.getItem("currentCard")).backSide,
        transliteration: JSON.parse(sessionStorage.getItem("currentCard")).transliteration,
        isFlipped: true,
        backSideLang: JSON.parse(sessionStorage.getItem("currentCard")).backSideLang,
        frontSideLang: JSON.parse(sessionStorage.getItem("currentCard")).frontSideLang
    });
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

    //Initial state of updated flashcard object with pre-populated data and setting initial values of updated card object key-value pairs with 
    // data from the sessionStorage so it is not empty when page refreshes
      const [updatedCard, setUpdatedCard] = useState({
        id: parseInt(JSON.parse(sessionStorage.getItem("currentCard")).id),
        userId: parseInt(sessionStorage.getItem("pandaAja_user")),
        deckId: parseInt(sessionStorage.getItem("lastDeckView")),
        frontSide: JSON.parse(sessionStorage.getItem("currentCard")).frontSide,
        backSide: JSON.parse(sessionStorage.getItem("currentCard")).backSide,
        transliteration: JSON.parse(sessionStorage.getItem("currentCard")).transliteration,
        isFlipped: true,
        backSideLang: JSON.parse(sessionStorage.getItem("currentCard")).backSideLang,
        frontSideLang: JSON.parse(sessionStorage.getItem("currentCard")).frontSideLang
    });

    
    //Change event listener for recording new flashcard input
    const handleControlledInputChange = (event) => {
        console.log('event', event.target.value);
        console.log('event in handle', updatedCard)
        /* When changing a state object or array,
        always create a copy, make changes, and then set state.*/
        const newCard = { ...updatedCard }
        console.log('event in handle new card', newCard)

        /* Card is an object with properties.
        Set the property to the new value
        using object bracket notation. */
        newCard[event.target.id] = event.target.value 
        // update state
        setUpdatedCard(newCard);
    };

     //Edit Flashcard function:
     const saveEditCard = () => {
         // ensuring user does not delete data and try to save:
        if (updatedCard.frontSide.length === 0 || updatedCard.backSide.length === 0) {
            alert("You cannot save an empty card! 🙅");
        } else {
            // ensuring user does not try to edit data without doing any changes to it:
            if (updatedCard.frontSide === flashcard.frontSide || updatedCard.backSide === flashcard.backSide) {
                alert("You cannot save an empty card! 🙅");
            } else {
                assignCurrentCard(updatedCard);
                sessionStorage.setItem("currentCard", JSON.stringify(updatedCard));
                updateFlashCard(updatedCard);
                setUneditedCard(false);
            }
        }
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
                <FlashCardFront uneditedCardState={uneditedCard} updatedCardState={updatedCard} handleInputChange={handleControlledInputChange} saveEditCard={saveEditCard} setUneditedCard={setUneditedCard}/>    
            :
                <FlashCardBack uneditedCardState={uneditedCard} updatedCardState={updatedCard} handleInputChange={handleControlledInputChange} saveEditCard={saveEditCard} setUneditedCard={setUneditedCard}/>
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