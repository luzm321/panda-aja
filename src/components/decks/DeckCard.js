/* eslint-disable */
import React, { useContext} from "react";
import { Link } from "react-router-dom";
import { DeckContext } from "./DeckProvider";
import { FavoriteDeckContext } from "../favorites/FavoriteDeckProvider";
import { useHistory } from "react-router-dom";
import "./Deck.css";


export const DeckCard = ({ deck, isFavorite, favoriteDeck }) => {

  const { deleteDeck, assignCurrentDeck } = useContext(DeckContext);
  const { addFavoriteDeck, deleteFavoriteDeck } = useContext(FavoriteDeckContext);

	const history = useHistory();

  const handleDeleteDeck = () => {
    deleteDeck(deck.id)
      .then(() => {
        history.push("/decks")
      })
  };

  const saveFaveDeck = () => {
    const newFaveDeck = {
        deckId: deck.id,
        userId: parseInt(sessionStorage.getItem("pandaAja_user"))
    };
        
        addFavoriteDeck(newFaveDeck);
  };

  const removeFaveDeck = () => {
    deleteFavoriteDeck(favoriteDeck.id)
  };
  
  return (
    <div className="deck" onMouseOver={() => {
       // onMouseOver event listener when user hovers mouse over the deck, app sends the deck object to ApplicationViews to change state of deck
      assignCurrentDeck(deck);
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
      <div className="card-content-deck">
        <div className="content">
          <div className="deck__description">Description: { deck.description }</div>
          
        </div>
      </div>
      { deck.userId === parseInt(sessionStorage.getItem("pandaAja_user")) ?
        isFavorite ?
        <footer className="card-footer">
        <a onClick={() => {removeFaveDeck()}} className="button card-footer-item-deck">Unfavorite<img className="unfavoriteIconDeck" src="./images/coloredFingerHeart.jpg"/></a>
        <a onClick={() => {history.push(`/decks/edit/${deck.id}`)}} className="button card-footer-item-deck">Edit<img className="pencilIconDeck" src="https://img.icons8.com/ios-glyphs/30/000000/pencil--v1.png"/></a>
        <a onClick={() => {handleDeleteDeck()}} className="button card-footer-item-deck">Delete<img className="trashIconDeck" src="https://img.icons8.com/material/24/000000/trash--v1.png"/></a>
        </footer>
        :
        <footer className="card-footer">
        <a onClick={() => {saveFaveDeck()}} className="button card-footer-item-deck">Favorite<img className="favoriteIconDeck" src="./images/emptyFingerHeart.jpg"/></a>
        <a onClick={() => {history.push(`/decks/edit/${deck.id}`)}} className="button card-footer-item-deck">Edit<img className="pencilIconDeck" src="https://img.icons8.com/ios-glyphs/30/000000/pencil--v1.png"/></a>
        <a onClick={() => {handleDeleteDeck()}} className="button card-footer-item-deck">Delete<img className="trashIconDeck" src="https://img.icons8.com/material/24/000000/trash--v1.png"/></a>
        </footer>
        :
        null
      }
    </div>
  );
};
