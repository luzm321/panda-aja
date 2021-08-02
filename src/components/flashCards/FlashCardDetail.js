import React, { useContext, useEffect, useState } from "react";
import { FlashCardContext } from "../flashCards/FlashCardProvider";
import { useParams, useHistory } from "react-router-dom";
import { FlashCardFront } from "./FlashCardFront";
import { FlashCardBack } from "./FlashCardBack";
import { speak } from "../speech/SpeechSynthesisHelper";
import { createRecognitionEvent } from "../speech/SpeechRecognitionHelper";
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

    // array of some of the language country codes the web speech API and app starts out with:
    const [langCountryCodeArray] = useState(["en-US", "ko-KR", "es-MX", "ja-JP"]);
    // creating state for current language country code for speech recognition:
    const [currentLangCountryCode, setCurrentLangCountryCode] = useState("");

    // function that finds the current language country code in the array above to match what is spoken for speech recognition
    const findLangCountryCode = (languageCode) => {
        return langCountryCodeArray.find((countryCode) => {
            if (countryCode.includes(languageCode)) {
                return countryCode;
            }
        });
    };


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


    // this function is invoked when the user clicks on the speak button:
    const speakToUser = (event) => {
        event.preventDefault();
        if (flashCardToggle) {
            // speak() function from SpeechSynthesisHelper creates the speech synthesis event, passing the phrase and language code as parameters.
            //currentCard object in sessionStorage has the updated flashcard data whenever user edits a card, otherwise, app will speak the
            //previous phrase and language of the unedited version of card:
            speak(JSON.parse(sessionStorage.getItem("currentCard")).frontSide, JSON.parse(sessionStorage.getItem("currentCard")).frontSideLang)
        } else {
            speak(JSON.parse(sessionStorage.getItem("currentCard")).backSide, JSON.parse(sessionStorage.getItem("currentCard")).backSideLang)
        } 
    };

    // this function is invoked when user clicks on the test self button to check if pronunciation is correct:
    const listenToAnswer = (event) => {
        event.preventDefault();
            let countryCode;
            let recognitionEvent;
            // if flash card is currently on the front side, then start the recognition event 
            if ( flashCardToggle ) {
                countryCode  = findLangCountryCode(currentCard.frontSideLang);
                console.log("countryCode", countryCode)
                recognitionEvent = createRecognitionEvent(countryCode);
                recognitionEvent.start();
                recognitionEvent.onresult = (event) => {
                    let answerGiven = event.results[0][0].transcript;
                     if (answerGiven.includes(currentCard.frontSide.toLowerCase())) {
                         // if what the user said matches the phrase/language on the front side of the card, then code below runs:
                        speak("Great Job! You got it right", "en");
                    } else {
                        // if what the user said matches the phrase/language on the front side of the card, then code below runs and app will
                        //repeat what the user said:
                        speak(`Please try again, you said`, "en");
                        speak(`${answerGiven}`, currentCard.frontSideLang);
                    }
                }
            } else {
                  // else if flash card is currently on the back side, then start the recognition event 
                countryCode  = findLangCountryCode(currentCard.backSideLang);
                recognitionEvent = createRecognitionEvent(countryCode);
                recognitionEvent.start();
                recognitionEvent.onresult = (event) => {
                    let answerGiven = event.results[0][0].transcript;
                if (answerGiven.includes(currentCard.backSide.toLowerCase())) {
                     // if what the user said matches the phrase/language on the back side of the card, then code below runs:
                    speak("Great Job! You got it right", "en");
                } else {
                     // if what the user said matches the phrase/language on the back side of the card, then code below runs and app will
                    //repeat what the user said:
                    speak(`Please try again, you said`, "en");
                    speak(`${answerGiven}`, currentCard.backSideLang);
                }
            }
        };
    };

    return (
        <div className="deckDetailDiv">
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
                
                    <div className="buttonsDiv">
                        <button onClick={(event) => {speakToUser(event)}} className="button is-rounded speak">Speak<img className="speakButIconPic" src="https://img.icons8.com/ios/50/000000/parrot-speaking.png"/></button>
                        <button onClick={(event) => {listenToAnswer(event)}} className="button is-rounded listen">Test Self<img className="testSelfIconPic" src="https://img.icons8.com/office/40/000000/microphone--v1.png"/></button>
                        
                    </div>
                    <div className="buttonsDiv">
                        <button onClick={() => {handleEdit(flashcard)}} className="button is-rounded edit">Edit<img className="pencilIconPic" src="https://img.icons8.com/ios-glyphs/30/000000/pencil--v1.png"/></button>
                        <button onClick={() => {handleDeleteCard()}} className="button is-rounded remove">Delete<img className="trashIconPic" src="https://img.icons8.com/material/24/000000/trash--v1.png"/></button>
                    </div>
                </>
                :
                <>
                    <div className="buttonsDiv">
                        <button onClick={(event) => {speakToUser(event)}} className="button is-rounded speak">Speak<img className="speakButIconPic" src="https://img.icons8.com/ios/50/000000/parrot-speaking.png"/></button>
                        <button onClick={(event) => {listenToAnswer(event)}} className="button is-rounded listen">Test Self<img className="testSelfIconPic" src="https://img.icons8.com/office/40/000000/microphone--v1.png"/></button>
                    </div>
                </>
            }

            <button className="button is-rounded return__btn" onClick={(event) => {handleClickReturnToCards(event)}}>Return to Flashcards</button>
        </div>
    )
};