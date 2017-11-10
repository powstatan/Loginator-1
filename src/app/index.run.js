(function() {
  'use strict';

  angular
    .module('loginApp')
    .run(runBlock);

  /** @ngInject */
  function runBlock($log) {

    $log.debug('runBlock end');
    $(document).foundation();
  }

})();
