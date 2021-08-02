import React, { useContext} from "react";
import { useHistory } from "react-router-dom";
import { FavoriteDeckContext } from "./FavoriteDeckProvider";
import "./FavoriteDeck.css";



export const FavoriteDeck = ({ favoriteDeck }) => {

    const { deleteFavoriteDeck } = useContext(FavoriteDeckContext);
    const history = useHistory();

    const removeFaveDeck = () => {
        deleteFavoriteDeck(favoriteDeck.id)
        .then(() => {
            history.push("/favorites")
        })
    };


    return (
        <>
            <div className="deck">
                <div className="card">
                    <header className="card-header">
                        <p className="card-header-title">{favoriteDeck.deck.topic}</p>
                    </header>
                </div>
                <div className="card-content-fave">
                    <div className="content"></div>
                    <div className="faveDeck__description">Description: {favoriteDeck.deck.description}</div>
                </div>
                <footer className="card-footer">
                    <a onClick={() => {removeFaveDeck()}} className="card-footer-item">
                            Unfavorite
                        <img className="unFavoriteIcon" src="./images/coloredFingerHeart.jpg"/>
                    </a>
                </footer>
            </div>
        </>
    )
};