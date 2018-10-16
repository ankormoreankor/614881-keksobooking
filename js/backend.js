'use strict';

(function () {
  var DATA = 'https://js.dump.academy/keksobooking/data';
  var URL = 'https://js.dump.academy/keksobooking';
  var GET_TIMEOUT = 10000;
  var POST_TIMEOUT = 10000;
  var SUCCESS = 200;

  window.backend = {
    get: function (onLoad, onError) {
      var xhr = new XMLHttpRequest();
      xhr.responseType = 'json';

      xhr.addEventListener('load', function () {
        if (xhr.status === SUCCESS) {
          onLoad(xhr.response);
        } else {
          onError('Статус ответа: ' + xhr.status + ' ' + xhr.statusText);
        }
      });
      xhr.addEventListener('error', function () {
        onError('Произошла ошибка соединения');
      });
      xhr.addEventListener('timeout', function () {
        onError('Запрос не успел выполниться за ' + xhr.timeout + 'мс');
      });

      xhr.timeout = GET_TIMEOUT;

      xhr.open('GET', DATA);
      xhr.send();

    },

    post: function (data, onLoad, onError) {
      var xhr = new XMLHttpRequest();
      xhr.responseType = 'json';

      xhr.addEventListener('load', function () {
        if (xhr.status === SUCCESS) {
          onLoad(xhr.response);

          window.form.onSuccess();
        } else {
          onError('Статус ответа: ' + xhr.status + ' ' + xhr.statusText);
        }
      });
      xhr.addEventListener('error', function () {
        onError('Произошла ошибка соединения');
      });
      xhr.addEventListener('timeout', function () {
        onError('Запрос не успел выполниться за ' + xhr.timeout + 'мс');
      });

      xhr.timeout = POST_TIMEOUT;

      xhr.open('POST', URL);
      xhr.send(data);
    },

    adds: []

  };

  var loadData = function () {

    window.backend.get(function (data) {
      while (window.backend.adds.length < data.length) {
        window.backend.adds = data.slice();
      }

      return window.backend.adds;
    }, null);

    document.removeEventListener('DOMContentLoaded', loadData);

  };

  document.addEventListener('DOMContentLoaded', loadData);

})();
