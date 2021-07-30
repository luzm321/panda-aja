/* eslint-disable */
import React from "react";
import { Route } from "react-router-dom";
import { DeckProvider } from "./decks/DeckProvider";
import { UserProvider } from "./users/UserProvider";
import { FlashCardProvider } from "./flashCards/FlashCardProvider";
import { FavoriteDeckProvider } from "./favorites/FavoriteDeckProvider";
import { DeckList } from "./decks/DeckList";
import { FavoriteDeckList } from "./favorites/FavoriteDeckList";
import { DeckDetail } from "./decks/DeckDetail";
import { FlashCardDetail } from "./flashCards/FlashCardDetail";
import { DeckForm } from "./decks/DeckForm";
import { FlashCardForm } from "./flashCards/FlashCardForm";
import { Quiz } from "./quizzes/Quiz";





export const ApplicationViews = () => {

    //The static String.raw() method is a tag function of template literals used to get the raw string form of template literals to escape out of it instead of using multiply backslashes.
    let flashCardIdParameter = String.raw`:flashCardId(\d+)`;

    return (
        <>
            {/* Render the deck list on profile page when http://localhost:3000/decks */}
            <DeckProvider>
                <UserProvider>
                    <FlashCardProvider>
                        <FavoriteDeckProvider>

                            <Route exact path="/decks">
                                <DeckList />
                            </Route>
                            
                            <Route exact path="/decks/detail/:deckId(\d+)">
                                <DeckDetail />
                            </Route>

                            <Route exact path={`/decks/detail/${sessionStorage.getItem("lastDeckView")}/create`}> 
                                <FlashCardForm />
                            </Route>
                            
                            <Route exact path="/decks/create">
                                <DeckForm />
                            </Route>

                            <Route path="/decks/edit/:deckId(\d+)">
                                <DeckForm />
                            </Route>   

                            {/* <Route exact path={`/decks/detail/${sessionStorage.getItem("lastDeckView")}/flashcard/:flashCardId(\d+)> */}
                            <Route exact path={`/decks/detail/${sessionStorage.getItem("lastDeckView")}/flashcard/${flashCardIdParameter}`}>
                                <FlashCardDetail />
                            </Route>

                        </FavoriteDeckProvider>
                    </FlashCardProvider>
                </UserProvider>          
            </DeckProvider>

            <FavoriteDeckProvider>
                <Route exact path="/favorites">
                    <FavoriteDeckList />
                </Route>
            </FavoriteDeckProvider>

            <DeckProvider>
                <UserProvider>
                    <FlashCardProvider>
                        <Route exact path="/quizzes">
                            <Quiz />
                        </Route>
                    </FlashCardProvider>
                </UserProvider>
            </DeckProvider>
        </>
    )
};