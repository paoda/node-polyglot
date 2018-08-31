const Trans = require('@google-cloud/translate');

class Translate {
  /** @param {string} id - ID of Project for Google Translate */
  constructor(id) {
    this.id = id;
    this.client = new Trans({
      projectId: id
    })
  }

  /**
   * As in Translate.speech()
   * @param {string} text - Text to Translate
   * @param {string} lang - Target Language
   * @returns {Promise<Array<String>|Error>}
   * @async
   */
  async speech(text, lang) {
    return new Promise((res, rej) => {
      this.client.translate(text, lang).then(results => {
        res(results[0]); // Translation

      }).catch(err => rej(err));
    });
  }
}

module.exports = Translate;