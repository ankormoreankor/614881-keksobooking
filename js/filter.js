'use strict';

(function () {
  var filters = document.querySelector('.map__filters');
  var mapFilters = document.querySelectorAll('.map__filter');
  var featuresBlock = document.querySelector('#housing-features');
  var features = featuresBlock.querySelectorAll('input[name=features]');

  var getFeatures = function (array) {
    var transitArray = [];

    for (var i = 0; i < features.length; i++) {
      if (features[i].checked === true) {
        transitArray[i] = features[i].value;
      } else {
        transitArray[i] = false;
      }
    }

    var newArray = transitArray.sort().filter(function (item) {
      return item !== false;
    });

    array[array.length] = newArray;

    return array;
  };

  var getValues = function () {
    var transitArray = [];

    for (var i = 0; i < mapFilters.length; i++) {
      transitArray[i] = mapFilters[i].value;
    }

    var newArray = getFeatures(transitArray);

    return newArray;
  };

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

    var transitArray = [];

    for (var i = 0; i < sortingArray.length; i++) {

      var sum = 0;

      for (var j = 0; j < keyArray.length; j++) {
        sum += sortingArray[i].some(function (item) {
          return item === keyArray[j];
        });
      }

      if (sum < keyArray.length) {
        transitArray[i] = false;
      } else {
        transitArray[i] = true;
      }

      if (transitArray[i] === true) {
        transitArray[i] = arrayForSort[i];
      }
    }

    var returnedArray = transitArray.filter(function (item) {
      return item !== false;
    }).map(function (item) {
      return item;
    });

    return returnedArray;
  };

  var sortAdds = function (values) {
    var transitArray = [];

    var filterFns = [
      filterType,
      filterPrice,
      filterRooms,
      filterGuests,
      filterFeatures
    ];

    transitArray = window.backend.adds.slice();

    for (var i = 0; i < values.length; i++) {
      if (values[i] !== 'any' && values[i].length !== 0) {
        transitArray = filterFns[i](transitArray, values[i]);
      }
    }

    var newArray = transitArray.map(function (item) {
      return item;
    });

    window.popup.createPins(newArray);
  };

  filters.addEventListener('change', function () {
    window.popup.close();
    sortAdds(getValues());
  });

})();
