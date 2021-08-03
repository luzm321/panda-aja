import React, { useContext, useState, useEffect} from "react";
import { useHistory } from "react-router-dom";
import { FlashCardContext } from "../flashCards/FlashCardProvider";
import { translatePhrase, transliteratePhrase, detectLanguage } from "./TranslationProvider";
// import "./FlashCard.css";



export const FlashCardFront = ({uneditedCardState, updatedCardState, handleInputChange, saveEditCard, setUneditedCard}) => {

    const { currentCard, getAllCardsInThisDeck, assignCurrentCard } = useContext(FlashCardContext);
    const [ translatedWord, setTranslation ] = useState("");
    const [ languageCode, setLanguageCode ] = useState("ko");
    const [ languageTransliterationCode, setTransliterationCode ] = useState("Kore");
    const [ transliteration, setTransliteration ] = useState("");

    const history = useHistory();

    useEffect(() => {
        getAllCardsInThisDeck(parseInt(sessionStorage.getItem("lastDeckView")))
    }, []);

    let transliterationText;
    if(currentCard.transliteration.length !== 0 && currentCard.frontSideLang !== "en") { 
        transliterationText = <h2 className="frontPhonetic">{currentCard.transliteration}</h2>
    } else {
        transliterationText = null;
    };

    //Reroute to flashcard detail view on cancel
    const handleClickCancel = (event) => {
        event.preventDefault() //Prevents the browser from refreshing when submitting the form/clicking cancel button
        setUneditedCard(false);
    };

    return (
        <> 
        {/* Ternary below conditionally renders either the unedited vs the updated views of card based on state of uneditedCardState */}
            {
                uneditedCardState === true ?
                <>
                    {/* Edit card view */}
                    <h1 className="cardFrontHeader">Flashcard Front</h1>
                    <div className="cardFrontDiv">
                        <textarea className="trans_output" disabled placeholder="Translation..." value={translatedWord}></textarea>
                        <input className="frontHangeul" id="frontSide" defaultValue={currentCard.frontSide} onChange={(event) => {handleInputChange(event)}} />
                        <h2 className="frontPhonetic" defaultValue={currentCard.transliteration}>{transliteration}</h2>
                        <select className="langSelection" onChange={(event) => {
                            let languageCode = event.target.value.split("--")[0];
                            let languageTransliterationCode = event.target.value.split("--")[1];
                            setLanguageCode(languageCode);
                            setTransliterationCode(languageTransliterationCode);
                        }}>
                            <option className="langSelect" value="ko--Kore">Korean</option>
                            <option className="langSelect" value="en--Latn">English</option>
                        </select>
                        <button className="button is-rounded translateBut" onClick={() => {
                            console.log('updated card state on translate', updatedCardState, currentCard);
                            console.log('language code', languageCode)
                            detectLanguage(updatedCardState.frontSide).then((languageCodeDetected) => {
                                updatedCardState["frontSideLang"] = languageCodeDetected;
                                updatedCardState["backSideLang"] = languageCode;
                                translatePhrase(languageCode, updatedCardState.frontSide, languageCodeDetected).then(translation => {
                                    setTranslation(translation);
                                    if (languageTransliterationCode !== "Latn") {
                                        transliteratePhrase(languageCode, translation, languageTransliterationCode).then(transliteration => {
                                            setTransliteration(transliteration);
                                        });
                                    } else {
                                        setTransliteration("");
                                    }
                                    console.log('translated word', translatedWord);
                                });
                            })
                        }}>Translate</button> 
                        <button className="button is-rounded update__button" onClick={() => {
                            console.log('updated card state on save', updatedCardState, currentCard)
                            if (translatedWord.length !== 0 && transliteration.length !== 0) {
                                updatedCardState["backSide"] = translatedWord;
                                updatedCardState["transliteration"] = transliteration;
                            } else{ 
                                updatedCardState["backSide"] = updatedCardState.backSide;
                                updatedCardState["transliteration"] = updatedCardState.transliteration;
                            }
                            assignCurrentCard(updatedCardState);
                            console.log('updated card', updatedCardState);
                            saveEditCard(updatedCardState);
                        }}>Save</button>
                        <button className="button is-rounded cancel__btn" onClick={(event) => {handleClickCancel(event)}}>Cancel</button>                
                    </div>
                </>
                :
                <>
                    {/* Unedited card view */}
                    <h1 className="cardFrontHeader">Flashcard Front</h1>
                    <div className="cardFrontDiv">   
                        <h1 className="frontHangeul">{currentCard.frontSide}</h1>
                        {transliterationText} 
                    </div>   
                </>
            }
        </>
    )
};

