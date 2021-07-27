import React, { useContext, useEffect, useState } from "react";
import { FlashCardContext } from "../flashCards/FlashCardProvider";
import "./FlashCard.css";
import { useParams, useHistory } from "react-router-dom";


export const FlashCardDetail = () => {

    const history = useHistory();

    const { getFlashCardById, userDeckFlashCards } = useContext(FlashCardContext);

    const [flashcard, setFlashCard] = useState({});

	const {flashCardId} = useParams();

    useEffect(() => {
        console.log("useEffect", flashCardId)
        getFlashCardById(flashCardId)
        .then((response) => {
          setFlashCard(response)
        })
    }, []);

     //Reroute to deck detail page on cancel
     const handleClickCancel = (event) => {
        event.preventDefault() //Prevents the browser from refreshing when submitting the form/clicking cancel button
        window.history.back();
    };

    // console.log("flash card id", flashCardId)
    console.log(userDeckFlashCards)
    return (
        <>
            <h1>Flashcard View</h1>

            {
                userDeckFlashCards.map((flashCard) => {
                    if (flashCard.id === parseInt(flashCardId)) {
                        return <>
                                <div className="flip-card">
                                    <div className="flip-card-inner">
                                        <div className="card flip-card-front">
                                            <div className="card-content">
                                                    <div className="">
                                                        <h1>{flashCard.frontSide}</h1>
                                                        <h2>{flashCard.transliteration}</h2>
                                                    </div>
                                            </div>
                                        </div>
                                        <div className="card flip-card-back">
                                            <div className="card-content">
                                                <h1>{flashCard.backSide}</h1>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                        </>
                    } else {
                        return null;
                    }
                })
            }
        </>
    )
};