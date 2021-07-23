import React from "react";
import { Route } from "react-router-dom";
import { DeckProvider } from "./decks/DeckProvider";
import { UserProvider } from "./users/UserProvider";
import { DeckList } from "./decks/DeckList";
import { DeckDetail } from "./decks/DeckDetail";
import { DeckForm } from "./decks/DeckForm";



export const ApplicationViews = () => {

    return (
        <>
            {/* Render the deck list on profile page when http://localhost:3000/decks */}
            <DeckProvider>
                <UserProvider>
                    <Route exact path="/decks">
                        <DeckList />
                    </Route>

                    <Route exact path="/decks/detail/:deckId(\d+)">
                        <DeckDetail />
                    </Route>

                    <Route exact path="/decks/create">
                        <DeckForm />
                    </Route>

                    <Route path="/decks/edit/:deckId(\d+)">
                        <DeckForm />
                    </Route>   
                </UserProvider>          
            </DeckProvider>
        </>
    )
};