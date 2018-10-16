'use strict';

(function () {

  var mapBlock = document.querySelector('.map');

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

    return mapBlock.insertBefore(popupCard, mapFiltersContainer);
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
    window.util.isEscEvent(evt, window.popup.closeMapPopup);
  };

  var mapPinsBlock = document.querySelector('.map__pins');

  window.popup = {
    createPins: function (data) {
      var fragment = document.createDocumentFragment();
      var pinTemplate = document.querySelector('#pin').content.querySelector('.map__pin');

      window.util.deleteChilds('button[type=button]', mapPinsBlock);

      var dataLength = 0;

      if (data.length > 5) {
        dataLength = 5;
      } else {
        dataLength = data.length;
      }

      for (var i = 0; i < dataLength; i++) {
        var pin = pinTemplate.cloneNode(true);
        pin.style.left = data[i].location.x + 'px';
        pin.style.top = data[i].location.y + 'px';
        pin.children[0].src = data[i].author.avatar;
        pin.children[0].alt = data[i].offer.title;

        fragment.appendChild(pin);
      }

      mapPinsBlock.appendChild(fragment);
    },

    closeMapPopup: function () {
      window.util.deleteChilds('.map__card', mapBlock);
      document.removeEventListener('keydown', onPopupEscPress);
    },

    createCurrentPopup: function (evt) {
      window.util.deleteChilds('.map__card', mapBlock);

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

      var popupCloseButton = mapBlock.querySelector('.popup__close');

      popupCloseButton.addEventListener('click', this.closeMapPopup);
      document.addEventListener('keydown', onPopupEscPress);
    }
  };

  mapPinsBlock.addEventListener('click', function (evt) {
    var current = evt.target;


    while (current !== mapPinsBlock) {
      if (current.type === 'button') {
        window.popup.createCurrentPopup(evt);
        return;
      }
      current = current.parentNode;
    }

  });

})();
