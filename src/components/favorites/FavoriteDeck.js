import React, { useContext, useEffect} from "react";
import "./FavoriteDeck.css";



export const FavoriteDeck = ({ favoriteDeck }) => {


    return (
        <>
            <div className="deck">
                <div className="card">
                    <header className="card-header">
                        <p className="card-header-title">{favoriteDeck.deck.topic}</p>
                    </header>
                </div>
                <div className="card-content"></div>
                <div className="content"></div>
                <div className="faveDeck__description">Description: {favoriteDeck.deck.description}</div>
            </div>
        </>
    )
};