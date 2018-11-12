const Alexa = require('ask-sdk-core');

const SKILL_NAME = "お年玉ガチャ";
const FALLBACK_MESSAGE = "";
const FALLBACK_REPROMPT = "";
const ERROR_MESSAGE = "ごめんなさい。何か問題がおきました。";
const STOP_MESSAGE = "さようなら";

const data = require('./data');

const sounds = [
    "<audio src='soundbank://soundlibrary/foley/amzn_sfx_jar_on_table_1x_01'/>",
    "<audio src='soundbank://soundlibrary/foley/amzn_sfx_object_on_table_2x_01'/>"
];

const GetOtoshidamaHandler = {
    canHandle(handlerInput) {
      const request = handlerInput.requestEnvelope.request;
      return request.type === 'LaunchRequest'
        || (request.type === 'IntentRequest'
          && request.intent.name === 'GetOtoshidamaIntent');
    },
    handle(handlerInput) {
      const preSound = "<audio src='soundbank://soundlibrary/magic/amzn_sfx_fairy_melodic_chimes_01'/>";
      const randomData = data.value[Math.floor(Math.random() * data.value.length)];
      const randomSound = sounds[Math.floor(Math.random() * sounds.length)];
      const speechOutput = '<say-as interpret-as="interjection">あけましておめでとうございます。</say-as><break time="1000ms"/>あなたのお年玉は？<break time="1000ms"/>' + preSound + randomSound + randomData + 'でした。<break time="500ms"/><say-as interpret-as="interjection">いかがでしたか？</say-as>';
  
      return handlerInput.responseBuilder
        .speak(speechOutput)
        .withSimpleCard(SKILL_NAME, 'いかがでしたか？')
        .getResponse();
    },
  };
  
  const FallbackHandler = {
    canHandle(handlerInput) {
      const request = handlerInput.requestEnvelope.request;
      return request.type === 'IntentRequest'
        && request.intent.name === 'AMAZON.FallbackIntent';
    },
    handle(handlerInput) {
      return handlerInput.responseBuilder
        .speak(FALLBACK_MESSAGE)
        .reprompt(FALLBACK_REPROMPT)
        .getResponse();
    },
  };
  
  const ExitHandler = {
    canHandle(handlerInput) {
      const request = handlerInput.requestEnvelope.request;
      return request.type === 'IntentRequest'
        && (request.intent.name === 'AMAZON.CancelIntent'
          || request.intent.name === 'AMAZON.StopIntent');
    },
    handle(handlerInput) {
      return handlerInput.responseBuilder
        .speak(STOP_MESSAGE)
        .getResponse();
    },
  };
  
  const SessionEndedRequestHandler = {
    canHandle(handlerInput) {
      const request = handlerInput.requestEnvelope.request;
      return request.type === 'SessionEndedRequest';
    },
    handle(handlerInput) {
      console.log(`Session ended with reason: ${handlerInput.requestEnvelope.request.reason}`);
  
      return handlerInput.responseBuilder.getResponse();
    },
  };
  
  const ErrorHandler = {
    canHandle() {
      return true;
    },
    handle(handlerInput, error) {
      console.log(`Error handled: ${error.message}`);
  
      return handlerInput.responseBuilder
        .speak(ERROR_MESSAGE)
        .reprompt(ERROR_MESSAGE)
        .getResponse();
    },
  };
  
  const skillBuilder = Alexa.SkillBuilders.custom();
  
  exports.handler = skillBuilder
    .addRequestHandlers(
      GetOtoshidamaHandler,
      ExitHandler,
      FallbackHandler,
      SessionEndedRequestHandler
    )
    .addErrorHandlers(ErrorHandler)
    .lambda();
