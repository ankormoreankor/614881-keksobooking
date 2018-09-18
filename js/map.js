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

var compareAndReturn = function (arr_1, arr_2, condition) {

  for (var i = 0; i < arr_1.length; i++) {
    if (arr_1[i] === condition) {
      break;
    }
  }

  return arr_2[i];
};

var createChild = function (tag, attribute, valueArr) {
  var newElem = document.createElement(tag);

  newElem.setAttribute(attribute, valueArr);

  return newElem;
};

var addElem = function (parent, child) {
  return parent.appendChild(child);
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

var activateMap = function (booleen) {
  return booleen = true ?
        document.querySelector('.map').classList.remove('map--faded') :
        document.querySelector('.map').classList.add('map--faded');
};

var createPins = function (array, container) {
  var pinTemplate = document.querySelector('#pin').content.querySelector('.map__pin');

  for (var i = 0; i < array.length; i++) {
    var pin = pinTemplate.cloneNode(true);
    pin.style.left = array[i].location.x + 'px';
    pin.style.top = array[i].location.y + 'px';
    pin.children[0].src = array[i].author.avatar;
    pin.children[0].alt = array[i].offer.title;

    container.appendChild(pin);
  }

  return container;
};

var mapFiltersConteiner = document.querySelector('.map__filters-container');
var cardTemplate = document.querySelector('#card').content.querySelector('.map__card');

var createPopup = function (landlordNumber) {
  var popupCard = cardTemplate.cloneNode(true);
  var popupFeatures = popupCard.querySelector('.popup__features');
  var popupPhotos = popupCard.querySelector('.popup__photos');

  var addsOffer = advertisements[landlordNumber].offer;

  var insertText = function (selector, node) {
    var parent = popupCard.querySelector(selector);

    return parent.textContent = node;
  };

  var deleteChilds = function (selector, parent) {
    var childs = popupCard.querySelectorAll(selector);

    for (var i = 0; i < childs.length; i++) {
      parent.removeChild(parent.children[0]);
    }

    return parent;
  };

  var appendFeatures = function (parent) {
    var fragment = document.createDocumentFragment();

    for (var i = 0; i < addsOffer.features.length; i++) {
      fragment.appendChild(createChild('li', 'class', 'popup__feature' + ' ' + 'popup__feature--' + addsOffer.features[i]));
    }

    return parent.appendChild(fragment);
  };

  var appendPhotos = function (parent) {
    var fragment = document.createDocumentFragment();
    popupPhotos.children[0].src = addsOffer.photos[0];

    for (var i = 1; i < housePhotos.length; i++) {
      var popupPhotoImg = popupCard.querySelector('.popup__photo').cloneNode(true);
      popupPhotoImg.src = addsOffer.photos[i];

      fragment.appendChild(popupPhotoImg);
    }

    return parent.appendChild(fragment);
  };

  insertText('.popup__title', addsOffer.title);
  insertText('.popup__text--address', addsOffer.adress);
  insertText('.popup__text--price', addsOffer.price + '₽/ночь');
  insertText('.popup__type', compareAndReturn(houseTypes, houseTypesRus, addsOffer.type));
  insertText('.popup__text--capacity', addsOffer.rooms + ' комнаты для ' + addsOffer.guests + ' гостей');
  insertText('.popup__text--time', 'Заезд после ' + addsOffer.checkin + ', выезд до ' + addsOffer.checkout);
  insertText('.popup__description', addsOffer.description);

  deleteChilds('.popup__feature', popupFeatures);
  appendFeatures(popupFeatures);

  appendPhotos(popupPhotos);

  popupCard.querySelector('.popup__avatar').src = advertisements[landlordNumber].author.avatar;

  return popupCard;
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
var pinFragment = document.createDocumentFragment();

createPins(advertisements, pinFragment);
addElem(mapPin, pinFragment);
addElem(document.querySelector('.map'), createPopup(0));
