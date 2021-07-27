
export const speak = (phrase, language, speechSpeed = 0.8, volume = "") => {
    // code below instantiates the SpeechSynthesisUtterance() class from the webSpeech API with use of new keyword
    // and assign it to a variable (speech) so that the language can be changed, speed and volume of the utterance
    let speech = new SpeechSynthesisUtterance(phrase);
    speech.lang = language;
    speech.rate = speechSpeed;
    console.log('its speaking', speech);
    //  The code below accesses the speak function of the speechSynthesis class of the window class and passes the utterance/speech variable
    // as a parameter which allows the app to speak whatever the phrase was in new SpeechSynthesisUtterance(phrase)
    window.speechSynthesis.speak(speech);
};