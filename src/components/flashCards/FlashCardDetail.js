import React, { useContext, useEffect, useState } from "react";
import { FlashCardContext } from "../flashCards/FlashCardProvider";
import "./FlashCard.css";
import { useParams, useHistory } from "react-router-dom";


export const FlashCardDetail = () => {

    const history = useHistory();

    const { getFlashCardById, userDeckFlashCards, deleteFlashCard } = useContext(FlashCardContext);

    const [flashcard, setFlashCard] = useState({});

	const {flashCardId} = useParams();

    useEffect(() => {
        console.log("useEffect", flashCardId)
        getFlashCardById(flashCardId)
        .then((response) => {
          setFlashCard(response)
        })
    }, []);

    const handleDeleteCard = () => {
        deleteFlashCard(flashCardId)
          .then(() => {
            history.push(`/decks/detail/${sessionStorage.getItem("lastDeckView")}`)
          })
    };

     //Reroute to deck detail page on cancel
     const handleClickCancel = (event) => {
        event.preventDefault() //Prevents the browser from refreshing when submitting the form/clicking cancel button
        window.history.back();
    };

   
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
            
            <div className="card">
                <footer className="card-footer">
                    <a className="card-footer-item">Speak<img src="https://img.icons8.com/ios/50/000000/parrot-speaking.png"/></a>
                    <a className="card-footer-item">Test Self<img src="https://img.icons8.com/office/40/000000/microphone--v1.png"/></a>
                </footer>
            </div>
            <div className="card">
                <footer className="card-footer">
                    <a className="card-footer-item">Edit<img className="pencilIcon" src="https://img.icons8.com/ios-glyphs/30/000000/pencil--v1.png"/></a>
                    <a onClick={() => {handleDeleteCard()}} className="card-footer-item">Delete<img className="trashIcon" src="https://img.icons8.com/material/24/000000/trash--v1.png"/></a>
                </footer>
            </div>
            <button className="cancel__btn" onClick={(event) => {handleClickCancel(event)}}>Return to Flashcards</button>
        </>
    )
};