'use strict';

(function () {
  var MAX_PRICE = 1000000;
  var MAX_ROOMS = 100;

  var notice = document.querySelector('.notice');
  var form = notice.querySelector('.ad-form');
  var formInputs = notice.querySelectorAll('input');
  var formSubmitButton = notice.querySelector('.ad-form__submit');
  var fieldsets = notice.querySelectorAll('fieldset');
  var filters = document.querySelectorAll('.map__filter');
  var filterFeatures = document.querySelectorAll('.map__features');
  var roomsField = notice.querySelector('#room_number');
  var capacityField = notice.querySelector('#capacity');
  var price = notice.querySelector('#price');
  var main = document.querySelector('main');

  var validateGuest = function () {
    var rooms = parseInt(roomsField.value, 10);
    var guests = parseInt(capacityField.value, 10);

    if (guests > rooms && guests > 0) {
      capacityField.setCustomValidity('Должно быть не более ' + roomsField.value + ' гостей');
    } else if (rooms < MAX_ROOMS && guests === 0) {
      capacityField.setCustomValidity('Должно быть не менее 1 гостя');
    } else {
      capacityField.setCustomValidity('');
    }

    if (rooms === MAX_ROOMS && guests !== 0) {
      roomsField.setCustomValidity('Такое количество комнат не для гостей');
    } else {
      roomsField.setCustomValidity('');
    }

  };

  var validatePrice = function () {
    var value = value = parseInt(price.value, 10);

    if (!price.value) {
      value = 0;
    }

    if (value > MAX_PRICE || value < 0) {
      price.setCustomValidity('Цена должна быть положительной и не более ' + MAX_PRICE);
    } else {
      price.setCustomValidity('');
    }
  };

  var onSabmitValidate = function () {
    validateGuest();
    validatePrice();
  };

  var closeSuccess = function () {
    var mess = document.querySelector('.success');

    main.removeChild(mess);

    document.removeEventListener('keydown', onSuccessEscPress);
    document.removeEventListener('click', onSuccessMesClick);
  };

  var closeError = function () {
    var mess = document.querySelector('.error');

    main.removeChild(mess);

    document.removeEventListener('keydown', onErrorEscPress);
    document.removeEventListener('click', onErrorMessClick);
  };

  var onSuccessMesClick = function () {
    closeSuccess();
  };

  var onSuccessEscPress = function (evt) {
    window.util.isEscEvent(evt, closeSuccess);
  };

  var onErrorMessClick = function () {
    closeError();
  };

  var onErrorEscPress = function (evt) {
    window.util.isEscEvent(evt, closeError);
  };

  var clearFields = function () {
    for (var i = 0; i < formInputs.length; i++) {
      formInputs[i].value = '';
      formInputs[i].checked = false;
    }
  };

  formSubmitButton.addEventListener('click', onSabmitValidate);

  form.addEventListener('submit', function (evt) {
    window.backend.post(new FormData(form), window.form.onSubmit, window.form.onError);
    evt.preventDefault();

    formSubmitButton.removeEventListener('click', onSabmitValidate);
  });

  window.form = {
    activate: function () {
      window.util.activateElem(fieldsets);
      window.util.activateElem(filters);
      window.util.activateElem(filterFeatures);
      form.classList.remove('ad-form--disabled');

      document.removeEventListener('DOMContentLoaded', window.form.deactivate);
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

      main.insertAdjacentElement('afterbegin', error);
      document.addEventListener('click', onErrorMessClick);
      document.addEventListener('keydown', onErrorEscPress);
    },
    onSuccess: function () {
      var successTemplate = document.querySelector('#success').content.querySelector('.success');
      var success = successTemplate.cloneNode(true);

      main.insertAdjacentElement('afterbegin', success);
      document.addEventListener('click', onSuccessMesClick);
      document.addEventListener('keydown', onSuccessEscPress);
    },
    onSubmit: function () {
      window.map.deactivate();
      window.form.deactivate();
      clearFields();
    }
  };

  document.addEventListener('DOMContentLoaded', window.form.deactivate);
})();
