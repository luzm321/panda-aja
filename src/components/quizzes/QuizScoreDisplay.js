import React, { useContext, useEffect }from "react";
import { FlashCardContext } from "../flashCards/FlashCardProvider";
import { QuizScoreDetail } from "./QuizScoreDetail";
import "./Quiz.css";


export const QuizScoreDisplay = () => {

    const {scores, getScores} = useContext(FlashCardContext);

    useEffect(() => {
        getScores()
    }, []);

    // sort scores array by completion date from newest score to oldest score in descending order:
    // converting string to a date, then doing the comparison:
    const sortedScores = scores.sort((a, b) => new Date(b.completionDate) - new Date(a.completionDate)); 

    return (
        <>
            <h1 className="scoreHistoryHeader">Quiz Score History</h1>

            {
                sortedScores.map(score => {
                    if (score.userId === parseInt(sessionStorage.getItem("pandaAja_user")))
                        return <QuizScoreDetail key={score.id} score={score} />
                })
            }
        </>
    )   
};