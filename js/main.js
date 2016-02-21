//https://github.com/nygardk/react-scifi // Expired bg animation
//https://github.com/One-com/one-color
//https://github.com/elrumordelaluz/csshake/blob/master/dist/csshake-little.css
//http://www.freesfx.co.uk/soundeffects/lasers_weapons/
//http://www.freesfx.co.uk/soundeffects/explosions/?p=5
//http://ericskiff.com/music/
(function() {
soundManager.setup({
  url: 'js/SoundManager2/swf/',
  flashVersion: 9,
  onready: function() {

  soundManager.createSound({
    url: '07_We_re_the_Resistors.mp3'
  }).play({
    volume: 60
  });

  var w = window;
  var d = document;

  var record = 0;
  var cookies = document.cookie;
  cookies = cookies.split(';');
  for(var i=0; i<cookies.length; i++){
    var cookie = cookies[i].split('=')[0];
    if (cookie == 'score') {
      record = cookies[i].split('=')[1];
    }
  }

  wordRegExp = function(word) {
    return new RegExp('(^|\\s)' + word + '(\\s|$)', 'g');
  }
  normalizeSpaces = function(str) {
    return str.replace(/\s+/g, ' ').replace(/(^ | $)/g, '');
  }
  $ = function(selector, el) {
    if (typeof el == "undefined" || el == "null") el = d;
    return el.querySelectorAll(selector);
  }
  $0 = function(selector, el) {
    if (typeof el == "undefined" || el == "null") el = d;
    return el.querySelector(selector);
  }
  $id = function(id, el) {
    if (typeof el == "undefined" || el == "null") el = d;
    return el.getElementById(id);
  }
  el = function(el, text) {
    if (typeof el == "undefined" || el == "null") el = 'div';
    el = d.createElement(el);
    if (text) el.innerHTML = text;
    return el;
  }
  Node.prototype.addClass = function(className) {
    if(!(wordRegExp(className)).test(this.className)) {
      this.className = normalizeSpaces(
        this.className + ' ' + className
      );
    }
    return this;
  }
  Node.prototype.removeClass = function(className) {
    this.className = normalizeSpaces(
      this.className.replace(wordRegExp(className), '$1')
    );
    return this;
  }
  Node.prototype.on = function(event, callback, preventDefault) {
    return this.addEventListener(event, function(e){
      if (preventDefault) e.preventDefault();
      return callback.call(this, e);
    });
  }
  NodeList.prototype.each = function(callback) {
    for (var i = 0, len = this.length; i < len; i++) {
      callback.call(this[i]);
    }
  }
  var $screen = $id('game_screen');
  var $ui = $0('.stars', $screen);
  var $scores = $0('.scores', $ui);
  var $record = $0('.record', $ui);
  var $timeBar = $0('.timeBar .value', $ui);
  var $comboMeter = $0('.comboMeter .value', $ui);

  var bgColor = [one.color('#102B2C'), one.color('#0D1214')];
  var shot = soundManager.createSound({
    url: '4531_1329823884.mp3',autoLoad:true
  });
  var boom = soundManager.createSound({
    url: '3633_1329342021.mp3',autoLoad:true
  });

  var time = 20;
  var clickTime = 0;
  var comboSeries = 0;
  var superShot = false;
  var score = 0;

  var starTypes     = [ 't1', 't2', 't3' ];
  var starDurations = [ 10, 5, 3 ];
  var starRates     = [ 1, 5, 10 ];

  $record.innerHTML = record;

  message = function(str, last) {
    if (typeof last == "undefined" || last == "null") last = false;
    var $message = el('div', str);
    $message.addClass('message');
    if (last) {
      $message.addClass('last');
    } else {
      setTimeout(function() {
        $message.remove();
      }, 1000);
    }
    $screen.appendChild($message);
  }
  clickStar = function() {
    shot.play();
    var star = this;
    if (!superShot) {
      score += starRates[star.typeno];
      star.style.transition = '0.2s linear all';
      star.addClass('hide');
      setTimeout(function() {
        star.remove();
      }, 200);
      if (star.cathed == 1) {
        setTimeout(function() {
          message('Dexterous !!');
        }, 200);
        score += 50;
      }
      var newtime = Date.now();
      var speedMeter = newtime - clickTime;
      if (speedMeter < 1000) {
        comboSeries++;
        if(comboSeries == 12) {
          score += 10;
          $ui.addClass('crazy').style.borderColor = 'red';
          message('SUPER SHOT !!');
          comboSeries = 0;
          superShot = true;
        } else if(comboSeries == 8) {
          score += 20;
          message('Speed SuperCombo !!');
        } else if (comboSeries == 4) {
          score += 10;
          message('Speed Combo !!');
        } else if (speedMeter<500) {
          score += 5;
          message('Fast !!');
        }
      } else {
        comboSeries = 0;
      }
      $comboMeter.style.width = comboSeries/11 * 100 + '%';
      clickTime = newtime;
    } else {
      superShot = false;
      $ui.removeClass('crazy').style.borderColor = '#fff';
      var allStars = $('.'+this.className.split(' ').join('.'),$ui);
      boom.play();
      allStars.each(function(){
        score += starRates[this.typeno];
        this.style.transition = '.5s linear all';
        this.style.animationName = 'none';
      });
      allStars.each(function(){
        var star = this;
        setTimeout(function() {
          star.addClass('hide');
        }, 0);
      });
      setTimeout(function() {
        allStars.each(function(){this.remove()});
      }, 500);
    }
    $scores.innerHTML = score;
  }
  hoverStar = function() {
    if (!this.catched && (this.creationTime-Date.now() + starDurations[this.typeno] * 1000 < 1000)) {
      this.cathed = 1;//It's small
    } else this.cathed = 2;//Normal catched
    this.removeClass('hiden').style.animationName = 'none';
    clearTimeout(this.timeout);
  }
  blendStar = function() {
    var star = this;
    star.style.transition = '0.3s linear all';
    star.addClass('hiden');
    star.timeout = setTimeout(function() {
      star.remove();
    }, 300);
  }
  createStar = function() {
    var sel = Math.floor(Math.random()*starTypes.length);
    var star = el().addClass('star');
    star.addClass(starTypes[sel]);
    star.style.top = Math.random()*90 + '%';
    star.style.left = 10 + Math.random()*80 + '%';
    star.on('click', clickStar);
    star.on('mouseover', hoverStar);
    star.on('mouseleave', blendStar);
    $ui.appendChild(star);
    star.cathed = false;
    star.typeno = sel;
    star.creationTime = Date.now();
    star.timeout = setTimeout(function() {
      star.remove();
    }, starDurations[sel]*1000);
  }
  var createStarInterval = setInterval(createStar,200);
  var timeInterval = setInterval(function(){
    $timeBar.style.width = --time * 5 + '%';
    if (time == 0) {
      var now = new Date();
      now.setMonth( now.getMonth() + 6 );
      clearInterval(timeInterval);
      clearInterval(createStarInterval);
      allStars = $('.star', $ui);
      allStars.each(function(){
        this.style.transition = '.5s linear all';
        this.style.animationName = 'none';
      });
      allStars.each(function(){
        var star = this;
        setTimeout(function() {
          star.addClass('hide');
        }, 0);
      });
      $0('.comboMeter', $ui).style.display = 'none';
      setTimeout(function(){
        var record = 0;
        var cookies = document.cookie;
        cookies = cookies.split(';');
        for(var i=0; i<cookies.length; i++){
          var cookie = cookies[i].split('=')[0];
          if (cookie == 'score') {
            record = cookies[i].split('=')[1];
          }
        }
        if (score > record) {
          document.cookie = 'score='+score+'; expires=' + now.toUTCString();
          message('New Record', true);
        } else {
          message('Game Over', true);
        }
        allStars.each(function(){this.remove()});
      }, 500);
    }
  }, 1000);
  setInterval(function(){
    bgColor[0]  = bgColor[0].hue(0.0005, true);
    bgColor[1]  = bgColor[1].hue(0.0005, true);
    $screen.style.backgroundImage = 'radial-gradient(100% 50%, '+bgColor[0].hex()+', '+bgColor[1].hex()+' 100%)';
  }, 100);
  //https://github.com/xem/pack01/blob/d04804937976d25cb3e139fac0a795a8468e41f8/0-1k.src.html
  /* StarField by p01 (http://www.p01.org/starfield/) */
  O=setInterval("m='';c=Math.cos;for(o=0;o<65;)m+='<p style=position:absolute;top:'+(50+(z=399/(73-(++o+O++&63)))*c(o*.9))+'%;left:'+(50+z*c(o))+(z>>4?'%>.':'%;color:#456>.');$0('.starsfield', $id('game_screen')).innerHTML=m",50);
  }
});
}).call(this);