//Component's responsibility is to capture the text from the user. As the user types, the searchTerms state variable must immediately be 
//updated in the parent component:


import React, { useContext } from "react";
import { DeckContext } from "./DeckProvider";
import "./Deck.css";


export const DeckSearch = () => {

    const { setSearchTerms } = useContext(DeckContext);

    return (
        <>
            <div className="searchBar">
                <div className="search">Deck search:</div>
                <input type="text"
                    className="input--wide"
                    onKeyUp={(event) => setSearchTerms(event.target.value)}
                    placeholder="Search for a deck... " />
            </div>
        </>
    )
};