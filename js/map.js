var ADS_COUNT = 8;
var LOWEST_PRICE = 1000;
var HIGHEST_PRICE = 1000000;
var ROOMS_MIN = 1;
var ROOMS_MAX = 5;
var BEDS_IN_ROOM = 2;
var PHOTOS_NUMBER_MAX = 3;
var MAP_WIDTH = 980;
var MAP_HEIGHT = 750;
var MAP_INDENT = 130;
var AVATAR_PATH = 'img/avatars/user';
var AVATAR_EXTENTION = '.png';
var PHOTO_PATH = 'http://o0.github.io/assets/images/tokyo/hotel';
var PHOTO_EXTENTION = '.jpg';

var advertismentTitles = ["Большая уютная квартира", "Маленькая неуютная квартира", "Огромный прекрасный дворец", "Маленький ужасный дворец", "Красивый гостевой домик", "Некрасивый негостеприимный домик", "Уютное бунгало далеко от моря", "Неуютное бунгало по колено в воде"];

var houseTypes = ['palace', 'flat', 'house', 'bungalo'];

var timestamps = ['12:00', '13:00', '14:00'];

var houseFeatures = ["wifi", "dishwasher", "parking", "washer", "elevator", "conditioner"];


// Создаю объект описанием жилища
var createSimilarAdvertisement = function (avatarNumber) {
  var similarAdvertisement = {};

  var avatar = 0;
  var title = 0;
  var adress = 0;
  var price = 0;
  var type = 0;
  var rooms = 0;
  var guests = 0;
  var checkin = 0;
  var checkout = 0;
  var features = [];
  var description = '';
  var photos = [];
  var x = 0;
  var y = 0;

  var getRandomValue = function (arr) {
    return Math.round(Math.random() * (arr.length - 1));
  };

  var getRandomFromTwo = function (min, max) {
    return Math.round(min + Math.random() * (max - min));
  }

  var getRandomArrayItem = function (arr) {
    return arr.splice(getRandomValue(arr), 1);
  }

  if (avatarNumber < 10) {
    avatar = AVATAR_PATH + '0' + avatarNumber + AVATAR_EXTENTION;
  } else {
    avatar = AVATAR_PATH + avatarNumber + AVATAR_EXTENTION;
  }

  title = advertismentTitles[getRandomValue(advertismentTitles)];

  var locationXMin = MAP_INDENT;
  var locationXMax = MAP_WIDTH - MAP_INDENT;
  var locationYMin = MAP_INDENT;
  var locationYMax = MAP_HEIGHT - MAP_INDENT;

  adress = getRandomFromTwo(locationXMin, locationXMax) + ', ' + getRandomFromTwo(locationYMin, locationYMax);

  price = getRandomFromTwo(LOWEST_PRICE, HIGHEST_PRICE);

  type = houseTypes[getRandomValue(houseTypes)];

  rooms = getRandomFromTwo(ROOMS_MIN, ROOMS_MAX);

  var guests_minimum = rooms * BEDS_IN_ROOM;
  var guests_maximum = rooms * BEDS_IN_ROOM;

  guests = getRandomFromTwo(guests_minimum, guests_maximum);

  var checkinTimes = timestamps;
  var checkoutTimes = timestamps;

  checkin = checkinTimes[getRandomValue(checkinTimes)];
  checkout = checkoutTimes[getRandomValue(checkoutTimes)];

  var newFeaturesArr = houseFeatures.slice(0, houseFeatures.length);

  for (var i = 0; i <= getRandomValue(newFeaturesArr); i++) {
    features = features.concat(getRandomArrayItem(newFeaturesArr));
  }

  var photosForSort = [];

  for (var i = 0; i < PHOTOS_NUMBER_MAX; i++) {
    photosForSort[i] = PHOTO_PATH + (i + 1) + PHOTO_EXTENTION;
  }

  for (var i = 0; i < PHOTOS_NUMBER_MAX; i++) {
    photos = photos.concat(getRandomArrayItem(photosForSort));
  }

  x = getRandomFromTwo(locationXMin, locationXMax);
  y = getRandomFromTwo(locationYMin, locationYMax);

  similarAdvertisement.autor = {avatar};
  similarAdvertisement.offer = {title, adress, price, type, rooms, guests, checkin, checkout, features, description, photos};
  similarAdvertisement.location = {x, y};

  return similarAdvertisement;
};

// "Включаю" карту
var activateMap = function (booleen) {
  return booleen = true ?
        document.querySelector('.map').classList.remove('map--faded') :
        document.querySelector('.map').classList.add('map--faded');
}

// Копирую шаблон меток, множу его, добавляю аватары
var createPins = function (pinsCount, container) {
  var pinTemplate = document
      .querySelector('#pin')
      .content
      .querySelector('.map__pin');

  for (var i = 0; i < pinsCount; i++) {
    var pin = pinTemplate.cloneNode(true);
    pin.style.left = advertisements[i].location.x + 'px';
    pin.style.top = advertisements[i].location.y + 'px';
    pin.children[0].src = advertisements[i].autor.avatar;
    pin.children[0].alt = advertisements[i].offer.title;

    container.appendChild(pin);
  }

  return container;
}

// Добавляю метки на карту
var addPins = function (parent ,fragment) {
  return parent.appendChild(fragment);
}

var createPopup = function (landlordNumber) {
  // Копирую шаблон попапа, наполняю информацией
  var mapFiltersConteiner = document.querySelector('.map__filters-container');
  var cardTemplate = document
      .querySelector('#card')
      .content
      .querySelector('.map__card');

  var popupCard = cardTemplate.cloneNode(true);

  popupCard.querySelector('.popup__title').textContent = advertisements[landlordNumber].offer.title;
  popupCard.querySelector('.popup__text--address').textContent = advertisements[landlordNumber].offer.adress;
  popupCard.querySelector('.popup__text--price').textContent = advertisements[landlordNumber].offer.price + '₽/ночь';

  // Заменяю англоязычное название жилища на рускоязычное
  var houseTypesRus = ['Дворец', 'Квартира', 'Дом', 'Бунгало'];

  for (var i = 0; i < houseTypes.length; i++) {
    if (houseTypes[i] === advertisements[landlordNumber].offer.type) {
      popupCard.querySelector('.popup__type').textContent = houseTypesRus[i];
    }
  }

  popupCard.querySelector('.popup__text--capacity').textContent =
    advertisements[landlordNumber].offer.rooms +
    ' комнаты для ' + advertisements[landlordNumber].offer.guests + ' гостей';

  popupCard.querySelector('.popup__text--time').textContent =
    'Заезд после ' + advertisements[landlordNumber].offer.checkin +
    ', выезд до ' + advertisements[landlordNumber].offer.checkout;

  // Удаляю текущие элементы li, создаю свои, количеством равным длине массива features,
  // добавляю такие же классы, как были, с поправкой на содержимое массива
  var popupFeatures = popupCard.querySelector('.popup__features');
  var liTemplates = popupCard.querySelectorAll('.popup__feature');

  for (var i = 0; i < liTemplates.length; i++) {
    popupFeatures.removeChild(popupFeatures.children[0]);
  }

  var popupFragment = document.createDocumentFragment();

  for (var i = 0; i < advertisements[landlordNumber].offer.features.length; i++) {
    var popupFeatureLi = document.createElement('li');
    popupFeatureLi.classList.add('popup__feature');
    popupFeatureLi.classList.add('popup__feature--' + advertisements[landlordNumber].offer.features[i]);

    popupFragment.appendChild(popupFeatureLi);
  }

  popupFeatures.appendChild(popupFragment);

  popupCard.querySelector('.popup__description').textContent = advertisements[landlordNumber].offer.description;

  // Клонирую объект img, заполняю src, записываю в фрагмент, удаляю исходный объект и присоединяю фрагмент
  var popupPhoto = popupCard.querySelector('.popup__photo');
  var photosFragment = document.createDocumentFragment();

  for (var i = 0; i < PHOTOS_NUMBER_MAX; i++) {
    var popupPhotoImg = popupPhoto.cloneNode(true);
    popupPhotoImg.src = advertisements[landlordNumber].offer.photos[i];

    photosFragment.appendChild(popupPhotoImg);
  }

  var popupPhotos = popupCard.querySelector('.popup__photos');
  popupPhotos.removeChild(popupPhoto);
  popupCard.querySelector('.popup__photos').appendChild(photosFragment);

  popupCard.querySelector('.popup__avatar').src = advertisements[landlordNumber].autor.avatar;


  document.querySelector('.map').insertBefore(popupCard, mapFiltersConteiner);
}

// НАЧАЛО ПРОГРАММЫ

// Создаю массив, заполняю объектами
var advertisements = [];

for (var i = 1; i <= ADS_COUNT; i++) {
  advertisements = advertisements.concat(createSimilarAdvertisement(i));
}

activateMap(true);

var mapPin = document.querySelector('.map__pins');
var pinFragment = document.createDocumentFragment();

createPins(ADS_COUNT, pinFragment);
addPins(mapPin, pinFragment);
createPopup(0);
