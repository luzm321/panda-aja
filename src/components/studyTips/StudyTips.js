import React from "react";
import "./StudyTips.css";


export const StudyTips = () => {

    return (

        <div className="tipsDiv">
            <div className="content_tips">
                <div className="header">
                    <h1 className="tipsHeader">~Learn the Korean Alphabet/Hangeul ( 한글 )~</h1>
                    <img className ="pandaCheer" src="./images/pandaCheer.gif" alt="panda cheering" />
                </div>
                <img className="hangul" src="./images/hangulChart.png" alt="Korean Alphabet" />

                <section className="tipsSection">
                    <h1 className="tips_header">~Study Efficiently~</h1>
                    <img className="pandaStudy" src="./images/pandaStudy.jpg" alt="panda studying" />
                    <p className="tipsParagraph">"Learning another language is not only learning different words for the same things, but learning another way to think about things.
                        <br/>Language is the road map of a culture. It tells you where its people come from and where they are going."
                        <br/>
                        ~Flora Lewis.</p>
                    <div className="row">
                        <div className="tip-col">
                            <h3 className="col-title">How to read hanguel: (한글)</h3>
                            <p className="rowParagraph">Understanding the structure and history behind the language can help temper your instinct to find English equivalents for each word
                                by recognizing syllables much like we recognize letters of the alphabet.<br/> Start with the consonants and work your way through the vowels from there.
                            </p>
                        </div>
                        <div className="tip-col">
                            <h3 className="col-title">Learn common words/phrases:</h3>
                            <p className="rowParagraph">Recognize ten simple words written in hangeul and memorize five to ten of the most common phrases, written and spoken (e.g., hello, goodbye, thank you, nice to meet you, and how much is it).
                                <br/>Then, you can increase learning more vocabulary based on your progress and comfort level.
                            </p>
                        </div>
                        <div className="tip-col">
                            <h3 className="col-title">Understand grammar basics:</h3>
                            <p className="rowParagraph">Comprehending how a sentence is constructed helps you create and dissect new phrases, as well as easily categorize new vocabulary.
                                <br/>Study the three conjugation forms for verbs (e.g., past, present, future) and basic word order for sentences.
                            </p>
                        </div>
                    </div>
                </section>

                <section className="tipsSection">
                    <h1 className="tips_header">~Language/Culture Advices~</h1>
                    <img className="pandaHappy" src="./images/pandaHappy.jpg" alt="panda happy" />
                    <p className="tipsParagraph">Flashcards can be beneficial tools in studying Korean and augmenting your language learning journey, just like Panda-Aja!</p>
                    <div className="row">
                        <div className="tip-col">
                            <h3 className="col-title">Know your disposition in the hierarchy:</h3>
                            <p className="rowParagraph">This means learning which type of language to use in conversation (both formal and informal) depending on
                                whether you are speaking to someone younger, of the same age, or older.
                            </p>
                        </div>
                        <div className="tip-col">
                            <h3 className="col-title">Break down each word you learn:</h3>
                            <p className="rowParagraph">Even if it only has one syllable, check to see if a word is connected to a hanja (한자), which is a Chinese character. 
                                <br/>This would signify that it has an inherent meaning you could use to understand it in other words.
                            </p>
                        </div>
                        <div className="tip-col">
                            <h3 className="col-title">Learn hangeul by listening:</h3>
                            <p className="rowParagraph">When you are thinking about the Korean/hangeul letters in terms of the alphabet, reading will always be a practice in translation.
                                <br/>Supplementing that with hearing the individual sounds of a word/phrase and connecting them to the letter is helpful.
                            </p>
                        </div>
                    </div>
                </section>

                <iframe className="video" width="560" height="315" src="https://www.youtube.com/embed/0KnUyy6pH-U" title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" AllowFullScreen></iframe>
            </div>
          
        </div>
    )
};
