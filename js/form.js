'use strict';

(function () {
  var notice = document.querySelector('.notice');
  var fieldsets = notice.querySelectorAll('fieldset');
  var filters = document.querySelectorAll('.map__filter');
  var filterFeatures = document.querySelectorAll('.map__features');
  var roomsField = notice.querySelector('#room_number');
  var capacityField = notice.querySelector('#capacity');
  var form = notice.querySelector('.ad-form');
  var formSubmitButton = notice.querySelector('.ad-form__submit');

  window.util.disableElem(fieldsets);
  window.util.disableElem(filters);
  window.util.disableElem(filterFeatures);

  var validateGuest = function () {
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
    validateGuest();
  });

  form.addEventListener('submit', function (evt) {
    window.backend.post(new FormData(form), window.form.onSubmit, window.form.onError);
    evt.preventDefault();
  });

  window.form = {
    activate: function () {
      window.util.activateElem(fieldsets);
      window.util.activateElem(filters);
      window.util.activateElem(filterFeatures);
      form.classList.remove('ad-form--disabled');
    },
    deactivate: function () {
      window.util.disableElem(fieldsets);
      window.util.disableElem(filters);
      window.util.disableElem(filterFeatures);
      form.classList.add('ad-form--disabled');
    },
    onError: function (errorMessage) {
      var errorTemplate = document.querySelector('#error').content.querySelector('.error');
      var error = errorTemplate.cloneNode(true);

      error.querySelector('.error__message').textContent = errorMessage;

      document.body.insertAdjacentElement('afterbegin', error);
    },
    onSuccess: function () {
      var successTemplate = document.querySelector('#success').content.querySelector('.success');
      var success = successTemplate.cloneNode(true);

      document.body.insertAdjacentElement('afterbegin', success);
    },
    onSubmit: function () {
      window.map.deactivateMap();
    }
  };
})();
