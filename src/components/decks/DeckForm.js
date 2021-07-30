/* eslint-disable */
import React, { useContext, useEffect, useState } from "react";
import { useHistory, useParams } from 'react-router-dom';
import { DeckContext } from "./DeckProvider";


export const DeckForm = () => {

    const { addDeck, getDecks, getDeckById, updateDeck } = useContext(DeckContext);

    // Define the initial state of the form inputs with useState()
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
          if (deckId) {
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

    const saveNewDeck = (event) => {
      event.preventDefault() //Prevents the browser from refreshing when submitting the form
        const newDeck = {
          topic: deck.topic,
          description: deck.description,
          userId: parseInt(sessionStorage.getItem("pandaAja_user")),
        }
        //Invoke addDeck passing the new deck object as an argument
        //Once complete, change the url and display the deck list
        addDeck(newDeck)
          .then(() => history.push("/decks"))
    };

    const saveEditDeck = (event) => {
        event.preventDefault() //Prevents the browser from refreshing when submitting the form
        updateDeck({
          id: deck.id,
          topic: deck.topic,
          description: deck.description,
          userId: parseInt(sessionStorage.getItem("pandaAja_user")),
        })
        .then(() => history.push(`/decks`))
    };

    
    const handleClickSaveDeck = (event) => {
        event.preventDefault() //Prevents the browser from refreshing when submitting the form

        const topic = deck.topic
        const description = deck.description

        if (topic === "" || description === "") {
        window.alert("Please provide values for both input fields. 👇")
        } else {
          setIsLoading(true);

          if (deckId) {
              //PUT - update
              saveEditDeck(event)
              alert("Deck Updated! 😊")
          } else {
              saveNewDeck(event)
              alert("New Deck Created! 😊")
          }
        };
    };

    //Reroute to profile/decks page on cancel
    const handleClickCancel = (event) => {
      event.preventDefault() //Prevents the browser from refreshing when submitting the form/clicking cancel button
      window.history.back();
    };

    
    return (
        <form className="deckForm">
          <h2 className="deckForm__title">{deckId ? "Edit Deck" : "New Deck" }</h2>
          <fieldset className="deckFormField">
            <div className="form-group">
              <label className="deckFormLabel" htmlFor="topic">Deck Topic:</label>
              <input type="text" id="topic" required autoFocus className="form-control" placeholder="Deck topic..." value={deck.topic} onChange={handleControlledInputChange} />
            </div>
          </fieldset>
          <fieldset className="deckFormField">
            <div className="form-group">
              <label className="deckFormLabel" htmlFor="description">Description:</label>
              <input type="text" id="description" required autoFocus className="form-control" placeholder="Deck description..." value={deck.description} onChange={handleControlledInputChange} />
            </div>
          </fieldset>
          <div className="deckFormButtons"> 
            <button className="cancel__btn" onClick={(event) => {handleClickCancel(event)}}>Cancel</button>
            <button className="handleDeck__btn" disabled={isLoading} onClick={(event) => {handleClickSaveDeck(event)}}>
              { deckId ? "Save Deck" : "Add Deck" }
            </button>
          </div>
        </form>
    );
};