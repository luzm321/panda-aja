/* eslint-disable */
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
    let [ myDecksTab, setMyDecksTab ] = useState("is-active");
    let [ allDecksTab, setAllDecksTab ] = useState("");

    const history = useHistory();

    // Empty dependency array - useEffect only runs after first render
    useEffect(() => {
        getUsers()
        .then(getDecks)
    }, []);

    // handler function for myDecks and allDecks views to conditionally render the active tab 
    const tabClicked = (event) => {
      if (event.target.id.includes("myDecks")) {
        myDecksTab = "is-active";
        setMyDecksTab(myDecksTab);
        allDecksTab = ""
        setAllDecksTab(allDecksTab);
      } else if (event.target.id.includes("allDecks")) {
        allDecksTab = "is-active"
        setAllDecksTab(allDecksTab)
        myDecksTab = ""
        setMyDecksTab(myDecksTab)
      }
    };
    
    // ensures the create new deck affordance is only rendered on the myDecks view
    let createNewDeckButton;
    if (myDecksTab === "is-active") {
      createNewDeckButton = <button className="button is-primary addDeckBut" onClick={() => {history.push("/decks/create")}}>
                                Create New Deck <img className="createIcon" src="https://img.icons8.com/color-glass/48/000000/wrench.png"/>
                            </button>
    } else {
      createNewDeckButton = null;
    };

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
              <li className={myDecksTab}>
                <a id="myDecks_1" onClick={(event) => {tabClicked(event)}}>
                  <span id="myDecks_2" className="icon is-small" onClick={(event) => {tabClicked(event)}}><img id="myDecks_4" src="https://img.icons8.com/ultraviolet/80/000000/red-yellow-cards.png" onClick={(event) => {tabClicked(event)}}/></span>
                  <span id="myDecks_3" onClick={(event) => {tabClicked(event)}}>My Decks</span>
                </a>
             </li>
             <li className={allDecksTab}>
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
              if (deck.userId === parseInt(sessionStorage.getItem("pandaAja_user")) && myDecksTab === "is-active") {
                return <>
                  <DeckCard key={deck.id} deck={deck} />
                </>
              } else if (allDecksTab === "is-active"){
                return <>
                  <DeckCard key={deck.id} deck={deck} />
                </>
              }
            })
          }          
        </div>
      </>
  )
};