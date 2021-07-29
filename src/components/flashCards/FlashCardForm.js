import { speak } from "../speech/SpeechSynthesisHelper";
import { useEffect, useState, useContext } from "react";
import { useHistory } from "react-router-dom";
import { translatePhrase, transliteratePhrase, detectLanguage } from "./TranslationProvider"; 
import { FlashCardContext } from "../flashCards/FlashCardProvider";
import { DeckContext } from "../decks/DeckProvider"; 
import { createRecognitionEvent } from "./../speech/SpeechRecognitionHelper";


// this will be for the text to speech functionality, not in use right now.
// this is an array of some of the languageCountryCodes for the speech recognition from the web speech api
// let languageCountryCodesArray = ["en-US", "ko-KR", "es-MX", "ja-JP"];
// these are the default codes the app starts out with.
// let languageCode = "ko";
// let languageCountryCode = "ko-KR"
// let languageTransliterationCode = "Kore"


export const FlashCardForm = () => {

    const { getFlashCards, addFlashCard, updateFlashCard } = useContext(FlashCardContext);
    const { getDecks, currentDeck } = useContext(DeckContext);
    const history = useHistory();

    const [typedPhrase, setTypedPhrase] = useState("");
    const [languageSelected, setLanguage] = useState("ko");
    const [transliterationCode, setTransliterationCode] = useState("Kore");
    const [translatedWord, setTranslation] = useState("");
    const [transliteratedWord, setTransliteration] = useState("");
    const [speechRecognitionEvent, setSpeechRecognitionEvent] = useState("");


     // Define the initial state of the form inputs with useState()
     const [card, setCard] = useState({
        userId: parseInt(sessionStorage.getItem("pandaAja_user")),
        deckId: parseInt(sessionStorage.getItem("lastDeckView")),
        frontSide: "",
        backSide: "",
        frontSideLang: "",
        backsideLang: "",
        transliteration: "",
        isFlipped: true
    });


    useEffect(() => {
        getFlashCards()
        .then(getDecks)
    }, []);

     //when a field changes, update state. The return will re-render and display based on the values in state
    //Controlled component
    const handleControlledInputChange = (event) => {
        /* When changing a state object or array,
        always create a copy, make changes, and then set state.*/
        const newCard = { ...card }
        /* Card is an object with properties.
        Set the property to the new value
        using object bracket notation. */
        newCard[event.target.id] = event.target.value
        // update state
        setCard(newCard)
    };

    // Create new flashcard function:
    const saveNewCard = (event) => {
        event.preventDefault() //Prevents the browser from refreshing when submitting the form
        addFlashCard(card)
        .then(() => history.push(`/decks/detail/${currentDeck.id}`));
    };


    const handleClickSaveCard = (event) => {
        event.preventDefault() //Prevents the browser from submitting the form
        console.log('card', card, 'deck data', currentDeck, "english word", typedPhrase);
        
        const frontSide = card.frontSide
        const backSide = card.backSide
        const transliteration = card.transliteration

        if (frontSide === "" || backSide === "") {
            window.alert("Please provide values for all input fields. 👇")
        } else {
    
            if (window.location.href.includes("create")) {
                saveNewCard(event)
                alert("New Card Created! 😊")
            } 
        };
    };
    

    //Reroute to deck detail page/flashcards list on cancel
    const handleClickCancel = (event) => {
        event.preventDefault() //Prevents the browser from refreshing when submitting the form/clicking cancel button
        history.push(`/decks/detail/${currentDeck.id}`)
    };
   

    let userEnteringWord = (event) => {
        // this is setting the value that the user wrote in to the state
        const newCard = { ...card }
        newCard[event.target.id] = event.target.value
        setCard(newCard);
        setTypedPhrase(event.target.value)
    };

    // this function is for the language selection drop down
    let selectLanguage = (event) => {
        let languageTransliterationCode = event.target.value.split("--")[1]
        let languageCode = event.target.value.split("--")[0];
        setLanguage(languageCode);
        setTransliterationCode(languageTransliterationCode);
        console.log('language code', languageCode, 'state', languageSelected)
        // VV this is not in use yet VV
        // let languageCountryCode = languageCountryCodesArray.filter((languageFiltered) => {
        //     if (languageFiltered.includes(languageCode)) {
        //         // console.log('language filtered', languageFiltered);
        //         return languageFiltered;
        //     } 
        // });
    };

    // this function translates the word in the input
    const translateWord = (event) => {
        event.preventDefault()
        const newCard = { ...card }
        // this is the function in the TranslationProvider that calls the proxy
        detectLanguage(typedPhrase).then((languageCodeDetected) => {
            newCard["frontSideLang"] = languageCodeDetected;
            newCard["backSideLang"] = languageSelected;
            translatePhrase(languageSelected, typedPhrase, languageCodeDetected).then((translation) => {
            // it puts the translation in the translatedWord state in case is needed for anything else.
                setTranslation(translation);
                newCard["frontSide"] = translation;
                setCard(newCard);
                    if (transliterationCode !== 'Latn') {
                        transliteratePhrase(languageSelected, translation, transliterationCode).then((transliteration) => {
                            // it puts the transliteration in the transliteratedWord state in case is needed for anything else.
                            setTransliteration(transliteration);
                            newCard["transliteration"] = transliteration;
                        });
                    } else {
                        // if the language is spanish the transliteration should not be there.
                            setTransliteration("");
                            newCard["transliteration"] = "";
                    }
            });
        });
    }

    // this function is invoked when the user click on the listen to me button.
    const listenToUser = (event) => {
        event.preventDefault();
        // this function from SpeechRecognitionHelper creates the speech recognition event.
        let recognitionEvent = createRecognitionEvent();
        recognitionEvent.start();
        recognitionEvent.onresult = (event) => {
            let answerGiven = event.results[0][0].transcript;
            const newCard = { ...card }
            newCard['backSide'] = answerGiven
            setCard(newCard);
            setTypedPhrase(answerGiven);
        };
        // it puts the recognition event into the speechRecognitionEvent state in case is needed for anything else.
        setSpeechRecognitionEvent(recognitionEvent);
    }

    return (
        <>
            <form className="cardForm">
                <h2 className="cardForm__title">New Card</h2>
                <div className="card">
                    <div className="card-image">
                            <textarea disabled id="frontSide" value={`${translatedWord} ${transliteratedWord}`} placeholder="Translation..." onChange={handleControlledInputChange}></textarea>
                            <select className="langSelect" onChange={(event) => {selectLanguage(event)}}>
                                <option className="langSelect" value="ko--Kore">Korean</option>
                                <option className="langSelect" value="ja--Jpan">Japanese</option>
                                <option className="langSelect" value="en--Latn">Spanish</option>
                                <option className="langSelect" value="en--Latn">English</option>
                            </select>
                    </div>
                    <div className="card-content">
                        <div className="media">
                            <div className="media-content">
                                <input id="backSide" className="title is-4" placeholder="Enter Text..." value={typedPhrase} onChange={(event) => {
                                        userEnteringWord(event)
                                    }} />
                                <button className="listenBut" onClick={(event) => {listenToUser(event)}}>Listen To Me<img src="https://img.icons8.com/fluent/48/000000/foreign-language-sound.png"/></button>
                            </div>
                        </div>
                        <button className="translateBut" onClick={(event) => {translateWord(event)}}>Translate<img src="https://img.icons8.com/color/48/000000/language.png"/></button>
                        <div className="content">
                            <button className="cancel__btn" onClick={(event) => {handleClickCancel(event)}}>Cancel</button>
                            <button className="handleCard__btn" onClick={(event) => {handleClickSaveCard(event)}}>
                                Add Card  
                            </button>
                        </div>
                    </div>
                </div>
            </form>
        </>
    )
};





