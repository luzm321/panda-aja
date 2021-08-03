/* eslint-disable */
import React, { useEffect, useContext, useState } from "react";
import { useHistory } from 'react-router-dom';
import { DeckContext } from "./DeckProvider";
import { UserContext } from "../users/UserProvider";
import { DeckCard } from "./DeckCard";
import { UserWelcome } from "../UserWelcome";
import "./Deck.css";
import { FavoriteDeckContext } from "../favorites/FavoriteDeckProvider";

export const DeckList = () => {

    const { decks, getDecks, searchTerms } = useContext(DeckContext);
    const { users, getUsers } = useContext(UserContext);
    const { getUserFavoriteDecks, favoriteDecks } = useContext(FavoriteDeckContext);
    let [ myDecksTab, setMyDecksTab ] = useState("is-active");
    let [ allDecksTab, setAllDecksTab ] = useState("");

    // Since no longer ALWAYS displaying all of the decks:
    const [ filteredDecks, setFilteredDecks ] = useState([])
    const history = useHistory();

    // Empty dependency array - useEffect only runs after first render
    // searchTerms will cause a change
    useEffect(() => {
      if (searchTerms !== "") {
        // If the search field is not blank, display matching decks
        const subset = decks.filter(deck => deck.topic.toLowerCase().includes(searchTerms))
        setFilteredDecks(subset)
      } else {
      // If the search field is blank, display all decks
      setFilteredDecks(decks)
      getUsers()
      .then(getDecks)
      .then(getUserFavoriteDecks)
      }
    }, [searchTerms, decks]);

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
      createNewDeckButton = <button className="button is-rounded addDeckBut" onClick={() => {history.push("/decks/create")}}>
                                Create New Deck <img className="createIcon" src="https://img.icons8.com/color-glass/48/000000/wrench.png"/>
                            </button>
    } else {
      createNewDeckButton = null;
    };

    // initial count value of i for the favorite decks array is zero;
    let i = 0;

    return (
      <div className="deckPageDiv">
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
            filteredDecks.map(deck => {
              // matching id of deck to userFavorite deckId
              let favoritedDecks = favoriteDecks.filter((userFavorite) => {
                if (deck.id === userFavorite.deckId) {
                    return userFavorite;
                }
              });

              let isFavorite;
            // if the found user favorite decks array is empty and clicked, then the isFavorite prop passed to DeckCard component below will be true
            // and app will render the colored finger heart icon and unfavorite button on deck
              if (typeof favoritedDecks[i] !== 'undefined') {
                  if (favoritedDecks[i].deckId === deck.id) {
                      isFavorite = true
                  }
            // if the array is not empty when clicked, then the isFavorite prop passed to DeckCard component below will be false and app will 
            // render the empty finger heart icon and favorite button on the deck
              } else {
                  isFavorite = false
              };

              if (deck.userId === parseInt(sessionStorage.getItem("pandaAja_user")) && myDecksTab === "is-active") {
                return <>
                  <DeckCard key={deck.id} deck={deck} isFavorite={isFavorite} favoriteDeck={favoritedDecks[i]}/>
                </>
              } else if (allDecksTab === "is-active"){
                return <>
                  <DeckCard key={deck.id} deck={deck} isFavorite={isFavorite} favoriteDeck={favoritedDecks[i]}/>
                </>
              }
            })
          }          
        </div>
      </div>
  )
};