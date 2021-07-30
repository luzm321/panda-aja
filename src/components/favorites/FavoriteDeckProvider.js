import React, { useState, createContext } from "react";

export const FavoriteDeckContext = createContext();

export const FavoriteDeckProvider = (props) => {

    const [favoriteDecks, setFavoriteDecks] = useState([]);

    const getFavoriteDecks = () => {
        return fetch("http://localhost:8088/favoriteDecks?_expand=user&_expand=deck")
        .then(res => res.json())
        .then(setFavoriteDecks)
    };

    const getUserFavoriteDecks = () => {
        return fetch("http://localhost:8088/favoriteDecks?_expand=user&_expand=deck")
        .then(res => res.json())
        .then((allFavoriteDecks) => {
            let userFavoriteDecks = allFavoriteDecks.filter((favoriteDeck) => {
                if (favoriteDeck.userId === parseInt(sessionStorage.getItem("pandaAja_user"))) {
                    return favoriteDeck;
                }
            })
            setFavoriteDecks(userFavoriteDecks);
        })
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

    const deleteFavoriteDeck = (favoriteDeckId) => {
        return fetch(`http://localhost:8088/favoriteDecks/${favoriteDeckId}`, {
            method: "DELETE"
        })
        .then(getFavoriteDecks)
    };  


    return (
        <FavoriteDeckContext.Provider value={{
            favoriteDecks, getFavoriteDecks, addFavoriteDeck, getUserFavoriteDecks, deleteFavoriteDeck
        }}>
            {props.children}
        </FavoriteDeckContext.Provider>
    );

};