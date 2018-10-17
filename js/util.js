'use strict';

(function () {
  var ESC_KEYCODE = 27;

  window.util = {
    isEscEvent: function (evt, action) {
      if (evt.keyCode === ESC_KEYCODE) {
        action();
      }
    },
    getRandomValue: function (arr) {
      return Math.round(Math.random() * (arr.length - 1));
    },

    compareAndReturn: function (comparedArr, condition, returnedArr) {

      for (var i = 0; i < comparedArr.length; i++) {
        if (comparedArr[i] === condition) {
          break;
        }
      }

      return returnedArr[i];
    },

    createChild: function (tag, attribute, value) {
      var newElem = document.createElement(tag);

      newElem.setAttribute(attribute, value);

      return newElem;
    },

    insertText: function (selector, content, parentBlock) {
      var elem = parentBlock.querySelector(selector);
      elem.textContent = content;

      return elem;
    },

    deleteChilds: function (selector, parentBlock) {
      var childs = parentBlock.querySelectorAll(selector);

      for (var i = 0; i < childs.length; i++) {
        parentBlock.removeChild(childs[i]);
      }

      return parentBlock;
    },

    convertToArr: function (someValue) {
      var someArray = [];
      someArray = someArray.concat(someValue);

      return someArray;
    },

    disableElem: function (nodeOrNodeList) {
      this.convertToArr(nodeOrNodeList);

      nodeOrNodeList.forEach(function (node) {
        node.setAttribute('disabled', '');
      });
    },

    activateElem: function (nodeOrNodeList) {
      this.convertToArr(nodeOrNodeList);

      nodeOrNodeList.forEach(function (node) {
        node.removeAttribute('disabled', '');
      });
    },

    getElemCoordinate: function (elem) {
      return {
        left: parseInt(getComputedStyle(elem).left, 10),
        top: parseInt(getComputedStyle(elem).top, 10)
      };
    },

    getElemCenter: function (elem) {
      return {
        x: Math.ceil(elem.offsetWidth / 2),
        y: Math.ceil(elem.offsetHeight / 2)
      };
    },
  };
})();
