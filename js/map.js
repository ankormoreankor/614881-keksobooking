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
        window.map.mapData = data.slice(0);
      }

      return window.map.mapData;
    }, null);

  };

  var pointer = window.map.mapPinsBlock.querySelector('.map__pin--main');

  var getPointerCoordinate = function (isMapActive) {
    return isMapActive === true ?
      {
        left: window.util.getElemCoordinate(pointer).left + window.util.getElemCenter(pointer).x,
        top: window.util.getElemCoordinate(pointer).top + pointer.offsetHeight + window.data.POINTER_ARROW_HEIGHT
      } : {
        left: window.util.getElemCoordinate(pointer).left + window.util.getElemCenter(pointer).x,
        top: window.util.getElemCoordinate(pointer).top + window.util.getElemCenter(pointer).y
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
        if (x <= (window.map.mapWidth - w)) {
          setPointerLeft(x - shift.x);
        } else {
          setPointerLeft(window.map.mapWidth - w);
        }
      } else {
        setPointerLeft(window.data.MAP_MIN_LEFT);
      }

      pointer.addEventListener('mouseup', onPointerWasMoved);
    };

    var onPointerWasMoved = function () {
      setAddress(true);
      window.form.activateForm(true);
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
