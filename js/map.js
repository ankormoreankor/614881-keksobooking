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

  for (var i = 0; i < getRandomValue(newFeaturesArr); i++) {
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
};
