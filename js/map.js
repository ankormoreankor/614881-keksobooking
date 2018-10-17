'use strict';

(function () {
  var MAP_MAX_TOP = 630;
  var MAP_MIN_TOP = 130;
  var MAP_MIN_LEFT = 0;
  var POINTER_ARROW_HEIGHT = 22;

  var mapBlock = document.querySelector('.map');
  var mapWidth = mapBlock.offsetWidth;
  var mapPinsBlock = document.querySelector('.map__pins');
  var pointer = mapPinsBlock.querySelector('.map__pin--main');
  var pointerStart = {};

  var getPointerCoordinate = function () {
    var isMapFaded = [].some.call(mapBlock.classList, function (item) {
      return item === 'map--faded';
    });
    return isMapFaded === true ?
      {
        left: window.util.getElemCoordinate(pointer).left + window.util.getElemCenter(pointer).x,
        top: window.util.getElemCoordinate(pointer).top + window.util.getElemCenter(pointer).y
      } : {
        left: window.util.getElemCoordinate(pointer).left + window.util.getElemCenter(pointer).x,
        top: window.util.getElemCoordinate(pointer).top + pointer.offsetHeight + POINTER_ARROW_HEIGHT
      };
  };

  var setAddress = function () {
    var address = document.querySelector('#address');

    address.setAttribute('value',
        getPointerCoordinate().left + ', ' +
      getPointerCoordinate().top);
  };

  window.map = {
    activate: function () {
      mapBlock.classList.remove('map--faded');
      setAddress();
    },
    deactivate: function () {
      mapBlock.classList.add('map--faded');
      window.util.deleteChilds('button[type=button]', mapPinsBlock);
      pointer.style.left = pointerStart.left + 'px';
      pointer.style.top = pointerStart.top + 'px';
      setAddress();
    },
    data: []
  };

  var onPointerCatched = function (evt) {
    evt.preventDefault();

    var startPosition = {
      x: evt.clientX,
      y: evt.clientY
    };

    var onPointerMove = function (moveEvt) {
      moveEvt.preventDefault();
      window.map.activate();

      var shift = {
        x: startPosition.x - moveEvt.clientX,
        y: startPosition.y - moveEvt.clientY
      };

      startPosition = {
        x: moveEvt.clientX,
        y: moveEvt.clientY
      };

      var x = pointer.offsetLeft;
      var y = pointer.offsetTop;
      var w = pointer.offsetWidth;
      var h = pointer.offsetHeight + POINTER_ARROW_HEIGHT;

      var setPointerTop = function (top) {
        pointer.style.top = top + 'px';
      };

      var setPointerLeft = function (left) {
        pointer.style.left = left + 'px';
      };

      if (y >= MAP_MIN_TOP - h) {
        if (y <= MAP_MAX_TOP - h) {
          setPointerTop(y - shift.y);
        } else {
          setPointerTop(MAP_MAX_TOP - h);
        }
      } else {
        setPointerTop(MAP_MIN_TOP - h);
      }

      if (x >= MAP_MIN_LEFT) {
        if (x <= (mapWidth - w)) {
          setPointerLeft(x - shift.x);
        } else {
          setPointerLeft(mapWidth - w);
        }
      } else {
        setPointerLeft(MAP_MIN_LEFT);
      }

      pointer.addEventListener('mouseup', onPointerWasMoved);
      pointer.addEventListener('mouseleave', onPointerWasMoved);
    };

    var onPointerWasMoved = function () {
      setAddress();
      if (window.backend.adds.length !== 0) {
        window.popup.createPins(window.backend.adds);
      }

      pointer.addEventListener('mousedown', onPointerCatched);
      pointer.removeEventListener('mouseleave', onPointerWasMoved);
      pointer.removeEventListener('mousemove', onPointerMove);
      pointer.removeEventListener('mouseup', onPointerWasMoved);
    };

    pointer.addEventListener('mousemove', onPointerMove);
  };


  pointer.addEventListener('mousedown', onPointerCatched);

  document.addEventListener('DOMContentLoaded', function () {
    pointerStart = window.util.getElemCoordinate(pointer);
  });

  document.addEventListener('DOMContentLoaded', window.map.deactivate);
})();
