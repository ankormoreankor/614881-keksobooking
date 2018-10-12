'use strict';

// filter.js
(function () {
  var filters = document.querySelector('.map__filters');
  var mapFilters = document.querySelectorAll('.map__filter');
  var featuresBlock = document.querySelector('#housing-features');
  var features = featuresBlock.querySelectorAll('input[name=features]');

  var getFeatures = function (array) {
    var newArr = [];

    for (var i = 0; i < features.length; i++) {
      if (features[i].checked === true) {
        newArr[i] = features[i].value;
      } else {
        newArr[i] = false;
      }
    }

    var someArr = newArr.sort().filter(function (item) {
      return item !== false;
    });

    array[array.length] = someArr;

    return array;
  };

  var getValues = function () {
    var newArr = [];

    for (var i = 0; i < mapFilters.length; i++) {
      newArr[i] = mapFilters[i].value;
    }

    var bestNewArray = getFeatures(newArr);

    return bestNewArray;
  };

  var someFn = function (values) {
    var newArr = [];

    var filterType = function (array, value) {
      array = array.filter(function (item) {
        return item.offer.type === value;
      });

      return array;
    };

    var filterPrice = function (array, value) {
      array = array.filter(function (item) {
        var some = 0;

        if (item.offer.price < 10000) {
          some = 'low';
        } else if (item.offer.price > 50000) {
          some = 'high';
        } else {
          some = 'middle';
        }

        return some === value;
      });

      return array;
    };

    var filterRooms = function (array, value) {
      array = array.filter(function (item) {
        return item.offer.rooms === +value;
      });

      return array;
    };

    var filterGuests = function (array, value) {
      array = array.filter(function (item) {
        return item.offer.guests === +value;
      });

      return array;
    };

    var filterFeatures = function (arrayForSort, keyArray) {
      var sortingArray = arrayForSort.map(function (item) {
        return item.offer.features.sort();
      });

      var someArr = [];

      for (var i = 0; i < sortingArray.length; i++) {

        var sum = 0;

        for (var j = 0; j < keyArray.length; j++) {
          sum += sortingArray[i].some(function (item) {
            return item === keyArray[j];
          });
        }

        if (sum < keyArray.length) {
          someArr[i] = false;
        } else {
          someArr[i] = true;
        }

        if (someArr[i] === true) {
          someArr[i] = arrayForSort[i];
        }
      }

      return someArr.filter(function (item) {
        return item !== false;
      }).map(function (item) {
        return item;
      });
    };

    var filterFns = [
      filterType,
      filterPrice,
      filterRooms,
      filterGuests,
      filterFeatures
    ];

    newArr = newArr.concat(window.map.mapData);

    for (var i = 0; i < values.length; i++) {
      if (values[i] !== 'any' && values[i].length !== 0) {
        newArr = filterFns[i](newArr, values[i]);
      }
    }

    var bestNewArray = newArr.map(function (item) {
      return item;
    });

    window.popup.createPins(bestNewArray);
  };

  filters.addEventListener('change', function () {
    someFn(getValues());
  });

})();