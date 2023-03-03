const fs = require('fs')
/*const recorder = require('node-record-lpcm16')
const speech = require('@google-cloud/speech')
const client = new speech.SpeechClient()

 const encoding = 'LINEAR16';
 const sampleRateHertz = 16000;
 const languageCode = 'en-US';

const request = {
  config: {
    encoding: encoding,
    sampleRateHertz: sampleRateHertz,
    languageCode: languageCode,
  },
  interimResults: false,
};

const recognizeStream = client
  .streamingRecognize(request)
  .on('error', console.error)
  .on('data', data =>
    process.stdout.write(
      data.results[0] && data.results[0].alternatives[0]
        ? `Transcription: ${data.results[0].alternatives[0].transcript}\n`
        : '\n\nReached transcription time limit, press Ctrl+C\n'
    )
  );

recorder
  .record({
    sampleRateHertz: sampleRateHertz,
    threshold: 0,
    // Other options, see https://www.npmjs.com/package/node-record-lpcm16#options
    verbose: false,
    recordProgram: 'rec', // Try also "arecord" or "sox"
    silence: '10.0',
    device: ''
  })
  .stream()
  .on('error', console.error)
  .pipe(recognizeStream);

console.log('Listening, press Ctrl+C to stop.');*/

var state = {}

if (fs.existsSync(__dirname + '/state.json')) {
  state = JSON.parse(fs.readFileSync(__dirname + "/state.json"))
}

module.exports = nodecg => {
  function sendDataUpdate(ignoreId) {
    state.socketId = ignoreId
    nodecg.sendMessage('StateUpdate', state)
    delete state.socketId
  }
  nodecg.listenFor('StateRequest', (id) => {
    sendDataUpdate(id)
  });
  nodecg.listenFor('UpdateStateData', (value) => {
    for (key in value) {
      state[key] = value[key]
    }
    sendDataUpdate(state.socketId)
    delete state.socketId
    const jsonString = JSON.stringify(state)
    fs.writeFile(__dirname + '/state.json', jsonString, err => {
      if (err) {
        console.log('Error writing file', err)
      } else {
      }
    })
  })
};