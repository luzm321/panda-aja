import React, { useContext, useEffect, useState } from "react";
import { useHistory, useParams } from 'react-router-dom';
import { DeckContext } from "./DeckProvider";


export const DeckForm = () => {

    const { addDeck, getDecks, getDeckById, updateDeck } = useContext(DeckContext);

    // Define the intial state of the form inputs with useState()
    const [deck, setDeck] = useState({
        userId: 0,
        topic: "",
        description: "",
    });

    const [isLoading, setIsLoading] = useState(true);

    const { deckId } = useParams();
    const history = useHistory();

    useEffect(() => {
        getDecks()
        .then(() => {
          if (deckId){
            getDeckById(deckId)
            .then(deck => {
                setDeck(deck)
                setIsLoading(false)
            })
          } else {
            setIsLoading(false)
          }
        })
    }, [])

    //when a field changes, update state. The return will re-render and display based on the values in state
    //Controlled component
    const handleControlledInputChange = (event) => {
        /* When changing a state object or array,
        always create a copy, make changes, and then set state.*/
        const newDeck = { ...deck }
        /* Deck is an object with properties.
        Set the property to the new value
        using object bracket notation. */
        newDeck[event.target.id] = event.target.value
        // update state
        setDeck(newDeck)
    };

    const saveNewDeck = () => {
        const newDeck = {
          topic: deck.topic,
          description: deck.description,
          userId: parseInt(deck.userId),
        }
        addDeck(newDeck)
          .then(() => history.push("/decks"))
    };

    const saveEditDeck = () => {
        updateDeck({
          id: deck.id,
          topic: deck.topic,
          description: deck.description,
          userId: parseInt(deck.userId),
        })
        .then(() => history.push(`/decks/detail/${deck.id}`))
    };

    
    const handleClickSaveDeck = (event) => {
        event.preventDefault() //Prevents the browser from submitting the form

        const topic = deck.topic
        const description = deck.description

        if (topic === "" || description === "") {
        window.alert("Please provide values for both input fields. 👇")
        } else {
        //Invoke addDeck passing the new deck object as an argument
        //Once complete, change the url and display the deck list
            setIsLoading(true);

            if (deckId) {
                //PUT - update
                saveEditDeck()
            } else {
                saveNewDeck()
            }
        };
    };

    
    return (
        <form className="deckForm">
          <h2 className="deckForm__title">{deckId ? "Edit Deck" : "New Deck" }</h2>
          <fieldset>
            <div className="form-group">
              <label htmlFor="topic">Deck Topic:</label>
              <input type="text" id="topic" required autoFocus className="form-control" placeholder="Deck topic..." value={deck.topic} onChange={handleControlledInputChange} />
            </div>
          </fieldset>
          <fieldset>
            <div className="form-group">
              <label htmlFor="description">Description:</label>
              <input type="text" id="description" required autoFocus className="form-control" placeholder="Deck description..." value={deck.description} onChange={handleControlledInputChange} />
            </div>
          </fieldset>
          <button className="handleDeck__btn" disabled={isLoading} onClick={handleClickSaveDeck}>
          {deckId ? "Save Deck" : "Add Deck" }
          </button>
        </form>
    );
};