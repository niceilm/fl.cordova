angular.module('fl.cordova', ['ngMaterial']);
angular.module('fl.cordova').provider('$flBackButtonExiter', $flBackButtonExiterProvider).run(run);

function $flBackButtonExiterProvider() {
  var options = {
    message: '한번 더 누르시면 앱이 종료됩니다.',
    delay: 3000,
    homePaths: ["/"],
    autoStart: true
  };
  this.setOptions = function(newOptions) {
    newOptions = newOptions || {};
    options = angular.extend(options, newOptions);
  };

  this.$get = ['$timeout', '$mdToast', '$location', '$log', '$window', function($timeout, $mdToast, $location, $log, $window) {
    $log.debug('init BackButtonExiter');
    var isPressBackButton = false;
    if(options.autoStart) {
      start();
    }
    return {
      start: start,
      stop: stop
    };

    function onBackButton(e) {
      $log.debug($location.url());
      var isHomePath = options.homePaths.indexOf($location.url()) > -1;
      if(isHomePath) {
        if(isPressBackButton) {
          e.preventDefault();
          $window.navigator.app.exitApp();
        }
        $timeout(function() {
          isPressBackButton = false
        }, options.delay);
        isPressBackButton = true;
        $mdToast.show($mdToast.simple()
          .content(options.message)
          .position('bottom').hideDelay(options.delay));
      } else {
        $window.navigator.app.backHistory()
      }
    }

    function start() {
      $window.document.addEventListener("backbutton", onBackButton, false);
    }

    function stop() {
      $window.document.removeEventListener("backbutton", onBackButton, false);
    }
  }];
}

run.$inject = ['$flBackButtonExiter'];
function run($flBackButtonExiter) {

}
