import React, { useContext, useEffect } from "react";
import { FlashCardContext } from "../flashCards/FlashCardProvider";
// import "./FlashCard.css";
import { useParams, useHistory, Link } from "react-router-dom";


export const DeckDetail = ({deckData}) => {

    const history = useHistory();


    const { getAllCardsInThisDeck, userDeckFlashCards } = useContext(FlashCardContext);

    useEffect(() => {
        getAllCardsInThisDeck(deckData.id)
    }, []);


     //Reroute to deck detail page on cancel
     const handleClickCancel = (event) => {
        event.preventDefault() //Prevents the browser from refreshing when submitting the form/clicking cancel button
        window.history.back();
    };


    return (
        <>
            <h1>Flashcards</h1>

            {
                parseInt(sessionStorage.getItem("pandaAja_user")) === deckData.userId ? 
                    <button className="addCardBut" onClick={() => {history.push(`/decks/detail/${sessionStorage.getItem("lastDeckView")}/create`)}}>
                        Add New Card
                    </button>
                :
                    null
            }

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
                            <Link to={`/decks/detail/${sessionStorage.getItem("lastDeckView")}/flashcard/${flashCard.id}`}>
                                <button>Show Card Detail</button>
                            </Link>
                    </>
                })
            }
            
            <button className="cancel__btn" onClick={(event) => {handleClickCancel(event)}}>Return to Decks</button>
        </>
    )
};