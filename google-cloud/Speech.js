const speech = require("@google-cloud/speech");
const Translate = require('./Translate');
const translate = new Translate('node-polyglot');

/**
 * Class Responsible for dealing with Google's Speech Recognition API
 */
class Speech {
  constructor() {
    /** @type {speech.SpeechClient} */
    this.client = new speech.SpeechClient();
    /** @type {Stream} */
    this.recognize = null;
    /** @type {boolean} */
    this.enabled = false;
  }

  /**
   * Getter for the Google API Stream we can write to.
   * @returns {Stream}  - this.recognize
   */
  getStream() {
    return this.recognize;
  }

  /**
   * Stops the GoogleAPI Stream.
   */
  stopRecognition() {
    if (this.recognize) this.recognize.end();
    this.recognize = null;
    this.enabled = false;
  }

  /**
   * Starts the Google API Stream
   * @param {string} lang - Language Code e.g en-CA
   */
  startRecognition(lang) {
    this.lang = lang;
    this.enabled = true;

    const request = {
      config: {
        encoding: "LINEAR16",
        sampleRateHertz: 16000,
        languageCode: lang,
        profanityFilter: false,
        enableWordTimeOffsets: true
      },
      interimResults: true // If you want interim results, set this to true
    };

    this.recognize = this.client
      .streamingRecognize(request)
      .on("error", console.error)
      .on("data", data => {
        process.stdout.write(
          data.results[0] && data.results[0].alternatives[0]
            ? `Transcription: ${data.results[0].alternatives[0].transcript}\n`
            : `\n\nReached transcription time limit, press Ctrl+C\n`
        );
        //client.emit("speechData", data);

        if (data.results[0].alternatives[0] !== undefined) {
          let text = data.results[0].alternatives[0].transcript;

          translate.speech(text, "fr").then(translation => {
            console.log("Translation: " + translation);

          }).catch(err => console.error(err));

          // translate
          //   .translate(text, target)
          //   .then(results => {
          //     const translation = results[0];
          //     //client.emit("translateData", translation);

          //     console.log(`Text: ${text}`);
          //     console.log(`Translation: ${translation}`);
          //   })
          //   .catch(err => {
          //     console.error("ERROR:", err);
          //   });
        }

        // if end of utterance, let's restart stream
        // this is a small hack. After 65 seconds of silence, the stream will still throw an error for speech length limit
        if (data.results[0] && data.results[0].isFinal) {
          this.stopRecognition();
          this.startRecognition(this.lang);
          // console.log('restarted stream serverside');
        }
      });
  }
}

module.exports = Speech;
