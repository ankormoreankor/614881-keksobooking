'use strict';

(function () {
  var notice = document.querySelector('.notice');
  var fieldsets = notice.querySelectorAll('fieldset');
  var roomsField = notice.querySelector('#room_number');
  var capacityField = notice.querySelector('#capacity');
  var formSubmitButton = notice.querySelector('.ad-form__submit');

  window.util.disableElem(fieldsets);

  var onSubmitValidateGuest = function () {
    var rooms = parseInt(roomsField.value, 10);
    var guests = parseInt(capacityField.value, 10);

    if (guests > rooms && guests > 0) {
      capacityField.setCustomValidity('Должно быть не более ' + roomsField.value + ' гостей');
    } else if (rooms < 100 && guests === 0) {
      capacityField.setCustomValidity('Должно быть не менее 1 гостя');
    } else {
      capacityField.setCustomValidity('');
    }

    if (rooms === 100 && guests !== 0) {
      roomsField.setCustomValidity('Такое количество комнат не для гостей');
    } else {
      roomsField.setCustomValidity('');
    }
  };

  formSubmitButton.addEventListener('click', function () {
    onSubmitValidateGuest();
  });

  var onFormSubmit = function () {
    window.map.activateMap(false);
  };

  notice.addEventListener('submit', function (evt) {
    window.backend.post(new FormData(notice), onFormSubmit, window.form.onDataError);
    evt.preventDefault();
  });

  window.form = {
    activateForm: function (condition) {
      if (condition === true) {
        window.util.activateElem(fieldsets);
        notice.querySelector('.ad-form').classList.remove('ad-form--disabled');
      } else {
        window.util.disableElem(fieldsets);
        notice.querySelector('.ad-form').classList.add('ad-form--disabled');
      }
    },
    onDataError: function (errorMessage) {
      var errorTemplate = document.querySelector('#error').content.querySelector('.error');
      var error = errorTemplate.cloneNode(true);

      error.querySelector('.error__message').textContent = errorMessage;

      document.body.insertAdjacentElement('afterbegin', error);
    },
    onFormSuccess: function () {
      var successTemplate = document.querySelector('#success').content.querySelector('.success');
      var success = successTemplate.cloneNode(true);

      document.body.insertAdjacentElement('afterbegin', success);
    }
  };
})();
