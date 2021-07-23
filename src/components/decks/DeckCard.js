  import React from "react";
import "./Deck.css";
import { Link } from "react-router-dom";


export const DeckCard = ({ deck }) => (
    <section className="deck">
        <h3 className="deck__topic">
          <Link to={`/decks/detail/${deck.id}`}>
            {deck.topic}
          </Link>
        </h3>
        <div className="deck__description">Description: { deck.description }</div>
    </section>
);