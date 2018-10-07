'use strict';

var ADS_COUNT = 8;
var LOWEST_PRICE = 1000;
var HIGHEST_PRICE = 1000000;
var ROOMS_MIN = 1;
var ROOMS_MAX = 5;
var MAP_MAX_TOP = 630;
var MAP_MIN_TOP = 130;
var MAP_MIN_LEFT = 0;
var MAP_RIGHT_INDENT = 40;
var AVATAR_PATH = 'img/avatars/user0';
var AVATAR_EXTENTION = '.png';
var POINTER_ARROW_HEIGHT = 22;

var advertismentTitles = [
  'Большая уютная квартира',
  'Маленькая неуютная квартира',
  'Огромный прекрасный дворец',
  'Маленький ужасный дворец',
  'Красивый гостевой домик',
  'Некрасивый негостеприимный домик',
  'Уютное бунгало далеко от моря',
  'Неуютное бунгало по колено в воде'
];

var houseTypes = [
  'palace',
  'flat',
  'house',
  'bungalo'
];

var checkinCheckout = [
  '12:00',
  '13:00',
  '14:00'
];

var houseFeatures = [
  'wifi',
  'dishwasher',
  'parking',
  'washer',
  'elevator',
  'conditioner'
];

var housePhotos = [
  'http://o0.github.io/assets/images/tokyo/hotel1.jpg',
  'http://o0.github.io/assets/images/tokyo/hotel2.jpg',
  'http://o0.github.io/assets/images/tokyo/hotel3.jpg'
];

var houseTypesRus = [
  'Дворец',
  'Квартира',
  'Дом',
  'Бунгало'
];

var mapBlock = document.querySelector('.map');
var mapWidth = mapBlock.offsetWidth;

var appendPhotos = function (parentBlock, photosArray, selector) {
  var fragment = document.createDocumentFragment();
  parentBlock.children[0].src = photosArray[0];

  for (var i = 1; i < photosArray.length; i++) {
    var img = parentBlock.querySelector(selector).cloneNode(true);
    img.src = photosArray[i];

    fragment.appendChild(img);
  }

  return parentBlock.appendChild(fragment);
};

var appendFeatures = function (parentBlock, featuresList) {
  var fragment = document.createDocumentFragment();

  for (var i = 0; i < featuresList.length; i++) {
    fragment.appendChild(window.util.createChild('li', 'class', 'popup__feature' + ' ' + 'popup__feature--' + featuresList[i]));
  }

  return parentBlock.appendChild(fragment);
};

var createSimilarAd = function (avatarNumber) {
  var location = {
    x: window.util.getRandomFromTwo(MAP_MIN_LEFT, mapWidth - MAP_RIGHT_INDENT),
    y: window.util.getRandomFromTwo(MAP_MIN_TOP, MAP_MAX_TOP)
  };

  return {
    author: {
      avatar: AVATAR_PATH + avatarNumber + AVATAR_EXTENTION,
    },

    offer: {
      title: advertismentTitles[window.util.getRandomValue(advertismentTitles)],
      address: location.x + ' ' + location.y,
      price: window.util.getRandomFromTwo(LOWEST_PRICE, HIGHEST_PRICE),
      type: houseTypes[window.util.getRandomValue(houseTypes)],
      rooms: window.util.getRandomFromTwo(ROOMS_MIN, ROOMS_MAX),
      guests: window.util.getRandomFromTwo(ROOMS_MIN, ROOMS_MAX),
      checkin: checkinCheckout[window.util.getRandomValue(checkinCheckout)],
      checkout: checkinCheckout[window.util.getRandomValue(checkinCheckout)],
      features: window.util.createRandomArr(houseFeatures),
      description: '',
      photos: window.util.mixArr(housePhotos)
    },

    location: {
      x: location.x,
      y: location.y
    }
  };
};

var createPins = function (pinsArray) {
  var fragment = document.createDocumentFragment();
  var pinTemplate = document.querySelector('#pin').content.querySelector('.map__pin');

  for (var i = 0; i < pinsArray.length; i++) {
    var pin = pinTemplate.cloneNode(true);
    pin.style.left = pinsArray[i].location.x + 'px';
    pin.style.top = pinsArray[i].location.y + 'px';
    pin.children[0].src = pinsArray[i].author.avatar;
    pin.children[0].alt = pinsArray[i].offer.title;

    fragment.appendChild(pin);
  }

  return fragment;
};

var createPopup = function (landlordNumber) {
  var mapFiltersContainer = document.querySelector('.map__filters-container');
  var cardTemplate = document.querySelector('#card').content.querySelector('.map__card');
  var popupCard = cardTemplate.cloneNode(true);
  var addsOffer = advertisements[landlordNumber].offer;


  window.util.insertText('.popup__title', addsOffer.title, popupCard);
  window.util.insertText('.popup__text--address', addsOffer.adress, popupCard);
  window.util.insertText('.popup__text--price', addsOffer.price + '₽/ночь', popupCard);
  window.util.insertText('.popup__type', window.util.compareAndReturn(houseTypes, addsOffer.type, houseTypesRus), popupCard);
  window.util.insertText('.popup__text--capacity', addsOffer.rooms + ' комнаты для ' + addsOffer.guests + ' гостей', popupCard);
  window.util.insertText('.popup__text--time', 'Заезд после ' + addsOffer.checkin + ', выезд до ' + addsOffer.checkout, popupCard);
  window.util.insertText('.popup__description', addsOffer.description, popupCard);

  var popupFeatures = popupCard.querySelector('.popup__features');
  appendFeatures(window.util.deleteChilds('.popup__feature', popupFeatures), addsOffer.features);

  var popupPhotos = popupCard.querySelector('.popup__photos');
  appendPhotos(popupPhotos, addsOffer.photos, '.popup__photo');

  popupCard.querySelector('.popup__avatar').src = advertisements[landlordNumber].author.avatar;

  return mapBlock.insertBefore(popupCard, mapFiltersContainer);
};

// НАЧАЛО ПРОГРАММЫ

var advertisements = [];

var createAdsArr = function (adsCount) {
  for (var i = 1; i <= adsCount; i++) {
    advertisements = advertisements.concat(createSimilarAd(i));
  }
};

createAdsArr(ADS_COUNT);

var mapPinsBlock = document.querySelector('.map__pins');

// MODULE4-TASK1

var activateMap = function (condition) {
  if (condition === true) {
    mapBlock.classList.remove('map--faded');
  } else {
    mapBlock.classList.add('map--faded');
  }
};

var activateForm = function (condition) {
  if (condition === true) {
    window.util.activateElem(fieldsets);
    notice.querySelector('.ad-form').classList.remove('ad-form--disabled');
  } else {
    window.util.disableElem(fieldsets);
    notice.querySelector('.ad-form').classList.add('ad-form--disabled');
  }
};

var getPointerCoordinate = function (isMapActive) {
  return isMapActive === true ?
    {
      left: window.util.getElemCoordinate(Pointer).left + window.util.getElemCenter(Pointer).x,
      top: window.util.getElemCoordinate(Pointer).top + Pointer.offsetHeight + POINTER_ARROW_HEIGHT
    } : {
      left: window.util.getElemCoordinate(Pointer).left + window.util.getElemCenter(Pointer).x,
      top: window.util.getElemCoordinate(Pointer).top + window.util.getElemCenter(Pointer).y
    };
};

var setAddress = function (isMapActive) {
  var address = document.querySelector('#address');

  return address.setAttribute('value',
      getPointerCoordinate(isMapActive).left + ', ' +
    getPointerCoordinate(isMapActive).top);
};

var notice = document.querySelector('.notice');
var fieldsets = notice.querySelectorAll('fieldset');
var Pointer = mapPinsBlock.querySelector('.map__pin--main');
var roomsField = notice.querySelector('#room_number');
var capacityField = notice.querySelector('#capacity');
var formSubmitButton = notice.querySelector('.ad-form__submit');

window.util.disableElem(fieldsets);
setAddress(false);

var onPinClick = function (evt) {
  var coordinates = {};

  if (evt.target.parentNode.hasAttribute('style')) {
    coordinates = window.util.getElemCoordinate(evt.target.parentNode);
  } else if (evt.target.hasAttribute('style')) {
    coordinates = window.util.getElemCoordinate(evt.target);
  }

  return coordinates;
};

var onPopupEscPress = function (evt) {
  window.util.isEscEvent(evt, closeMapPopup);
};

var closeMapPopup = function () {
  window.util.deleteChilds('.map__card', mapBlock);
  document.removeEventListener('keydown', onPopupEscPress);
};

var createCurrentPopup = function (evt) {
  window.util.deleteChilds('.map__card', mapBlock);

  for (var i = 0; i < advertisements.length; i++) {
    if (onPinClick(evt).left === advertisements[i].location.x) {
      if (onPinClick(evt).top === advertisements[i].location.y) {
        createPopup(i);
      }
    }
  }

  var popupCloseButton = mapBlock.querySelector('.popup__close');

  popupCloseButton.addEventListener('click', closeMapPopup);
  document.addEventListener('keydown', onPopupEscPress);
};

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

var onPointerCatched = function (evt) {
  evt.preventDefault();

  var startPosition = {
    x: evt.clientX,
    y: evt.clientY
  };

  var onPointerMove = function (moveEvt) {
    moveEvt.preventDefault();
    activateMap(true);

    var shift = {
      x: startPosition.x - moveEvt.clientX,
      y: startPosition.y - moveEvt.clientY
    };

    startPosition = {
      x: moveEvt.clientX,
      y: moveEvt.clientY
    };

    var x = Pointer.offsetLeft;
    var y = Pointer.offsetTop;
    var w = Pointer.offsetWidth;

    var setPointerTop = function (top) {
      Pointer.style.top = top + 'px';
    };

    var setPointerLeft = function (left) {
      Pointer.style.left = left + 'px';
    };

    if (y >= MAP_MIN_TOP) {
      if (y <= MAP_MAX_TOP) {
        setPointerTop(y - shift.y);
      } else {
        setPointerTop(MAP_MAX_TOP);
      }
    } else {
      setPointerTop(MAP_MIN_TOP);
    }

    if (x >= MAP_MIN_LEFT) {
      if (x <= (mapWidth - w)) {
        setPointerLeft(x - shift.x);
      } else {
        setPointerLeft(mapWidth - w);
      }
    } else {
      setPointerLeft(MAP_MIN_LEFT);
    }

    Pointer.addEventListener('mouseup', onPointerWasMoved);

  };

  var onPointerWasMoved = function () {
    setAddress(true);
    activateForm(true);
    window.util.addElem(window.util.deleteChilds('button[type=button]', mapPinsBlock), createPins(advertisements));

    Pointer.removeEventListener('mouseleave', onPointerWasMoved);
    Pointer.removeEventListener('mousemove', onPointerMove);
    Pointer.removeEventListener('mouseup', onPointerWasMoved);
  };

  Pointer.addEventListener('mouseleave', onPointerWasMoved);
  Pointer.addEventListener('mousemove', onPointerMove);
};

Pointer.addEventListener('mousedown', onPointerCatched);

mapPinsBlock.addEventListener('click', createCurrentPopup);

formSubmitButton.addEventListener('click', function () {
  onSubmitValidateGuest();
});
