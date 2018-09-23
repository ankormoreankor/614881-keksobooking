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

  return elem.textContent = content;
};

var deleteChilds = function (selector, node, parentBlock) {
  var childs = parentBlock.querySelectorAll(selector);

  for (var i = 0; i < childs.length; i++) {
    node.removeChild(node.children[0]);
  }

  return node;
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
      guests: getRandomFromTwo(1, 10),
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

var activateMap = function (condition) {
  return condition = true ?
        document.querySelector('.map').classList.remove('map--faded') :
        document.querySelector('.map').classList.add('map--faded');
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
  appendFeatures(deleteChilds('.popup__feature', popupFeatures, popupCard), addsOffer.features);

  var popupPhotos = popupCard.querySelector('.popup__photos');
  appendPhotos(popupPhotos, addsOffer.photos, '.popup__photo');

  popupCard.querySelector('.popup__avatar').src = advertisements[landlordNumber].author.avatar;

  return document.querySelector('.map').insertBefore(popupCard, mapFiltersContainer);
};

// НАЧАЛО ПРОГРАММЫ

var advertisements = [];

var createAdsArr = function (adsCount) {
  for (var i = 1; i <= adsCount; i++) {
    advertisements = advertisements.concat(createSimilarAd(i));
  }
};

createAdsArr(ADS_COUNT);
activateMap(true);

var mapPin = document.querySelector('.map__pins');

addElem(mapPin, createPins(advertisements));
createPopup(0);
