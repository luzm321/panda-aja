import React, { useContext } from "react";
import { FlashCardContext } from "../flashCards/FlashCardProvider";
// import "./FlashCard.css";


export const FlashCardBack = () => {

    const { currentCard } = useContext(FlashCardContext);


    return (
        <>
            <h1 className="cardBackHeader">Flashcard Back</h1>
            <div className="cardBackDiv">
                <h1 className="backEnglish">{currentCard.backSide}</h1>
            </div>
               
        </>
    )
};