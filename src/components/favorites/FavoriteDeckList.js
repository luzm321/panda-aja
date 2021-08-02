import React, { useEffect, useContext } from "react";
import { FavoriteDeckContext } from "./FavoriteDeckProvider";
import { FavoriteDeck } from "./FavoriteDeck";
import "./FavoriteDeck.css";


export const FavoriteDeckList = () => {

    const { favoriteDecks, getFavoriteDecks } = useContext(FavoriteDeckContext);
    // const [faveDeck, setFaveDeck] = useState([]);

     // Empty dependency array - useEffect only runs after first render
    useEffect(() => {
        getFavoriteDecks()
    }, []);

    return (
        <div className="faveDiv">
            <h1 className="faveHeader">My Favorite Decks</h1><img className="faveGif" src="https://i.pinimg.com/originals/4a/82/e2/4a82e26bd1988b8f08fafc10892b8cd0.gif" />

            {
                favoriteDecks.map(favoriteDeck => {
                    return <FavoriteDeck key={favoriteDeck.id} favoriteDeck={favoriteDeck} />
                })
            }   
        </div>
    )
};

