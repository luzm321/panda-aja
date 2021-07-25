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
        <a className="card-footer-item">Favorite</a>
        <a onClick={() => {history.push(`/decks/edit/${deck.id}`)}} className="card-footer-item">Edit</a>
        <a onClick={() => {handleDeleteDeck()}} className="card-footer-item">Delete</a>
        </footer>
        :
        null
      }
    </div>
  );
};
