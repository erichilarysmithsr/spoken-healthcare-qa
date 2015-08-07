/**
 * Copyright 2014 IBM Corp. All Rights Reserved.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/* global $, SpeechRecognizer, search, setButtonState */
'use strict';

function Speech() {
  this.audio = $('<audio controls autoplay></audio>');
  $('#audio').append(this.audio);

  this.recognizer = new SpeechRecognizer({ws: '', model: 'WatsonModel' });
}

Speech.prototype.speak = function(message) {
  this.recognizeAbort();
  setButtonState('default');

  this.audio.attr('src', '/synthesize?text=' + message);
  this.audio.get(0).play();
};

Speech.prototype.stop = function() {
  this.audio.get(0).pause();
};

Speech.prototype.onstart = function() {
  console.log('speech.recognizer.onstart');
};

Speech.prototype.onerror = function(error) {
  console.log('speech.recognizer.onerror:', error);
};

Speech.prototype.onresult = function(data) {
  var result = data.results[data.results.length - 1];
  var transcript = result.alternatives[0].transcript;

  search(transcript, result.final);

  if (result.final) {
    this.stop();
  }
};

Speech.prototype.recognize = function() {
  this.stop();
  this.recognizer.start();
};

Speech.prototype.recognizeAbort = function() {
  this.recognizer.stop();
};