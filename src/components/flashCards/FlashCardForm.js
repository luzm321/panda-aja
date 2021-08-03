import { useEffect, useState, useContext } from "react";
import { useHistory } from "react-router-dom";
import { translatePhrase, transliteratePhrase, detectLanguage } from "./TranslationProvider"; 
import { FlashCardContext } from "../flashCards/FlashCardProvider";
import { DeckContext } from "../decks/DeckProvider"; 
import { createRecognitionEvent } from "./../speech/SpeechRecognitionHelper";
import { speak } from "../speech/SpeechSynthesisHelper";
import Swal from "sweetalert2";


// this is an array of some of the languageCountryCodes for the speech recognition from the web speech api
let languageCountryCodesArray = ["en-US", "ko-KR", "es-MX", "ja-JP"];
// these are the default codes the app starts out with.
// let languageCode = "ko";
// let languageCountryCode = "ko-KR"
// let languageTransliterationCode = "Kore"


export const FlashCardForm = () => {

    const { getFlashCards, addFlashCard } = useContext(FlashCardContext);
    const { getDecks, currentDeck } = useContext(DeckContext);
    const history = useHistory();

    const [typedPhrase, setTypedPhrase] = useState("");
    const [languageSelected, setLanguage] = useState("ko");
    const [transliterationCode, setTransliterationCode] = useState("Kore");
    const [translatedWord, setTranslation] = useState("");
    const [transliteratedWord, setTransliteration] = useState("");
    const [speechRecognitionEvent, setSpeechRecognitionEvent] = useState("");
    const [langCountryCodeArray] = useState(["en-US", "ko-KR", "es-MX", "ja-JP"]);
    const [currentLangCountryCode, setCurrentLangCountryCode] = useState("");

    const findLangCountryCode = (languageCode) => {
        return langCountryCodeArray.find((countryCode) => {
            if (countryCode.includes(languageCode)) {
                return countryCode;
            }
        });
    }


     // Define the initial state of the form inputs with useState()
     const [card, setCard] = useState({
        userId: parseInt(sessionStorage.getItem("pandaAja_user")),
        deckId: parseInt(sessionStorage.getItem("lastDeckView")),
        frontSide: "",
        backSide: "",
        frontSideLang: "",
        backSideLang: "",
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
            Swal.fire({
                title: "Please provide values for all input fields. 👇",
                icon: "info",
                confirmButtonColor: "#20B2AA"
            });
        } else {
    
            if (window.location.href.includes("create")) {
                saveNewCard(event)
                Swal.fire({
                    title: "New Card Created! 😊",
                    icon: "info",
                    confirmButtonColor: "#20B2AA"
                });
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
            newCard["backSideLang"] = languageCodeDetected;
            newCard["frontSideLang"] = languageSelected;
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

    // this function is invoked when the user clicks on the listen to me button:
    const listenToUser = (event) => {
        event.preventDefault();
        // the createRecognitionEvent() function from SpeechRecognitionHelper creates the speech recognition event.
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
    };

    // this function is invoked when the user clicks on the speak button:
    const speakToUser = (event) => {
        event.preventDefault();
        // speak() function from SpeechSynthesisHelper creates the speech synthesis event, passing the phrase and language code as parameters.
        speak(card.frontSide, card.frontSideLang)
    };


    return (
        <div className="deckDetailDiv">
            <form className="cardForm">
                <h2 className="cardForm__title">New Card</h2>
                <div className="card_form">
                    <div className="card-image_form">
                            <textarea className="transOutput" disabled id="frontSide" value={`${translatedWord} ${transliteratedWord}`} placeholder="Translation..." onChange={handleControlledInputChange}></textarea>
                    </div>
                    <div className="card-content_form">
                        <div className="media">
                            <div className="media-content">
                                <input id="backSide" className="title is-4 textInput" placeholder="Enter Text..." value={typedPhrase} onChange={(event) => {
                                        userEnteringWord(event)
                                    }} />
                                <div class="select is-rounded select is-primary">
                                    <select className="langSelect" onChange={(event) => {selectLanguage(event)}}>
                                        <option className="langOption" value="ko--Kore">Korean</option>
                                        <option className="langOption" value="ja--Jpan">Japanese</option>
                                        <option className="langOption" value="en--Latn">Spanish</option>
                                        <option className="langOption" value="en--Latn">English</option>
                                    </select>
                                </div>
                                <div className="speechBut">
                                    <button className="button is-rounded listenButton" onClick={(event) => {listenToUser(event)}}>Listen To Me<img className="listen_icon" src="https://img.icons8.com/fluent/48/000000/foreign-language-sound.png"/></button>
                                    <button onClick={(event) => {speakToUser(event)}} className="button is-rounded speakButton">Speak<img className="speak_icon" src="https://img.icons8.com/ios/50/000000/parrot-speaking.png"/></button>
                                </div>
                            </div>
                        </div>
                        <button className="button is-rounded translateButton" onClick={(event) => {translateWord(event)}}>Translate<img className="trans_icon" src="https://img.icons8.com/color/48/000000/language.png"/></button>
                        <div className="content">
                            <button className="button is-rounded cancel_btn" onClick={(event) => {handleClickCancel(event)}}>Cancel</button>
                            <button className="button is-rounded handleCard__btn" onClick={(event) => {handleClickSaveCard(event)}}>
                                Add Card  
                            </button>
                        </div>
                    </div>
                </div>
            </form>
        </div>
    )
};





