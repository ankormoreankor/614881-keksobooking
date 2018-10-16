'use strict';

(function () {
  var mapBlock = document.querySelector('.map');
  var mapWidth = document.querySelector('.map').offsetWidth;
  var mapPinsBlock = document.querySelector('.map__pins');

  window.map = {
    activateMap: function () {
      mapBlock.classList.remove('map--faded');
      loadData();
    },
    deavtivateMap: function () {
      mapBlock.classList.add('map--faded');
    },
    mapData: []
  };

  var loadData = function () {

    window.backend.get(function (data) {
      while (window.map.mapData.length < data.length) {
        window.map.mapData = data.slice();
      }

      return window.map.mapData;
    }, null);

  };

  var pointer = mapPinsBlock.querySelector('.map__pin--main');

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
        top: window.util.getElemCoordinate(pointer).top + pointer.offsetHeight + window.data.POINTER_ARROW_HEIGHT
      };
  };

  var setAddress = function () {
    var address = document.querySelector('#address');

    return address.setAttribute('value',
        getPointerCoordinate().left + ', ' +
      getPointerCoordinate().top);
  };

  setAddress();

  var onPointerCatched = function (evt) {
    evt.preventDefault();

    var startPosition = {
      x: evt.clientX,
      y: evt.clientY
    };

    var onPointerMove = function (moveEvt) {
      moveEvt.preventDefault();
      window.map.activateMap();

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

      var setPointerTop = function (top) {
        pointer.style.top = top + 'px';
      };

      var setPointerLeft = function (left) {
        pointer.style.left = left + 'px';
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
        if (x <= (mapWidth - w)) {
          setPointerLeft(x - shift.x);
        } else {
          setPointerLeft(mapWidth - w);
        }
      } else {
        setPointerLeft(window.data.MAP_MIN_LEFT);
      }

      pointer.addEventListener('mouseup', onPointerWasMoved);
    };

    var onPointerWasMoved = function () {
      setAddress();
      window.form.activateForm();
      window.popup.createPins(window.map.mapData);

      pointer.removeEventListener('mouseleave', onPointerWasMoved);
      pointer.removeEventListener('mousemove', onPointerMove);
      pointer.removeEventListener('mouseup', onPointerWasMoved);
    };

    pointer.addEventListener('mouseleave', onPointerWasMoved);
    pointer.addEventListener('mousemove', onPointerMove);
  };


  pointer.addEventListener('mousedown', onPointerCatched);

})();
