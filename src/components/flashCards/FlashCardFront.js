import React, { useContext } from "react";
import { FlashCardContext } from "../flashCards/FlashCardProvider";
// import "./FlashCard.css";


export const FlashCardFront = () => {

    const { currentCard } = useContext(FlashCardContext);

    return (
        <>
            <h1>Flashcard Front</h1>
            <div className="">   
                <h1>{currentCard.frontSide}</h1>
                <h2>{currentCard.transliteration}</h2>                     
            </div>   
        </>
    )
};