import React, { useContext, useEffect, useState } from "react";


export const QuizDetail = ({quizSelection}) => {

    return (
        <>
            {/* optional chaining operator to ensure code doesn't break for nested property being accessed */}
            <div className="quizDetailDiv">
                <h1>Topic: {quizSelection.currentDeck?.topic}</h1> 
                <h2>Description: {quizSelection.currentDeck?.description}</h2>
                <h3># of Cards in Deck: {quizSelection.flashcards.length}</h3>
            </div>
            <button className="startQuizBut">Start Quiz</button>
        </>
    )
};