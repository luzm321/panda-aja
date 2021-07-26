/* eslint-disable */
import React, { useContext, useEffect} from "react";
import { Link } from "react-router-dom";
import { DeckContext } from "./DeckProvider";
import { useHistory } from "react-router-dom";
import "./Deck.css";


export const DeckCard = ({ deck, changeDeckState }) => {

  const { deleteDeck } = useContext(DeckContext);

	const history = useHistory();

  const handleDeleteDeck = () => {
    deleteDeck(deck.id)
      .then(() => {
        history.push("/decks")
      })
  };

    // useEffect(() => {
    //   getDecks();
    // }, [])

  
  return (
    <div className="deck" onMouseOver={() => {
       // onMouseOver event listener when user hovers mouse over the deck, app sends the deck object to ApplicationViews to change state of deck
      changeDeckState(deck);
    }}>
      <div className="card">
        <header className="card-header">
          <p className="card-header-title">
            <Link to={`/decks/detail/${deck.id}`}  onClick={() => {
              // this onClick triggers when the user click on the Deck topic.
              // it invokes the changeDeckState function that was passed as a prop from applicationViews and sends it the deck object.
              // storing the deck id on click to lastDeck View so that when the user refreshes the page we are able to remember which deck they 
              // were on (to be used on FlashCardProvider component)
                sessionStorage.setItem("lastDeckView", deck.id) 
            }}>
              {deck.topic}
            </Link>
          </p>
        </header>
      </div>
      <div className="card-content">
        <div className="content">
          <div className="deck__description">Description: { deck.description }</div>
          
        </div>
      </div>
      { deck.userId === parseInt(sessionStorage.getItem("pandaAja_user")) ?
        <footer className="card-footer">
        <a className="card-footer-item">Favorite<img className="favoriteIcon" src="./images/emptyFingerHeart.jpg"/></a>
        <a onClick={() => {history.push(`/decks/edit/${deck.id}`)}} className="card-footer-item">Edit<img className="pencilIcon" src="https://img.icons8.com/ios-glyphs/30/000000/pencil--v1.png"/></a>
        <a onClick={() => {handleDeleteDeck()}} className="card-footer-item">Delete<img className="trashIcon" src="https://img.icons8.com/material/24/000000/trash--v1.png"/></a>
        </footer>
        :
        null
      }
    </div>
  );
};
