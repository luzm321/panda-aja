import React, { useContext, useEffect } from "react";
import { FlashCardContext } from "../flashCards/FlashCardProvider";
// import "./FlashCard.css";
import { useParams, useHistory } from "react-router-dom";


export const DeckDetail = ({deckData}) => {

    const history = useHistory();


    const { getFlashCards, getAllCardsInThisDeck, userDeckFlashCards, getFlashCardById } = useContext(FlashCardContext);

    useEffect(() => {
        getAllCardsInThisDeck(deckData.id)
    }, []);

    console.log("deckData id", deckData.id)

    return (
        <>
            <button className="addCardBut" onClick={() => {history.push(`/decks/detail/${sessionStorage.getItem("lastDeckView")}/create`)}}>Add New Card</button>
            {
                userDeckFlashCards.map((flashCard) => {
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
                })
            }

        </>
    )
};