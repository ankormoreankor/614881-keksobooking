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

  window.form = {
    activateForm: function (condition) {
      if (condition === true) {
        window.util.activateElem(fieldsets);
        notice.querySelector('.ad-form').classList.remove('ad-form--disabled');
      } else {
        window.util.disableElem(fieldsets);
        notice.querySelector('.ad-form').classList.add('ad-form--disabled');
      }
    }
  };
})();
