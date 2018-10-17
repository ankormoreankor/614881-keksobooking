'use strict';

(function () {
  var MAX_PRICE = 1000000;
  var MAX_ROOMS = 100;

  var main = document.querySelector('main');
  var notice = document.querySelector('.notice');
  var mainForm = notice.querySelector('.ad-form');
  var filterForm = document.querySelector('.map__filters');
  var formSubmitButton = notice.querySelector('.ad-form__submit');
  var formResetButton = notice.querySelector('.ad-form__reset');
  var fieldsets = notice.querySelectorAll('fieldset');
  var filters = document.querySelectorAll('.map__filter');
  var filterFeatures = document.querySelectorAll('.map__features');
  var roomsField = notice.querySelector('#room_number');
  var capacityField = notice.querySelector('#capacity');
  var houseTypes = notice.querySelector('#type');
  var price = notice.querySelector('#price');
  var timein = notice.querySelector('#timein');
  var timeout = notice.querySelector('#timeout');

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
    } else if (value < price.min) {
      price.setCustomValidity('Цена должна быть не менее ' + price.min);
    } else {
      price.setCustomValidity('');
    }
  };

  var onHouseTypeChange = function () {
    var type = houseTypes.value;

    for (var i = 0; i < window.util.houseTypes.length; i++) {
      if (type === window.util.houseTypes[i].type) {
        price.min = window.util.houseTypes[i].minPrice;
        price.placeholder = window.util.houseTypes[i].minPrice;
        return;
      }
    }
  };

  var onSubmitValidate = function () {
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

  var clearInput = function (input) {
    if (!input.hasAttribute('readonly')) {
      input.value = '';
      input.checked = false;
    }
  };

  var resetSelect = function (select) {
    var childs = select.childNodes;

    for (var i = 0; i < childs.length; i++) {
      if (childs[i].nodeName !== '#text' && childs[i].hasAttribute('selected')) {
        select.value = childs[i].value;
        return;
      }
    }
  };

  var resetForm = function (form) {
    var elems = form.childNodes;

    var fields = [].filter.call(elems, function (elem) {
      return elem.nodeName !== '#text';
    }).map(function (field) {
      return field;
    });

    for (var i = 0; i < fields.length; i++) {
      if (fields[i].tagName === 'SELECT') {
        resetSelect(fields[i]);
      } else if (fields[i].tagName === 'INPUT') {
        clearInput(fields[i]);
      }

      if (fields[i].hasChildNodes) {
        resetForm(fields[i]);
      }
    }
  };

  var validateTiming = function (evt) {
    if (evt.target === timein) {
      timeout.value = timein.value;
    } else if (evt.target === timeout) {
      timein.value = timeout.value;
    }
  };

  mainForm.addEventListener('submit', function (evt) {
    window.backend.post(new FormData(mainForm), window.form.onSubmit, window.form.onError);
    evt.preventDefault();
  });

  window.form = {
    activate: function () {
      window.util.activateElem(fieldsets);
      window.util.activateElem(filters);
      window.util.activateElem(filterFeatures);
      mainForm.classList.remove('ad-form--disabled');

      document.removeEventListener('DOMContentLoaded', window.form.deactivate);
      houseTypes.addEventListener('change', onHouseTypeChange);
      timein.addEventListener('change', validateTiming);
      timeout.addEventListener('change', validateTiming);
      formSubmitButton.addEventListener('click', onSubmitValidate);
      formResetButton.addEventListener('click', window.form.onReset);
    },
    deactivate: function () {
      window.util.disableElem(fieldsets);
      window.util.disableElem(filters);
      window.util.disableElem(filterFeatures);
      mainForm.classList.add('ad-form--disabled');

      houseTypes.removeEventListener('change', onHouseTypeChange);
      timein.removeEventListener('change', validateTiming);
      timeout.removeEventListener('change', validateTiming);
      formSubmitButton.removeEventListener('click', onSubmitValidate);
      formResetButton.removeEventListener('click', window.form.onReset);
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
      resetForm(mainForm);
      resetForm(filterForm);
      window.map.deactivate();
      window.form.deactivate();
    },
    onReset: function () {
      resetForm(mainForm);
      resetForm(filterForm);
      window.map.deactivate();
      window.form.deactivate();
    }
  };

  document.addEventListener('DOMContentLoaded', window.form.deactivate);
})();
