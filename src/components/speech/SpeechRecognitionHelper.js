

export const createRecognitionEvent = (languageCountryCode) => {
    let grammar = "#JSGF V1.0; grammar colors; public <color> = aqua | azure | beige | bisque | black | blue | brown | chocolate | coral | crimson | cyan | fuchsia | ghostwhite | gold | goldenrod | gray | green | indigo | ivory | khaki | lavender | lime | linen | magenta | maroon | moccasin | navy | olive | orange | orchid | peru | pink | plum | purple | red | salmon | sienna | silver | snow | tan | teal | thistle | tomato | turquoise | violet | white | yellow ;";
    // let recognitionEvent = new webkitSpeechRecognition(); 
    // let speechRecognitionGrammarList = new webkitSpeechGrammarList();
    // let recognitionEvent = new window.SpeechRecognition(); 
    // let speechRecognitionGrammarList = new window.SpeechGrammarList();

    let SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    let SpeechGrammarList = window.SpeechGrammarList || window.webkitSpeechGrammarList;

    // const SpeechRecognition2 = SpeechRecognition || window.webkitSpeechRecognition;
    // const SpeechGrammarList2 = SpeechGrammarList || window.webkitSpeechGrammarList;
    let recognitionEvent = new SpeechRecognition(); //define a speech recognition instance to control the recognition for the app using the SpeechRecognition() constructor.
    let speechRecognitionGrammarList = new SpeechGrammarList(); //create a new speech grammar list to contain the grammar, using the SpeechGrammarList() constructor.
    //Add grammar to the list using the SpeechGrammarList.addFromString() method. This accepts as parameters the string we want to add, plus
    // optionally a weight value that specifies the importance of this grammar in relation of other grammars available in the list 
    //(can be from 0 to 1 inclusive.) The added grammar is available in the list as a SpeechGrammar object instance.
    speechRecognitionGrammarList.addFromString(grammar, 1);
    recognitionEvent.grammars = speechRecognitionGrammarList; //Returns and sets a collection of SpeechGrammar objects that represent the grammars that will be understood by the current SpeechRecognition
    recognitionEvent.continuous = false; //Controls whether continuous results are returned for each recognition, or only a single result. Defaults to single (false.)
    recognitionEvent.lang = languageCountryCode; //Returns and sets the language of the current SpeechRecognition. If not specified, this defaults to the HTML lang attribute value, or the user agent's language setting if that isn't set either.
    recognitionEvent.interimResults = false; //Controls whether interim results should be returned (true) or not (false.) Interim results are results that are not yet final (e.g. the SpeechRecognitionResult.isFinal property is false.)
    recognitionEvent.maxAlternatives = 1; //Sets the maximum number of SpeechRecognitionAlternatives provided per result. The default value is 1.
    return recognitionEvent;
}