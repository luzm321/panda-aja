import React, { useState, createContext } from "react";

export const FavoriteDeckContext = createContext();

export const FavoriteDeckProvider = (props) => {

    const [favoriteDecks, setFavoriteDecks] = useState([]);

    const getFavoriteDecks = () => {
        return fetch("http://localhost:8088/favoriteDecks?_expand=user&_expand=deck")
        .then(res => res.json())
        .then(setFavoriteDecks)
    };

    const addFavoriteDeck = (deck) => {
        return fetch("http://localhost:8088/favoriteDecks", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(deck)
        })
        .then(getFavoriteDecks)
    };


    return (
        <FavoriteDeckContext.Provider value={{
            favoriteDecks, getFavoriteDecks, addFavoriteDeck
        }}>
            {props.children}
        </FavoriteDeckContext.Provider>
    );

};