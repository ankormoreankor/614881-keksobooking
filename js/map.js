'use strict';

(function () {

  window.map = {
    mapBlock: document.querySelector('.map'),
    mapWidth: document.querySelector('.map').offsetWidth,
    mapPinsBlock: document.querySelector('.map__pins'),
    activateMap: function (condition) {
      if (condition === true) {
        this.mapBlock.classList.remove('map--faded');
        loadData();
      } else {
        this.mapBlock.classList.add('map--faded');
      }
    },
    mapData: []
  };

  var loadData = function () {

    window.backend.get(function (data) {
      while (window.map.mapData.length < data.length) {
        window.map.mapData = window.map.mapData.concat(data);
      }

      return window.map.mapData;
    }, null);

  };

  var Pointer = window.map.mapPinsBlock.querySelector('.map__pin--main');

  var getPointerCoordinate = function (isMapActive) {
    return isMapActive === true ?
      {
        left: window.util.getElemCoordinate(Pointer).left + window.util.getElemCenter(Pointer).x,
        top: window.util.getElemCoordinate(Pointer).top + Pointer.offsetHeight + window.data.POINTER_ARROW_HEIGHT
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

  setAddress(false);

  var onPointerCatched = function (evt) {
    evt.preventDefault();

    var startPosition = {
      x: evt.clientX,
      y: evt.clientY
    };

    var onPointerMove = function (moveEvt) {
      moveEvt.preventDefault();
      window.map.activateMap(true);

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

      if (y >= window.data.MAP_MIN_TOP) {
        if (y <= window.data.MAP_MAX_TOP) {
          setPointerTop(y - shift.y);
        } else {
          setPointerTop(window.data.MAP_MAX_TOP);
        }
      } else {
        setPointerTop(window.data.MAP_MIN_TOP);
      }

      if (x >= window.data.MAP_MIN_LEFT) {
        if (x <= (window.map.mapWidth - w)) {
          setPointerLeft(x - shift.x);
        } else {
          setPointerLeft(window.map.mapWidth - w);
        }
      } else {
        setPointerLeft(window.data.MAP_MIN_LEFT);
      }

      Pointer.addEventListener('mouseup', onPointerWasMoved);
    };

    var onPointerWasMoved = function () {
      setAddress(true);
      window.form.activateForm(true);
      window.backend.get(window.popup.createPins, window.form.onDataError);

      Pointer.removeEventListener('mouseleave', onPointerWasMoved);
      Pointer.removeEventListener('mousemove', onPointerMove);
      Pointer.removeEventListener('mouseup', onPointerWasMoved);
    };

    // Pointer.addEventListener('mousemove', loadData);
    Pointer.addEventListener('mouseleave', onPointerWasMoved);
    Pointer.addEventListener('mousemove', onPointerMove);
  };


  Pointer.addEventListener('mousedown', onPointerCatched);
})();


// popup.js

(function () {
  // var ADS_COUNT = 8;
  // var advertisements = window.moch.createAdsArr(ADS_COUNT);

  var appendPhotos = function (parentBlock, photosArray, selector) {
    var fragment = document.createDocumentFragment();
    if (photosArray.length === 0) {
      parentBlock.style.display = 'none';
    }

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

  var createPopup = function (landlordNumber) {
    var mapFiltersContainer = document.querySelector('.map__filters-container');
    var cardTemplate = document.querySelector('#card').content.querySelector('.map__card');
    var popupCard = cardTemplate.cloneNode(true);
    var addsOffer = window.map.mapData[landlordNumber].offer;

    window.util.insertText('.popup__title', addsOffer.title, popupCard);
    window.util.insertText('.popup__text--address', addsOffer.adress, popupCard);
    window.util.insertText('.popup__text--price', addsOffer.price + '₽/ночь', popupCard);
    window.util.insertText('.popup__type', window.util.compareAndReturn(window.data.houseTypes, addsOffer.type, window.data.houseTypesRus), popupCard);
    window.util.insertText('.popup__text--capacity', addsOffer.rooms + ' комнаты для ' + addsOffer.guests + ' гостей', popupCard);
    window.util.insertText('.popup__text--time', 'Заезд после ' + addsOffer.checkin + ', выезд до ' + addsOffer.checkout, popupCard);
    window.util.insertText('.popup__description', addsOffer.description, popupCard);

    var popupFeatures = popupCard.querySelector('.popup__features');
    appendFeatures(window.util.deleteChilds('.popup__feature', popupFeatures), addsOffer.features);

    var popupPhotos = popupCard.querySelector('.popup__photos');
    appendPhotos(popupPhotos, addsOffer.photos, '.popup__photo');

    popupCard.querySelector('.popup__avatar').src = window.map.mapData[landlordNumber].author.avatar;

    return window.map.mapBlock.insertBefore(popupCard, mapFiltersContainer);
  };

  var onPinClick = function (evt) {
    var coordinates = {};

    coordinates = window.util.getElemCoordinate(evt.target);
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
    window.util.deleteChilds('.map__card', window.map.mapBlock);
    document.removeEventListener('keydown', onPopupEscPress);
  };

  window.popup = {
    createPins: function (data) {
      var fragment = document.createDocumentFragment();
      var pinTemplate = document.querySelector('#pin').content.querySelector('.map__pin');

      window.util.deleteChilds('button[type=button]', window.map.mapPinsBlock);

      for (var i = 0; i < data.length; i++) {
        var pin = pinTemplate.cloneNode(true);
        pin.style.left = data[i].location.x + 'px';
        pin.style.top = data[i].location.y + 'px';
        pin.children[0].src = data[i].author.avatar;
        pin.children[0].alt = data[i].offer.title;

        fragment.appendChild(pin);
      }

      window.map.mapPinsBlock.appendChild(fragment);
    },

    createCurrentPopup: function (evt) {
      window.util.deleteChilds('.map__card', window.map.mapBlock);

      var coords = {
        x: onPinClick(evt).left,
        y: onPinClick(evt).top
      };

      for (var i = 0; i < window.map.mapData.length; i++) {
        if (coords.x === window.map.mapData[i].location.x) {
          if (coords.y === window.map.mapData[i].location.y) {
            createPopup(i);
          }
        }
      }

      var popupCloseButton = window.map.mapBlock.querySelector('.popup__close');

      popupCloseButton.addEventListener('click', closeMapPopup);
      document.addEventListener('keydown', onPopupEscPress);
    }
  };

  window.map.mapPinsBlock.addEventListener('click', function (evt) {
    var current = evt.target;


    while (current !== window.map.mapPinsBlock) {
      if (current.type === 'button') {
        window.popup.createCurrentPopup(evt);
        return;
      }
      current = current.parentNode;
    }

  });

})();
