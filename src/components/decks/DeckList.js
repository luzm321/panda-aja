import React, { useEffect, useContext, useState } from "react";
import { useHistory } from 'react-router-dom';
import { DeckContext } from "./DeckProvider";
import { DeckCard } from "./DeckCard";
import "./Deck.css";


export const DeckList = () => {

    const { decks, getDecks } = useContext(DeckContext);
    const history = useHistory();

    // Empty dependency array - useEffect only runs after first render
    useEffect(() => {
        getDecks()
    }, []);


    return (
        <>
          <h2 className="deckHeader">My Decks</h2>
                <button className="addDeckBut" onClick={() => {history.push("/decks/create")}}>
                Add New Deck
            </button>
    
          <div className="decks">
            {
              decks.map(deck => {
                return <DeckCard key={deck.id} deck={deck} />
              })
            }
          </div>
        </>
    )
};