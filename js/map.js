// var AVATAR_NUMBER_MIN = 1;
var AVATAR_NUMBER_MAX = 8;
var LOWEST_PRICE = 1000;
var HIGHEST_PRICE = 1000000;
var ROOMS_MINIMUM = 1;
var ROOMS_MAXIMUM = 5;
var BEDS_IN_ROOM = 2;
var PHOTOS_NUMBER_MAX = 3;
var LOCATION_Y_MIN = 130;
var LOCATION_Y_MAX = 630;

var landlordAvatars = [];

for (var i = 0; i < AVATAR_NUMBER_MAX; i++) {
  var avatarPath = 'img/avatars/user'

  if (i < 9) {
    landlordAvatars[i] = avatarPath + '0' + (i + 1) + '.png';
  } else {
    landlordAvatars[i] = avatarPath + (i + 1) + '.png';
  }
}



var timestamps = ['12:00', '13:00', '14:00'];

var guests_minimum = ROOMS_MINIMUM * BEDS_IN_ROOM;
var guests_maximum = ROOMS_MAXIMUM * BEDS_IN_ROOM;

var advertismentTitles = ["Большая уютная квартира", "Маленькая неуютная квартира", "Огромный прекрасный дворец", "Маленький ужасный дворец", "Красивый гостевой домик", "Некрасивый негостеприимный домик", "Уютное бунгало далеко от моря", "Неуютное бунгало по колено в воде"];

var houseTypes = ['palace', 'flat', 'house', 'bungalo'];

var checkinTimes = timestamps;
var checkoutTimes = timestamps;

var houseFeatures = ["wifi", "dishwasher", "parking", "washer", "elevator", "conditioner"];

var housePhotos = [];

for (var i = 0; i < PHOTOS_NUMBER_MAX; i++) {
  var photoPath = 'http://o0.github.io/assets/images/tokyo/hotel';

  housePhotos[i] = photoPath + (i + 1) + '.jpg';
}

// Объявляю массив похожих объявлений
// var similarAdvertisments = {};

// Создаю массив аватаров


// Добавляю массив аватаров к объекту autor внутри массива similarAdvertisments
// similarAdvertisments.autor = {avatar};

console.log(housePhotos);

