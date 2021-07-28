import React, { useContext } from "react";
import { FlashCardContext } from "../flashCards/FlashCardProvider";
// import "./FlashCard.css";


export const FlashCardFront = () => {

    const { currentCard } = useContext(FlashCardContext);

    return (
        <>
            <h1 className="cardFrontHeader">Flashcard Front</h1>
            <div className="cardFrontDiv">   
                <h1 className="frontHangeul">{currentCard.frontSide}</h1>
                <h2 className="frontPhonetic">{currentCard.transliteration}</h2>                     
            </div>   
        </>
    )
};