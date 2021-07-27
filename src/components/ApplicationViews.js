/* eslint-disable */
import React, { useState } from "react";
import { Route } from "react-router-dom";
import { DeckProvider } from "./decks/DeckProvider";
import { UserProvider } from "./users/UserProvider";
import { FlashCardProvider } from "./flashCards/FlashCardProvider";
import { DeckList } from "./decks/DeckList";
import { DeckDetail } from "./decks/DeckDetail";
import { DeckForm } from "./decks/DeckForm";
import { FlashCardForm } from "./flashCards/FlashCardForm";



export const ApplicationViews = () => {

    // make an empty state for the deck, assign an empty object as initial value because it doesn't matter, it will be replaced.
    // const [deck, setDeck] = useState({
    //     description: "",
    //     id: 0,
    //     topic: "",
    //     user: {},
    //     userId: 0
    // });

    const [deck, setDeck] = useState({});

    // this function will be passed as a prop to DeckList, and then to DeckCard where it will be invoked. When the user clicks on a deck topic this function
    // will be invoked and DeckCard will pass the deck object into the function as a parameter.
    // This function lives here and its doing things here in this level, however its being invoked down in the DeckCard level so that the DeckCard component can
    // send it the deck object. Then its received here and then gets assigned as the new value of the deck state.
    const changeDeckState = (deckStateFromDeckCard) => {
        // let newDeck = {...deck};
        // newDeck = deckStateFromDeckCard
        setDeck(deckStateFromDeckCard)
        console.log('deck state', deck, 'value', deckStateFromDeckCard);
    }


    // after assigning the deck the user selected in DeckCard to the deck state, then pass that deck state as a prop to DeckDetail where it will be
    // rendered
    return (
        <>
            {/* Render the deck list on profile page when http://localhost:3000/decks */}
            <DeckProvider>
                <UserProvider>
                    <FlashCardProvider>
                        <Route exact path="/decks">
                            <DeckList changeDeckState={changeDeckState}/>
                        </Route>
                        
                        <Route exact path="/decks/detail/:deckId(\d+)">
                            <DeckDetail deckData={deck}/>
                        </Route>

                        <Route exact path={`/decks/detail/${sessionStorage.getItem("lastDeckView")}/create`}> 
                        {/* <Route exact path="/flashCardForm/:cardId(\d+)"> */}
                            <FlashCardForm deckData={deck} />
                        </Route>
{/* 
                        <Route exact path="/decks/detail/:deckId(\d+)/edit"> 
                            <FlashCardForm />
                        </Route> */}
                        

                        <Route exact path="/decks/create">
                            <DeckForm />
                        </Route>

                        <Route path="/decks/edit/:deckId(\d+)">
                            <DeckForm />
                        </Route>   
                    </FlashCardProvider>
                </UserProvider>          
            </DeckProvider>
        </>
    )
};