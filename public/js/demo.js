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
/* global $, Speech*/

'use strict';

var searchTimeout = 0;
var speech = new Speech();

function loadQuery(query) {
  $('#questionText').val(query);
}

// fill and submit the form with a random example
function search(query, submit) {
  loadQuery(query);

  if (submit) {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(function() {

      $('#qaForm').submit();
    }, 100);
  }
}

function speakContent(id) {
  // IE and Safari not supported disabled Mic button
  if ($('body').hasClass('ie') || $('body').hasClass('safari')) {
    $('.play').prop('disabled', true);
    $('.ie-speak .arrow-box').show();
    return;
  } else {
    $('.ie-speak .arrow-box').hide();
  }

  $('.play').removeClass('playing');
  $('#' + id).addClass('playing');

  var element = $('#response' + id);
  var text = element.html();
  speech.speak(text);
}

$('#qaForm').submit(function() {
  var form = $(this);
  $.ajax({
    url: form.attr('action'),
    type: form.attr('method'),
    data: form.serialize(),
    success: function(response) {
      $('#result').html(response);

      $('#result').find('.play').click(function(event) {
        var target = $(event.target);
        if (target.hasClass('playing')) {
          target.removeClass('playing');
          speech.stop();
          //remove button styles in the demo
          $('.playAnswer').removeClass('playing');
        } else {
          speakContent(event.target.getAttribute('id'));
        }
      });
    }
  });
  return false;
});

$('#listen').click(function() {
  switch (speechState) {
    case 'listening':
      speech.recognizeAbort();
      setButtonState('default');
      break;
    case 'speaking':
      speech.stop();
      //remove button styles in the demo
      $('.playAnswer').removeClass('playing');
      $('.play').removeClass('playing');
      setButtonState('default');
      break;
    default:
      speech.recognize();
      setButtonState('listening');
      $('#listen').blur();
      break;
  }

  return false;
});

var speechState = '';

function setButtonState(state) {
  var button = $('#listen');
  speechState = state;

  button.removeClass('listen').removeClass('stop').removeClass('playing');

  switch (state) {
    case 'listening':
      button.addClass('stop');
      break;
    case 'speaking':
      button.addClass('playing');
      break;
    default:
      button.addClass('listen');
      break;
  }
}

$(document).ready(function() {
  // IE and Safari not supported disabled Mic button
  if ($('body').hasClass('ie') || $('body').hasClass('safari')) {
    $('#listen').prop('disabled', true);
    $('.ie-speak .arrow-box').show();
  } else {
    $('.ie-speak .arrow-box').hide();
  }
});