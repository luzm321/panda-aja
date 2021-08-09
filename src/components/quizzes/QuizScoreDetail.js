import React from "react";
import "./Quiz.css";



export const QuizScoreDetail = ({score}) => {

    return (
        <div className="scoreDiv">
            <table className="table is-striped is-hoverable is-bordered">
                <thead className="tableHead">
                    <tr className="table is-hoverable">
                    <th>Deck Topic</th>
                    <th>Deck Description</th>
                    <th>Score</th>
                    <th>Completion Date</th>
                    </tr>
                </thead>
                <tbody className="tableBody">
                    <tr className="table is-hoverable">
                    <td>{score?.deck?.topic}</td>
                    <td>{score?.deck?.description}</td>
                    <td>{score.percentageScore}%</td>
                    <td>{score.completionDate}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    )
};