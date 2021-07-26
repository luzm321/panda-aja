import React, { useContext, useEffect } from "react";
import { FlashCardContext } from "../flashCards/FlashCardProvider";
// import "./FlashCard.css";
import { useParams, useHistory } from "react-router-dom";


//Copy:
export const DeckDetail = ({deckData}) => {

    const history = useHistory();


    const { getFlashCards, getAllCardsInThisDeck, userDeckFlashCards, getFlashCardById } = useContext(FlashCardContext);

    useEffect(() => {
        getAllCardsInThisDeck(deckData.id)
    }, []);


    // const goToCardForm = () => {
    //     history.push(`/FlashCardForm/create`)
    // }
    console.log("deckData id", deckData.id)

    return (
        <>
            {/* <button className="addCardBut" onClick={() => {goToCardForm()}}>Add New Card</button> */}
            <button className="addCardBut" onClick={() => {history.push(`/decks/detail/${deckData.id}/create`)}}>Add New Card</button>
            {
                userDeckFlashCards.map((flashCard) => {
                    return <>
                            <div className="flip-card">
                                <div className="flip-card-inner">
                                    <div className="card flip-card-front">
                                        <div className="card-content">
                                                <div className="">
                                                    <h1>{flashCard.frontSide}</h1>
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




//Original:
// export const DeckDetail = ({deckData}) => {

//     const history = useHistory();


//     const { getFlashCards, getAllCardsInThisDeck, userDeckFlashCards, getFlashCardById } = useContext(FlashCardContext);

//     useEffect(() => {
//         getAllCardsInThisDeck(deckData.id)
//     }, []);


//     const goToCardForm = () => {
//         history.push(`/flashCardForm/${0}`)
//     }

//     return (
//         <>
//             <button className="addCardBut" onClick={() => {goToCardForm()}}>Add New Card</button>
//             {
//                 userDeckFlashCards.map((flashCard) => {
//                     return <>
//                             <div className="flip-card">
//                                 <div className="flip-card-inner">
//                                     <div className="card flip-card-front">
//                                         <div className="card-content">
//                                                 <div className="">
//                                                     <h1>{flashCard.frontSide}</h1>
//                                                 </div>
//                                         </div>
//                                     </div>
//                                     <div className="card flip-card-back">
//                                         <div className="card-content">
//                                             <h1>{flashCard.backSide}</h1>
//                                         </div>
//                                     </div>
//                                 </div>
//                             </div>
//                     </>
//                 })
//             }

//         </>
//     )
// };




//DeckDetail example
// //     const { getDeckById, deleteDeck } = useContext(DeckContext);

// //     const [deck, setDeck] = useState({});

// // 	const {deckId} = useParams();
// // 	const history = useHistory();

// //     useEffect(() => {
// //         getDeckById(deckId)
// //         .then((response) => {
// //           setDeck(response)
// //         })
// //     }, []);

// //     const handleDeleteDeck = () => {
// //         deleteDeck(deck.id)
// //           .then(() => {
// //             history.push("/decks")
// //           })
// //     };

// //     return (
// //         <section className="deck">
// //           <h3 className="deck__topic">Topic: {deck.topic}</h3>
// //           <div className="deck__description">Description: {deck.description}</div>
// //           <button className="delete__btn" onClick={handleDeleteDeck}>Delete Deck</button>
// //           <button className="edit__btn" onClick={() => {history.push(`/decks/edit/${deck.id}`)}}>
// //             Edit
// //           </button>
// //         </section>
// //       )
// // };