import React, { useContext } from "react";
import { FlashCardContext } from "../flashCards/FlashCardProvider";
// import "./FlashCard.css";


export const FlashCardBack = () => {

    const { currentCard } = useContext(FlashCardContext);


    return (
        <>
            <h1>Flashcard Back</h1>
            <div className="">
                <h1>{currentCard.backSide}</h1>
            </div>
               
        </>
    )
};