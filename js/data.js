'use strict';

// data.js
(function () {
  window.data = {
    MAP_MAX_TOP: 630,
    MAP_MIN_TOP: 130,
    MAP_MIN_LEFT: 0,
    MAP_RIGHT_INDENT: 40,
    POINTER_ARROW_HEIGHT: 22,
    LOWEST_PRICE: 1000,
    HIGHEST_PRICE: 1000000,
    ROOMS_MIN: 1,
    ROOMS_MAX: 5,
    AVATAR_PATH: 'img/avatars/user0',

    addsTitles: [
      'Большая уютная квартира',
      'Маленькая неуютная квартира',
      'Огромный прекрасный дворец',
      'Маленький ужасный дворец',
      'Красивый гостевой домик',
      'Некрасивый негостеприимный домик',
      'Уютное бунгало далеко от моря',
      'Неуютное бунгало по колено в воде'
    ],

    houseTypes: [
      'palace',
      'flat',
      'house',
      'bungalo'
    ],

    checkinCheckout: [
      '12:00',
      '13:00',
      '14:00'
    ],

    houseFeatures: [
      'wifi',
      'dishwasher',
      'parking',
      'washer',
      'elevator',
      'conditioner'
    ],

    housePhotos: [
      'http://o0.github.io/assets/images/tokyo/hotel1.jpg',
      'http://o0.github.io/assets/images/tokyo/hotel2.jpg',
      'http://o0.github.io/assets/images/tokyo/hotel3.jpg'
    ],

    houseTypesRus: [
      'Дворец',
      'Квартира',
      'Дом',
      'Бунгало'
    ]

  };
})();

// moch.js
(function () {
  var createSimilarAd = function (avatarNumber) {
    var location = {
      x: window.util.getRandomFromTwo(window.data.MAP_MIN_LEFT, window.map.mapWidth - window.data.MAP_RIGHT_INDENT),
      y: window.util.getRandomFromTwo(window.data.MAP_MIN_TOP, window.data.MAP_MAX_TOP)
    };

    return {
      author: {
        avatar: window.data.AVATAR_PATH + avatarNumber + '.png',
      },

      offer: {
        title: window.data.addsTitles[window.util.getRandomValue(window.data.addsTitles)],
        address: location.x + ' ' + location.y,
        price: window.util.getRandomFromTwo(window.data.LOWEST_PRICE, window.data.HIGHEST_PRICE),
        type: window.data.houseTypes[window.util.getRandomValue(window.data.houseTypes)],
        rooms: window.util.getRandomFromTwo(window.data.ROOMS_MIN, window.data.ROOMS_MAX),
        guests: window.util.getRandomFromTwo(window.data.ROOMS_MIN, window.data.ROOMS_MAX),
        checkin: window.data.checkinCheckout[window.util.getRandomValue(window.data.checkinCheckout)],
        checkout: window.data.checkinCheckout[window.util.getRandomValue(window.data.checkinCheckout)],
        features: window.util.createRandomArr(window.data.houseFeatures),
        description: '',
        photos: window.util.mixArr(window.data.housePhotos)
      },

      location: {
        x: location.x,
        y: location.y
      }
    };
  };

  window.moch = {
    createAdsArr: function (adsCount) {
      var array = [];

      for (var i = 1; i <= adsCount; i++) {
        array = array.concat(createSimilarAd(i));
      }

      return array;
    }
  };
})();
