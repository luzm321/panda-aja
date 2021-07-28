import React, { useContext } from "react";
import { FlashCardContext } from "../flashCards/FlashCardProvider";
// import "./FlashCard.css";



export const FlashCardBack = ({uneditedCardState, updatedCardState, cardInput, handleInputChange}) => {

    const { currentCard } = useContext(FlashCardContext);

    return (
        <> 
            {
                uneditedCardState === true ?
                <>
                    {/* cardInput =  */}
                    <h1 className="cardBackHeader">Flashcard Back</h1>
                    <div className="cardBackDiv">
                        <input className="backEnglish" id="backSide" defaultValue={currentCard.backSide} onChange={(event) => {handleInputChange(event)}} />
                        <select className="langSelect">
                            <option className="langSelect" value="ko--Kore">Korean</option>
                            <option className="langSelect" value="en--Latn">English</option>
                        </select>
                        <button>Translate</button> 
                        <button className="update__button">Save</button>                 
                    </div>
                </>
                :
                <>
                    <h1 className="cardBackHeader">Flashcard Back</h1>
                    <div className="cardBackDiv">   
                        <h1 className="backEnglish">{currentCard.backSide}</h1>                    
                    </div>   
                </>
            }
        </>
    )
};



// export const FlashCardBack = () => {

//     const { currentCard } = useContext(FlashCardContext);


//     return (
//         <>
//             <h1 className="cardBackHeader">Flashcard Back</h1>
//             <div className="cardBackDiv">
//                 <h1 className="backEnglish">{currentCard.backSide}</h1>
//             </div>
               
//         </>
//     )
// };

