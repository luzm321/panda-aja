import React, { useContext, useState, useEffect} from "react";
import { FlashCardContext } from "../flashCards/FlashCardProvider";
import { translatePhrase, transliteratePhrase, detectLanguage } from "./TranslationProvider";
// import "./FlashCard.css";



export const FlashCardBack = ({uneditedCardState, updatedCardState, handleInputChange, saveEditCard}) => {

    const { currentCard, getFlashCards, getAllCardsInThisDeck, assignCurrentCard } = useContext(FlashCardContext);
    const [ translatedWord, setTranslation ] = useState("");
    const [ languageCode, setLanguageCode ] = useState("ko");
    const [ languageTransliterationCode, setTransliterationCode ] = useState("Kore");
    const [ transliteration, setTransliteration ] = useState("");

    let transliterationText;
    if(currentCard.transliteration.length !== 0 && currentCard.backSideLang !== "en") { 
        transliterationText = <h2 className="frontPhonetic">{currentCard.transliteration}</h2>
    } else {
        transliterationText = null;
    }

    return (
        <> 
        {/* Ternary below conditionally renders either the unedited vs the updated views of card based on state of uneditedCardState */}
            {
                uneditedCardState === true ?
                <>
                    {/* Edit card view */}
                    <h1 className="cardBackHeader">Flashcard Back</h1>
                    <div className="cardBackDiv">
                        <textarea disabled placeholder="Translated Text..." value={translatedWord}></textarea>
                        <input className="backEnglish" id="backSide" defaultValue={currentCard.backSide} onChange={(event) => {handleInputChange(event)}} />
                        <select className="langSelect" onChange={(event) => {
                            let languageCode = event.target.value.split("--")[0];
                            let languageTransliterationCode = event.target.value.split("--")[1];
                            setLanguageCode(languageCode);
                            setTransliterationCode(languageTransliterationCode);
                        }}>
                            <option className="langSelect" value="ko--Kore">Korean</option>
                            <option className="langSelect" value="en--Latn">English</option>
                        </select>
                        <button onClick={() => {
                            console.log('updated card state', updatedCardState);
                            console.log('language code', languageCode)
                            detectLanguage(updatedCardState.backSide).then((languageCodeDetected) => {
                                updatedCardState["backSideLang"] = languageCodeDetected;
                                updatedCardState["frontSideLang"] = languageCode;
                                console.log('card updating', updatedCardState);
                                translatePhrase(languageCode, updatedCardState.backSide, languageCodeDetected).then(translation => {
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
                            });
                        }}>Translate</button> 
                        <button className="update__button" onClick={() => {
                               if (translatedWord.length !== 0 && transliteration.length !== 0) {
                                updatedCardState["frontSide"] = translatedWord;
                                updatedCardState["transliteration"] = transliteration;
                            } else{ 
                                updatedCardState["frontSide"] = updatedCardState.frontSide;
                                updatedCardState["transliteration"] = updatedCardState.transliteration;
                            }
                            assignCurrentCard(updatedCardState);
                            console.log('updated card', updatedCardState);
                            saveEditCard(updatedCardState);
                        }}>Save</button>
                        <button>Cancel</button>               
                    </div>
                </>
                :
                <>
                    {/* Unedited card view */}
                    <h1 className="cardBackHeader">Flashcard Back</h1>
                    <div className="cardBackDiv">   
                        <h1 className="backEnglish">{currentCard.backSide}</h1>   
                        {transliterationText}               
                    </div>   
                </>
            }
        </>
    )
};

