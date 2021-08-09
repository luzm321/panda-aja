import React, { useContext, useEffect }from "react";
import { FlashCardContext } from "../flashCards/FlashCardProvider";
import { QuizScoreDetail } from "./QuizScoreDetail";
import "./Quiz.css";


export const QuizScoreDisplay = () => {

    const {scores, getScores} = useContext(FlashCardContext);

    useEffect(() => {
        getScores()
    }, []);

    return (
        <>
            <h1 className="scoreHistoryHeader">Quiz Score History</h1>

            {
                scores.map(score => {
                    if (score.userId === parseInt(sessionStorage.getItem("pandaAja_user")))
                        return <QuizScoreDetail key={score.id} score={score} />
                })
            }
        </>
    )   
};