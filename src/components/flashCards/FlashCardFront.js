import React, { useContext } from "react";
import { FlashCardContext } from "../flashCards/FlashCardProvider";
// import "./FlashCard.css";



export const FlashCardFront = ({uneditedCardState, updatedCardState, cardInput, handleInputChange}) => {

    const { currentCard } = useContext(FlashCardContext);

    return (
        <> 
            {
                uneditedCardState === true ?
                <>
                    {/* cardInput =  */}
                    <h1 className="cardFrontHeader">Flashcard Front</h1>
                    <div className="cardFrontDiv">
                        <input className="frontHangeul" id="frontSide" defaultValue={currentCard.frontSide} onChange={(event) => {handleInputChange(event)}} />
                        <h2 className="frontPhonetic">{currentCard.transliteration}</h2>
                        <select className="langSelect">
                            <option className="langSelect" value="ko--Kore">Korean</option>
                            <option className="langSelect" value="en--Latn">English</option>
                        </select>
                        <button>Translate</button> 
                        <button className="update__button">Save</button>                 
                    </div>
                </>
                :
                <>
                    <h1 className="cardFrontHeader">Flashcard Front</h1>
                    <div className="cardFrontDiv">   
                        <h1 className="frontHangeul">{currentCard.frontSide}</h1>
                        <h2 className="frontPhonetic">{currentCard.transliteration}</h2>                     
                    </div>   
                </>
            }
        </>
    )
};

