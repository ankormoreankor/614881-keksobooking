'use strict';

var ADS_COUNT = 8;
var LOWEST_PRICE = 1000;
var HIGHEST_PRICE = 1000000;
var ROOMS_MIN = 1;
var ROOMS_MAX = 5;
var MAP_WIDTH = 980;
var MAP_HEIGHT = 750;
var MAP_INDENT = 130;
var AVATAR_PATH = 'img/avatars/user0';
var AVATAR_EXTENTION = '.png';
var POINTER_ARROW_HEIGHT = 22;
var ESC_KEYCODE = 27;

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

var getRandomValue = function (arr) {
  return Math.round(Math.random() * (arr.length - 1));
};

var getRandomFromTwo = function (min, max) {
  return Math.round(min + Math.random() * (max - min));
};

var getRandomArrItem = function (arr) {
  arr = arr.splice(getRandomValue(arr), 1);
  return arr[0];
};

var createRandomArr = function (array) {
  var transitArr = array.slice(0, array.length);
  var newArr = [];

  for (var i = 0; i < getRandomValue(transitArr); i++) {
    newArr = newArr.concat(getRandomArrItem(transitArr));
  }

  return newArr;
};

var mixArr = function (array) {
  var transitArr = array.slice(0, array.length);
  var newArr = [];

  for (var i = 0; i < array.length; i++) {
    newArr[i] = getRandomArrItem(transitArr);
  }

  return newArr;
};

var compareAndReturn = function (comparedArr, condition, returnedArr) {

  for (var i = 0; i < comparedArr.length; i++) {
    if (comparedArr[i] === condition) {
      break;
    }
  }

  return returnedArr[i];
};

var createChild = function (tag, attribute, value) {
  var newElem = document.createElement(tag);

  newElem.setAttribute(attribute, value);

  return newElem;
};

var addElem = function (parent, child) {
  return parent.appendChild(child);
};

var insertText = function (selector, content, parentBlock) {
  var elem = parentBlock.querySelector(selector);
  elem.textContent = content;

  return elem;
};

var deleteChilds = function (selector, parentBlock) {
  var childs = parentBlock.querySelectorAll(selector);

  for (var i = 0; i < childs.length; i++) {
    parentBlock.removeChild(childs[i]);
  }

  return parentBlock;
};

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
    fragment.appendChild(createChild('li', 'class', 'popup__feature' + ' ' + 'popup__feature--' + featuresList[i]));
  }

  return parentBlock.appendChild(fragment);
};

var createSimilarAd = function (avatarNumber) {
  var location = {
    x: getRandomFromTwo(MAP_INDENT, MAP_WIDTH - MAP_INDENT),
    y: getRandomFromTwo(MAP_INDENT, MAP_HEIGHT - MAP_INDENT)
  };

  return {
    author: {
      avatar: AVATAR_PATH + avatarNumber + AVATAR_EXTENTION,
    },

    offer: {
      title: advertismentTitles[getRandomValue(advertismentTitles)],
      address: location.x + ' ' + location.y,
      price: getRandomFromTwo(LOWEST_PRICE, HIGHEST_PRICE),
      type: houseTypes[getRandomValue(houseTypes)],
      rooms: getRandomFromTwo(ROOMS_MIN, ROOMS_MAX),
      guests: getRandomFromTwo(ROOMS_MIN, ROOMS_MAX),
      checkin: checkinCheckout[getRandomValue(checkinCheckout)],
      checkout: checkinCheckout[getRandomValue(checkinCheckout)],
      features: createRandomArr(houseFeatures),
      description: '',
      photos: mixArr(housePhotos)
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


  insertText('.popup__title', addsOffer.title, popupCard);
  insertText('.popup__text--address', addsOffer.adress, popupCard);
  insertText('.popup__text--price', addsOffer.price + '₽/ночь', popupCard);
  insertText('.popup__type', compareAndReturn(houseTypes, addsOffer.type, houseTypesRus), popupCard);
  insertText('.popup__text--capacity', addsOffer.rooms + ' комнаты для ' + addsOffer.guests + ' гостей', popupCard);
  insertText('.popup__text--time', 'Заезд после ' + addsOffer.checkin + ', выезд до ' + addsOffer.checkout, popupCard);
  insertText('.popup__description', addsOffer.description, popupCard);

  var popupFeatures = popupCard.querySelector('.popup__features');
  appendFeatures(deleteChilds('.popup__feature', popupFeatures), addsOffer.features);

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

var mapBlock = document.querySelector('.map');
var mapPinsBlock = document.querySelector('.map__pins');

// MODULE4-TASK1

var convertToArr = function (someValue) {
  var someArray = [];
  someArray = someArray.concat(someValue);

  return someArray;
};

var disableElem = function (nodeOrNodeList) {
  convertToArr(nodeOrNodeList);

  nodeOrNodeList.forEach(function (node) {
    node.setAttribute('disabled', '');
  });

  return;
};

var activateElem = function (nodeOrNodeList) {
  convertToArr(nodeOrNodeList);

  nodeOrNodeList.forEach(function (node) {
    node.removeAttribute('disabled', '');
  });

  return;
};

var activateMap = function (condition) {
  if (condition === true) {
    mapBlock.classList.remove('map--faded');
    activateElem(fieldsets);
    notice.querySelector('.ad-form').classList.remove('ad-form--disabled');
  } else {
    mapBlock.classList.add('map--faded');
    disableElem(fieldsets);
    notice.querySelector('.ad-form').classList.add('ad-form--disabled');
  }
};

var getElemCoordinate = function (elem) {
  return {
    left: parseInt(getComputedStyle(elem).left, 10),
    top: parseInt(getComputedStyle(elem).top, 10)
  };
};

var getElemSize = function (elem) {
  return {
    width: parseInt(getComputedStyle(elem).width, 10),
    height: parseInt(getComputedStyle(elem).height, 10)
  };
};

var getElemCenter = function (elem) {
  return {
    x: Math.ceil(getElemSize(elem).width / 2),
    y: Math.ceil(getElemSize(elem).height / 2)
  };
};

var getPointerCoordinate = function (elem, isMapActive) {
  return isMapActive === true ?
    {
      left: getElemCoordinate(elem).left + getElemCenter(elem).x,
      top: getElemCoordinate(elem).top + getElemSize(elem).height + POINTER_ARROW_HEIGHT
    } : {
      left: getElemCoordinate(elem).left + getElemCenter(elem).x,
      top: getElemCoordinate(elem).top + getElemCenter(elem).y
    };
};

var setAddress = function (elem, isMapActive) {
  var address = document.querySelector('#address');

  return address.setAttribute('value',
      getPointerCoordinate(elem, isMapActive).left + ', ' +
    getPointerCoordinate(elem, isMapActive).top);
};

var notice = document.querySelector('.notice');
var fieldsets = notice.querySelectorAll('fieldset');
var mapPinMain = mapPinsBlock.querySelector('.map__pin--main');
var roomsField = notice.querySelector('#room_number');
var capacityField = notice.querySelector('#capacity');
var formSubmitButton = notice.querySelector('.ad-form__submit');

disableElem(fieldsets);
setAddress(mapPinMain, false);

var onPointerMove = function () {
  activateMap(true);
  setAddress(mapPinMain, true);
  addElem(deleteChilds('button[type=button]', mapPinsBlock), createPins(advertisements));
};

var onPinClick = function (evt) {
  var coordinates = {};

  if (evt.target.parentNode.hasAttribute('style')) {
    coordinates = getElemCoordinate(evt.target.parentNode);
  } else if (evt.target.hasAttribute('style')) {
    coordinates = getElemCoordinate(evt.target);
  }

  return coordinates;
};

var onPopupEscPress = function (evt) {
  if (evt.keyCode === ESC_KEYCODE) {
    closeMapPopup();
  }
};

var closeMapPopup = function () {
  deleteChilds('.map__card', mapBlock);
  document.removeEventListener('keydown', onPopupEscPress);
};

var createCurrentPopup = function (evt) {
  deleteChilds('.map__card', mapBlock);

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

mapPinMain.addEventListener('mouseup', onPointerMove);

mapPinsBlock.addEventListener('click', createCurrentPopup);

formSubmitButton.addEventListener('click', function () {
  onSubmitValidateGuest();
});
