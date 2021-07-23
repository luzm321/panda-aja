import React, { useEffect, useContext, useState } from "react";
import { useHistory } from 'react-router-dom';
import { DeckContext } from "./DeckProvider";
import { UserContext } from "../users/UserProvider";
import { DeckCard } from "./DeckCard";
import { UserWelcome } from "../UserWelcome";
import "./Deck.css";


export const DeckList = () => {

    const { decks, getDecks } = useContext(DeckContext);
    const { users, getUsers } = useContext(UserContext);
    let [ myDecksTabClass, toggleMyDecks ] = useState("is-active");
    let [ allDecksTabClass, toggleAllDecks ] = useState("");

    const history = useHistory();

    // Empty dependency array - useEffect only runs after first render
    useEffect(() => {
        getUsers()
        .then(getDecks)
    }, []);

    // handler function for myDecks and allDecks views to conditionally render the active tab 
    let tabClicked = (event) => {
      console.log('event', event.target);
      if (event.target.id.includes("myDecks")) {
        console.log('clicked on my decks', myDecksTabClass, allDecksTabClass);
        myDecksTabClass = "is-active";
        toggleMyDecks(myDecksTabClass);
        allDecksTabClass = ""
        toggleAllDecks(allDecksTabClass);
      } else if (event.target.id.includes("allDecks")) {
        console.log('clicked on all decks', myDecksTabClass, allDecksTabClass);
        allDecksTabClass = "is-active"
        toggleAllDecks(allDecksTabClass)
        myDecksTabClass = ""
        toggleMyDecks(myDecksTabClass)
      }
    };

    // ensures the create new deck affordance is only rendered on the myDecks view
    let createNewDeckButton;
    if (myDecksTabClass === "is-active") {
      createNewDeckButton = <button className="addDeckBut" onClick={() => {history.push("/decks/create")}}>
                                Add New Deck
                            </button>
    } else {
      createNewDeckButton = null;
    };


    let deckButtons;

    return (
      <>
        {
          users.map(user => {
            if (user.id === parseInt(sessionStorage.getItem("pandaAja_user"))) {
              return <UserWelcome userName={user.name} />
            }
          })
        }
        
        <div className="decks">
        <div className="tabs is-centered is-boxed is-medium">
            <ul>
              <li className={myDecksTabClass}>
                <a id="myDecks_1" onClick={(event) => {tabClicked(event)}}>
                  <span id="myDecks_2" className="icon is-small" onClick={(event) => {tabClicked(event)}}><img id="myDecks_4" src="https://img.icons8.com/ultraviolet/80/000000/red-yellow-cards.png" onClick={(event) => {tabClicked(event)}}/></span>
                  <span id="myDecks_3" onClick={(event) => {tabClicked(event)}}>My Decks</span>
                </a>
             </li>
             <li className={allDecksTabClass}>
              <a id="allDecks_1" onClick={(event) => {tabClicked(event)}}>
                <span id="allDecks_2" className="icon is-small" onClick={(event) => {tabClicked(event)}}><img id="allDecks_4" src="https://img.icons8.com/office/80/000000/red-yellow-cards.png" onClick={(event) => {tabClicked(event)}}/></span>
                <span id="allDecks_3" onClick={(event) => {tabClicked(event)}}>All Decks</span>
              </a>
            </li>
            </ul>
        </div>

          {createNewDeckButton}

          {
            decks.map(deck => {
              if (deck.userId === parseInt(sessionStorage.getItem("pandaAja_user")) && myDecksTabClass === "is-active") {
                deckButtons = true;
                return <>
                  <DeckCard key={deck.id} deck={deck} deckButProp={deckButtons}/>
                </>
              } else if (allDecksTabClass === "is-active"){
                deckButtons = false;
                return <>
                  <DeckCard key={deck.id} deck={deck} deckButProp={deckButtons} />
                </>
              }
            })
          }
          
        </div>
      </>
  )
};