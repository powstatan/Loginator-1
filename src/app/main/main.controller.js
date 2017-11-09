angular.module('myApp', ['ngAudio']);
(function () {
  'use strict';

  angular
    .module('loginApp')
    .controller('MainController', MainController);

  /** @ngInject */
  function MainController($timeout, $state, dataService, credentialService, ngAudio, SoundService) {

    //display variables
    var vm = this;

    vm.highScore = dataService.highScore;
    vm.score = 0;
    vm.nextPointValue = 100;
    vm.countDownRemaining = 3;
    vm.username = '';
    vm.password = '';
    vm.gameStarted = false;
    vm.userMessage = '';
    vm.addScore = 0;
    vm.streak = 0;
    /*I'm keeping track of the longest streak, in case I want to include it later.
    Right now, it just clutters things up. I might pass it to GameOver, but I really
    like how that screen looks too. */
    vm.longestStreak = 0;
    vm.displayNextScore = 100;
    vm.twoSecs = 2;
    vm.realUN = credentialService.credentials.un;
    vm.realPW = credentialService.credentials.pw;
    vm.timeRemaining = credentialService.credentials.tm;
    vm.localCredCheck = localCredCheck;

    //Images
    vm.monster = './assets/images/monster-standing.png';
    vm.gameLogo = './assets/images/Loginator-Logo.png';

    //Sounds
    vm.sounds = {};


    vm.sounds.bgSong = ngAudio.load('./assets/sounds/bgSong.mp3');


    function playSound(name) {
      SoundService.getSound(name).start();
    }

    SoundService.loadSound({
      name: 'scoreOne',
      src: './assets/sounds/1.mp3'
    }).then(function (sound) {
      vm.sounds.scoreOne = sound;
    });
    SoundService.loadSound({
      name: 'scoreTwo',
      src: './assets/sounds/2.mp3'
    }).then(function (sound) {
      vm.sounds.scoreTwo = sound;
    });
    SoundService.loadSound({
      name: 'scoreThree',
      src: './assets/sounds/3.mp3'
    }).then(function (sound) {
      vm.sounds.scoreThree = sound;
    });
    SoundService.loadSound({
      name: 'wrong',
      src: './assets/sounds/wrong.mp3'
    }).then(function (sound) {
      vm.sounds.wrong = sound;
    });
    SoundService.loadSound({
      name: 'boop1',
      src: './assets/sounds/boop-1.mp3'
    }).then(function (sound) {
      vm.sounds.boop1 = sound;
    });
    SoundService.loadSound({
      name: 'boop2',
      src: './assets/sounds/boop-2.mp3'
    }).then(function (sound) {
      vm.sounds.boop2 = sound;
    });
    SoundService.loadSound({
      name: 'yay',
      src: './assets/sounds/yay.mp3'
    }).then(function (sound) {
      vm.sounds.yay = sound;
    });






    var gameTimeout;
    var countdownTimeout;
    var twoSecsTimeout;
    var usernameElement = angular.element(document.querySelector('#mainUNField'));
    var passwordElement = angular.element(document.querySelector('#mainPWField'));
    var timeTextElement = angular.element(document.querySelector('#timeText'));

    function localCredCheck() {
      usernameElement.focus();
      usernameElement.removeClass('invalid');
      passwordElement.removeClass('invalid');

      vm.multiplierMessage = "";
      vm.userMessage = "";
      if(vm.addScore < 300)
          {vm.displayNextScore=vm.addScore+100;}
      if (angular.lowercase(vm.username) != vm.realUN && angular.uppercase(vm.username) != vm.realUN) {
        //Username is not case-sensitive, so let's check for both.
        usernameElement.addClass('invalid');
        if (vm.streak > vm.longestStreak){
          vm.longestStreak=vm.streak;
        }
        vm.streak = 0;
        usernameElement.focus();
        //vm.sounds.wrong.start();
        playSound('wrong');
        vm.username = "";
        vm.addScore = 0;
      }
      else {
        vm.username = vm.realUN;
      }

      if (vm.password != vm.realPW) {
        if (angular.lowercase(vm.password) == vm.realPW) {
          vm.userMessage = "Is your capslock on?";
        }
        playSound('wrong');
        passwordElement.addClass('invalid');

        if (vm.username == vm.realUN) {
          passwordElement.focus();
        }
        vm.password = "";
        if (vm.streak > vm.longestStreak){
          vm.longestStreak=vm.streak;
        }
        if (vm.streak > vm.longestStreak){
          vm.longestStreak=vm.streak;
        }
        vm.streak = 0;
        vm.addScore = 0;
      }

      if (vm.password != vm.realPW && angular.lowercase(vm.username) != vm.realUN && angular.uppercase(vm.username) != vm.realUN) {
        usernameElement.focus();
      }
      if (vm.username == vm.realUN && vm.password == vm.realPW) {

        if (vm.addScore < 300) {
          vm.addScore = vm.addScore + 100;
        }
        usernameElement.removeClass('invalid');
        passwordElement.removeClass('invalid');
        vm.score += vm.addScore;
        vm.twoSecs = 2;
        if (vm.addScore == 100){
            playSound('scoreOne');
        }
        else if (vm.addScore == 200){
            vm.sounds.scoreOne.stop();
            playSound('scoreTwo');
        }
        else {
            vm.sounds.scoreTwo.stop();
            playSound('scoreThree');
        }
        vm.streak++;
        twoSecondMessages();
        vm.username = '';
        vm.password = '';
        usernameElement.focus();

      }
    if(vm.addScore < 300)
          {vm.displayNextScore=vm.addScore+100;}
    }


    //SUCCESS MESSAGE TIMER
    function twoSecondMessages() {

      vm.multiplierMessage = '+' + vm.addScore;
      vm.monster = './assets/images/monster-jumping.png';
      if (vm.twoSecs > 1) {
        vm.twoSecs--;
        twoSecsTimeout = $timeout(twoSecondMessages, 1000);
      } else {
        vm.multiplierMessage = '';
        vm.userMessage = '';
        vm.monster = './assets/images/monster-standing.png';
      }

    }

    //COUNTDOWN TIMER
    function startCountdownTimer() {
      countdownTimeout = $timeout(onCountdownTimeout, 1000);
    }

    function onCountdownTimeout() {
      if (vm.countDownRemaining > 1) {
        //vm.sounds.boop1.start();
        playSound('boop1');
        vm.countDownRemaining--;
        console.log(vm.countDownRemaining);
        countdownTimeout = $timeout(onCountdownTimeout, 1000);
      } else {
        vm.countDownRemaining = "GO!";
        //vm.sounds.boop2.start();
        playSound('boop2');
        $timeout(startGameTimer, 1500);
        stopCountdownTimer();
      }
    }

    function stopCountdownTimer() {
      $timeout.cancel(countdownTimeout);
    }

    //GAME TIMER
    function startGameTimer() {
      vm.gameStarted = true;
      vm.sounds.bgSong.play();
      usernameElement.focus();
      gameTimeout = $timeout(onTimeout, 1000);
    }

    function onTimeout() {
      if(vm.timeRemaining == 10) {
          timeTextElement.addClass('blink_text');
          }
      if (vm.timeRemaining > 0) {

        vm.timeRemaining--;
        if(vm.timeRemaining ==0) {
          //vm.sounds.boop2.start();
          playSound('boop2');
        }
          else if(vm.timeRemaining <= 3) {
          //vm.sounds.boop1.start();
          playSound('boop1');
        }
        gameTimeout = $timeout(onTimeout, 1000);
      } else {
        stopTimer();
        dataService.setHighScore(vm.score).then(function(){
          vm.sounds.bgSong.stop();
          //vm.sounds.yay.start();
          playSound('yay');
          $state.go('gameover');
        });
      }
    }

    function stopTimer() {
      $timeout.cancel(gameTimeout);
    }

    activate();

    function activate() {
      dataService.gameScore = 0;
      dataService.getHighScore().then(function(highScore){
        vm.highScore = dataService.highScore;
        //vm.sounds.boop1.start();
        playSound('boop1');
        startCountdownTimer();
      });
    }
  }
})();
