import React from "react";
import "./Quiz.css";



export const QuizScoreDetail = ({score}) => {

    return (
        <>
            {/* <h1>Deck Topic: {score?.deck?.topic}</h1>
            <h1>Deck Description: {score?.deck?.description}</h1>
            <h2>Score: {score.percentageScore}%</h2>
            <h2>Completion Date: {score.completionDate}</h2> */}

            <table className="table is-striped is-hoverable is-bordered">
            <thead>
                <tr className="table is-hoverable">
                <th>Deck Topic</th>
                <th>Deck Description</th>
                <th>Score</th>
                <th>Completion Date</th>
                </tr>
            </thead>
            <tbody>
                <tr className="table is-hoverable">
                <th>{score?.deck?.topic}</th>
                <td>{score?.deck?.description}</td>
                <td>{score.percentageScore}%</td>
                <td>{score.completionDate}</td>
                </tr>
            </tbody>
            </table>
        </>
    )
};