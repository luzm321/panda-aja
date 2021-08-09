import React, { useState, useContext, useEffect }from "react";
import { DeckContext } from "../decks/DeckProvider";
import { FlashCardContext } from "../flashCards/FlashCardProvider";
// import { QuizFlashCard } from "./QuizFlashCard";
import { speak } from "../speech/SpeechSynthesisHelper";
import { createRecognitionEvent } from "../speech/SpeechRecognitionHelper";
import "./Quiz.css";


export const QuizViewModal = ({quizSelection, setShowQuizViewModal, updateQuiz}) => {

    const {patchFlashCard, getFlashCards, postDeckScore} = useContext(FlashCardContext);
    const {getDecks} = useContext(DeckContext);
    let numberOfCards = quizSelection.flashcards.length - 1; //need to subtract 1 because position in array is zero index
    let flashCardsArray = quizSelection.flashcards; //storing flashcards property of quizSelection prop into a new variable for use in this component
    const [counter, setCounter] = useState(0)
    const [currentFlashCard, setCurrentFlashCard] = useState(flashCardsArray[counter]);
    const [currentNumberOfCard, setCurrentNumberOfCard] = useState(1);
    const [state, setState] = useState(true);
    const [quizScoreState, setQuizScoreState] = useState({})
    const [totalScore, setTotalScore] = useState(0);
    const [quizCompleted, setQuizCompleted] = useState(false);


    useEffect(() => {
        console.log('quiz', quizSelection.flashcards);
        getDecks();
        const quizScoreStateCopy = {...quizScoreState}
        flashCardsArray.forEach((card) => {
            quizScoreStateCopy[flashCardsArray.indexOf(card)] = null;
            setQuizScoreState(quizScoreStateCopy);
        })
    },[])

    useEffect(() => {
        if (!Object.values(quizScoreState).includes("pass", "fail")) {
            
        } else {
            recordTotalScore();
        }
        if (!Object.values(quizScoreState).includes(null) && quizCompleted) {
            console.log('quiz completed');
            saveScore()
        }
    }, [quizScoreState, quizCompleted])

    // function that shows next card in queue:
    const showNextCard = () => {
        console.log('counter', counter);
        // counter(current position of card in the array is greater that total length which means user has gone through all cards in deck,
        //then reset the state of counter back to zero to display the first card in queue at the zero index position):
        if (counter >= numberOfCards) {
            setCounter(0)
            let currentCard = flashCardsArray[counter];
            setCurrentFlashCard(currentCard);
        // else, add 1 to the current count and proceed to the next card in the array the set the state with updated data
        } else {
            setCounter(counter + 1);
            let currentCard = flashCardsArray[counter];
            setCurrentFlashCard(currentCard);
        }
    };

    // function that shows previous card in queue:
    const showPreviousCard = () => {
        // if counter (current position of card in the array) is less than or equal to zero (meaning the index position is the first card in deck)
        // then reset the counter state with the value of the total length of the cards in the array and set current flashcard to show prev card:
        console.log('counter', counter);
        if (counter <= 0) {
            setCounter(numberOfCards)
            let currentCard = flashCardsArray[numberOfCards];
            setCurrentFlashCard(currentCard);
        } else {
            // else if counter is more than 0 (on the second position in array), then subtract one from index to go back to previous card position
            // and set the current card:
            setCounter(counter - 1);
            let currentCard = flashCardsArray[counter];
            setCurrentFlashCard(currentCard);
        }
    };

    // function that shows the next number position of next card in array left to go through the deck:
    const showNextCardNumber = () => {
        //if current index of card is greater or equal to the total length of cards in array (at last position), then reset current number of card
        //to display back to 1 in modal
        if (currentNumberOfCard >= quizSelection.flashcards.length) {
            setCurrentNumberOfCard(1);
        } else {
            //else if index is less than total length of cards in array, then add 1 to the current number to be displayed in modal
            setCurrentNumberOfCard(currentNumberOfCard + 1);
        }
    }

    // function that shows the previous card number in the array when user clicks on previous card:
    const showPreviousCardNumber = () => {
        //if current index of card is less than or equal to 1 (first index position in array), then set current card number to display the total
        //length of cards to go back
        if (currentNumberOfCard <= 1) {
            setCurrentNumberOfCard(quizSelection.flashcards.length);
            // else if current index is more than 1, then subtract 1, set the state of current card number and go to previous card
        } else {
            setCurrentNumberOfCard(currentNumberOfCard - 1);
        }
    }

    //function that flips current card when flip button is clicked:
    const flipCurrentCard = (event) => {
        event.preventDefault(); //prevents refreshing of page before button is clicked
        let cardId = flashCardsArray[counter].id; //storing the id of the card currently displayed in cardId variable
        let isFlippedProperty = flashCardsArray[counter].isFlipped;
        //change boolean value of isFlippedProperty to the opposite of current value
        let propertyToChange = {
            isFlipped: !isFlippedProperty
        }
        patchFlashCard(propertyToChange, cardId); //using patch method to change the boolean value of isFlipped in database to opposite of initial value
        updateQuiz(quizSelection); //this function updates the state in the quiz module/component that forces a re-render, this allows the 
        //QuizViewModal to re-render and show the flipped card. This function is being invoked here component after being passed as a prop from Quiz component
    }

    // transliteration conditional rendering for front side of card:
    let transliterationFront;
    // if the current card's language code property being displayed is not english (it's Korean), then show the transliteration on the same side
    if (flashCardsArray[counter].frontSideLang !== "en") {
        transliterationFront = <p className="transFront">{flashCardsArray[counter].transliteration}</p>;
    // else don't show the transliteration (phonetic)
    } else {
        transliterationFront = null
    };

    // transliteration conditional rendering for back side of card with same logic as above:
    let transliterationBack;
    if (flashCardsArray[counter].backSideLang !== "en") {
        transliterationBack = <p className="transBack">{flashCardsArray[counter].transliteration}</p>;
    } else {
        transliterationBack = null
    };

    // card view conditional rendering it renders front or back:
    let cardView;
    // if the card's isFlipped property is true and korean word/phrase is in the front side, show transliteration:
    if (flashCardsArray[counter].isFlipped) {
        cardView = <>
        <br/>
        <p className="card__front">{flashCardsArray[counter].frontSide}</p>
            {transliterationFront}
        <br/>
        </>
    } else {
        // else if isFlipped prop is false and korean word/phrase in the backside, then show transliteration:
        cardView = <>
        <br/>
        <p className="card__back">{flashCardsArray[counter].backSide}</p>
            {transliterationBack}
        <br/>
        </>
    };

    // this function is invoked when the user clicks on the speak button:
    const speakToUser = (event) => {
        console.log("event", event, "current flashcard", currentFlashCard)
        event.preventDefault();
        if (flashCardsArray[counter].isFlipped) {
            // speak() function from SpeechSynthesisHelper creates the speech synthesis event, passing the phrase and language code as parameters.
            //flashCardsArray[counter] contains the most current card being displayed (flipped or un-flipped)
            speak(flashCardsArray[counter].frontSide, flashCardsArray[counter].frontSideLang)
        } else {
            speak(flashCardsArray[counter].backSide, flashCardsArray[counter].backSideLang)
        } 
    };

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

    const handleScore = (passOrFail) => {
        let scoreQuizStateCopy = {...quizScoreState}
        // check if the user has already answered current card
            if (scoreQuizStateCopy[counter] === null) {
                if (passOrFail === "pass") {
                    scoreQuizStateCopy[counter] = "pass";
                    setQuizScoreState(scoreQuizStateCopy);
                } else {
                    scoreQuizStateCopy[counter] = "fail";
                    setQuizScoreState(scoreQuizStateCopy);
                }
            } else {
    
            }
    }

    const recordTotalScore = () => {
        console.log('state', quizScoreState);
        let maxScore = flashCardsArray.length;
        let score = 0;
        for (let cardScore in quizScoreState) {
            if (quizScoreState[cardScore] === "pass") {
                score++
            }
        }
        let totalScore = score / maxScore * 100
        setTotalScore(totalScore);
    };

    //function that saves and posts quiz score after completion
    const saveScore = () => {
        let newArray = Object.values(quizScoreState);
        console.log("?", !newArray.includes("pass", "fail"));
        if (!newArray.includes("pass", "fail")) { 
            // if user didn't answer anything, which means user changed his/her mind
        } else {
            // but if they answered at least one then record it
            let scoreObj = {
                userId: parseInt(sessionStorage.getItem("pandaAja_user")), 
                deckId: quizSelection.deckId,
                percentageScore: totalScore,
                completionDate: new Date().toLocaleDateString()
            }
            postDeckScore(scoreObj);
            setQuizScoreState({}); //once quiz is completed and score is saved/posted to database, reset state to empty obj
            setTotalScore(0); // also reset total score state to zero
        }
    };

    // this function is invoked when user clicks on the test self button to check if correct answer is given for the opposite side of card:
    const listenToAnswer = (event) => {
        event.preventDefault();
            let countryCode;
            let recognitionEvent;
            // if flash card is currently on the front side, then start the recognition event 
            if ( flashCardsArray[counter].isFlipped ) {
                countryCode  = findLangCountryCode(flashCardsArray[counter].backSideLang);
                console.log("countryCode", countryCode)
                recognitionEvent = createRecognitionEvent(countryCode);
                recognitionEvent.start();
                recognitionEvent.onresult = (event) => {
                    let answerGiven = event.results[0][0].transcript;
                    if (answerGiven.includes(flashCardsArray[counter].backSide.toLowerCase())) {
                    // if the answer the user gave matches the translated phrase/language on the back side of the card, then code below runs:
                        //if current index of card is greater or equal to the total length of cards in array (at last position), then app will say:
                        if (currentNumberOfCard >= quizSelection.flashcards.length) {
                            handleScore("pass"); // update quiz score state to pass
                            setQuizCompleted(true);
                            speak("Great Job! You got it right, you're done with the quiz!", "en");
                        } else {
                        //else if index is less than total length of cards in array (not at last card in deck), then app will say:
                            handleScore("pass");  // update quiz score state to pass
                            speak("Great Job! You got it right, proceed to the next card", "en");
                        }
                    } else {
                        // if what the user said doesn't match the phrase/language on the back side of the card, then code below runs and app will
                        //repeat what the user said:
                        handleScore("fail"); // update quiz score state to fail
                        speak(`Please try again, you said`, "en");
                        speak(`${answerGiven}`, flashCardsArray[counter].backSideLang);
                    }
                }
            } else {
                  // else if flash card is currently on the back side, then start the recognition event 
                countryCode  = findLangCountryCode(flashCardsArray[counter].frontSideLang);
                recognitionEvent = createRecognitionEvent(countryCode);
                recognitionEvent.start();
                recognitionEvent.onresult = (event) => {
                    let answerGiven = event.results[0][0].transcript;
                    if (answerGiven.includes(flashCardsArray[counter].frontSide.toLowerCase())) {
                    // if the answer the user gave matches the translated phrase/language on the front side of the card, then code below runs:
                        //if current index of card is greater or equal to the total length of cards in array (at last position), then app will say:
                          if (currentNumberOfCard >= quizSelection.flashcards.length) {
                            handleScore("pass"); // update quiz score state to pass
                            setQuizCompleted(true);
                            speak("Great Job! You got it right, you're done with the quiz!", "en");
                        } else {
                        //else if index is less than total length of cards in array (not at last card in deck), then app will say:
                            handleScore("pass");  // update quiz score state to pass
                            speak("Great Job! You got it right, proceed to the next card", "en");
                        }
                    } else {
                        // if what the user said doesn't match the phrase/language on the front side of the card, then code below runs and app will
                        //repeat what the user said:
                        handleScore("fail"); // update quiz score state to fail
                        speak(`Please try again, you said`, "en");
                        speak(`${answerGiven}`, flashCardsArray[counter].frontSideLang);
                    }
            }
        };
    };

    return (
        <>
            <div className="modal is-active">
                <div className="modal-background quizModalBgd"></div>
                    <div className="modal-content">
                        <h1 className="quizViewHeader">~My Quiz~</h1>
                        <button onClick={() => {console.log("score state", quizScoreState, totalScore); console.log('thing', Object.values(quizScoreState).includes(null)) }}>state</button>
                        <button className="quizFlipBut" onClick={(event) => {
                            flipCurrentCard(event)
                        }}>Flip Card</button>
                        <div>
                            <div className="slideshow-container">
                                <div className="fade">
                                    <div className="numbertext">{currentNumberOfCard} / {quizSelection.flashcards.length}</div>
                                        {cardView}
                                    <div className="quizButtons">
                                        <button onClick={(event) => {speakToUser(event)}} className="button is-rounded quizSpeak">Speak<img className="speakParrot" src="https://img.icons8.com/ios/50/000000/parrot-speaking.png"/></button>
                                        <button onClick={(event) => {listenToAnswer(event)}} className="button is-rounded quizTestSelf">Answer<img className="pandaMic" src="./images/pandaMicrophone.jpg" alt="pandaMic"/></button>
                                    </div>
                                </div>

                                <a className="prev" onClick={() => {showPreviousCard();showPreviousCardNumber()}}>&#10094;</a>
                                <a className="next" onClick={() => {showNextCard();showNextCardNumber()}}>&#10095;</a>
                            </div>
                            <br/>
                            
                            <div className="cardCount">
                                {quizSelection.flashcards.map((flashcard) => {
                                    return <span key={flashcard.id} className="dot" onClick={() => {
                                        setCounter(quizSelection.flashcards.indexOf(flashcard))
                                        setCurrentNumberOfCard(quizSelection.flashcards.indexOf(flashcard) + 1)
                                    }}></span>
                                })}
                            </div>
                        </div>
                    </div>
                <button onClick={() => {
                    setCounter(0) //resets counter/current index position of card back to the first position when modal closes and user wants
                    //to take another quiz
                    setCurrentFlashCard(flashCardsArray[0]);
                    setShowQuizViewModal(false)
                    saveScore()
                }}className="modal-close is-large closeBut" aria-label="close"></button>
            </div> 
        </> 
    )
};