import React, { useState, createContext } from "react";

export const FavoriteDeckContext = createContext();

export const FavoriteDeckProvider = (props) => {

    const [favoriteDecks, setFavoriteDecks] = useState([]);

    const getFavoriteDecks = () => {
        return fetch("http://localhost:8088/favoriteDecks?_expand=user&_expand=deck")
        .then(res => res.json())
        .then(setFavoriteDecks)
    };


    return (
        <FavoriteDeckContext.Provider value={{
            favoriteDecks, getFavoriteDecks
        }}>
            {props.children}
        </FavoriteDeckContext.Provider>
    );

};