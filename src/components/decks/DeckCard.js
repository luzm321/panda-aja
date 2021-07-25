/* eslint-disable */
import React, { useContext} from "react";
import { Link } from "react-router-dom";
import { DeckContext } from "./DeckProvider";
import { useHistory } from "react-router-dom";
import "./Deck.css";


export const DeckCard = ({ deck }) => {

  const { deleteDeck } = useContext(DeckContext);

	const history = useHistory();

  const handleDeleteDeck = () => {
    deleteDeck(deck.id)
      .then(() => {
        history.push("/decks")
      })
  };


  
  return (
    <div className="deck">
      <div className="card">
        <header className="card-header">
          <p className="card-header-title">
            <Link to={`/decks/detail/${deck.id}`}>
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
