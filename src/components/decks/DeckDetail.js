import React, { useContext, useEffect, useState } from "react";
import { DeckContext } from "./DeckProvider";
import "./Deck.css";
import { useParams, useHistory } from "react-router-dom";


export const DeckDetail = () => {

    const { getDeckById, deleteDeck } = useContext(DeckContext);

    const [deck, setDeck] = useState({});

	const {deckId} = useParams();
	const history = useHistory();

    useEffect(() => {
        getDeckById(deckId)
        .then((response) => {
          setDeck(response)
        })
    }, []);

    const handleDeleteDeck = () => {
        deleteDeck(deck.id)
          .then(() => {
            history.push("/decks")
          })
    };

    return (
        <section className="deck">
          <h3 className="deck__topic">Topic: {deck.topic}</h3>
          <div className="deck__description">Description: {deck.description}</div>
          <button className="delete__btn" onClick={handleDeleteEmployee}>Delete Deck</button>
          <button className="edit__btn" onClick={() => {history.push(`/decks/edit/${deck.id}`)}}>
            Edit
          </button>
        </section>
      )
};