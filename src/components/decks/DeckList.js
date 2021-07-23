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
    const history = useHistory();

    // Empty dependency array - useEffect only runs after first render
    useEffect(() => {
        getUsers()
        .then(getDecks)
    }, []);


    // return (
    //     <>
    //       <h2 className="deckHeader">My Decks</h2>
    //             <button className="addDeckBut" onClick={() => {history.push("/decks/create")}}>
    //             Add New Deck
    //         </button>
    
    //       <div className="decks">
    //         {
    //           decks.map(deck => {
    //             return <DeckCard key={deck.id} deck={deck} />
    //           })
    //         }
    //       </div>
    //     </>
    // )

    let deckButtons;
    let myDeckTab;
    let allDeckTab;

    return (
      <>
        {
          users.map(user => {
            if (user.id === parseInt(sessionStorage.getItem("pandaAja_user"))) {
              return <UserWelcome userName={user.name} />
            }
          })
        }
        <h2 className="deckHeader">My Decks</h2>
          <button className="addDeckBut" onClick={() => {history.push("/decks/create")}}>
              Add New Deck
          </button>
  
        <div className="decks">
          {
            decks.map(deck => {
              if (deck.userId === parseInt(sessionStorage.getItem("pandaAja_user"))) {
                myDeckTab = "myDecks";
                deckButtons = true;
                return <DeckCard key={deck.id} deck={deck} myDeckTab={myDeckTab} deckButProp={deckButtons}/>;
              } else {
                allDeckTab = "allDecks";
                deckButtons = false;
                return <DeckCard key={deck.id} deck={deck} allDeckTab={allDeckTab} deckButProp={deckButtons} />
              }
            })
          }
        </div>
      </>
  )
};