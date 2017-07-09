export const minepics = require('./../../images/minesweeper.svg');

export function showTile(number) {

  switch (number) {
    case 0:
      return `${minepics}#Minesweeper_0`;
      break;
    case 1:
      return `${minepics}#Minesweeper_1`;
      break;
    case 2:
      return `${minepics}#Minesweeper_2`;
      break;
    case 3:
      return `${minepics}#Minesweeper_3`;
      break;
    case 4:
      return `${minepics}#Minesweeper_4`;
      break;
    case 5:
      return `${minepics}#Minesweeper_5`;
      break;
    case 6:
      return `${minepics}#Minesweeper_6`;
      break;
    case 7:
      return `${minepics}#Minesweeper_7`;
      break;
    case 8:
      return `${minepics}#Minesweeper_8`;
      break;
  }
}

export function detectIE() {
    var ua = window.navigator.userAgent;

    var msie = ua.indexOf('MSIE ');
    if (msie > 0) {
      // IE 10 or older => return version number
      return true;
    }

    var trident = ua.indexOf('Trident/');
    if (trident > 0) {
      // IE 11 => return version number
      var rv = ua.indexOf('rv:');
      return true;
    }

    var edge = ua.indexOf('Edge/');
    if (edge > 0) {
      // Edge (IE 12+) => return version number
      return true;
    }

    // other browser
    return false;
  }

export function trueTarget(evt) {
  let target = evt.target || evt.srcElement;
  //Firefox doesn't support SVGElementInstance reference:http://stackoverflow.com/questions/9275695/read-attributes-of-svg-elements-in-html-via-js
  return (target.correspondingUseElement) ? target.correspondingUseElement : target;
}

export const Handler = (function() {
  let i = 1,
    listeners = {};

  return {
    addListener: function(element, event, handler, capture) {
      element.addEventListener(event, handler, capture);
      listeners[i] = {
        element: element,
        event: event,
        handler: handler,
        capture: capture
      };
      return i++;
    },
    removeListener: function(id) {
      if (id in listeners) {
        let h = listeners[id];
        h.element.removeEventListener(h.event, h.handler, h.capture);
        delete listeners[id];
      }
    },
    removeAllListeners: function() {
      Object.keys(listeners).forEach(function(events) {
        listeners[events].element.removeEventListener(listeners[events].event, listeners[events].handler, listeners[events].capture);
        delete listeners[events];
      });
    }
  };
}());

export const data = (function() {
  let i = 1, container = {};

  return {
    init: function(data) {
      container[i] = data;
      return i++;
    },
    get: function(id) {
      return container[id];
    },
    reset: function() {
      Object.keys(container).forEach(function(attribute) {
        delete container[attribute];
      });

      document.getElementsByTagName('h4')[0].textContent = "00:00:00";
    }
  }
}());

export const extracted = () => {
  let MineCheck = Symbol();
  let MineFlag = Symbol();
  let renderIT = void 0;
  let REVEALED = Symbol();
  let MINES = Symbol();
  let FIELD = Symbol();
  let HighlightStart = Symbol();
  let HighlightEnd = Symbol();
  let UnHighlight = Symbol();

  return {
    MineCheck,
    MineFlag,
    renderIT,
    REVEALED,
    MINES,
    FIELD,
    HighlightStart,
    HighlightEnd,
    UnHighlight
  };
};

export const mineCounter = (function() {
  let markedflag = [];

  return {
    update: function(cell) {
      if (markedflag.includes(cell)) {
        markedflag.splice(markedflag.indexOf(cell), 1);
        return false;
      } else {
        markedflag.push(cell);
        return true;
      }
    },
    get:function() {
      return markedflag;
    },
    reset:function() {
      markedflag = [];
    }
  };
}());

export const Scheduler = (function() {
  var tasks = [];
  var minimum = 10;
  var timeoutVar = null;
  var output = {
    add: function(func, context, timer, once) {
      var iTimer = parseInt(timer);
      context = context && typeof context === 'object' ? context : null;
      if (typeof func === 'function' && !isNaN(iTimer) && iTimer > 0) {
        tasks.push([func, context, iTimer, iTimer * minimum, once]);
      }
    },
    remove: function(func, context) {
      for (var i = 0, l = tasks.length; i < l; i++) {
        if (tasks[i][0] === func && (tasks[i][1] === context || tasks[i][1] == null)) {
          tasks.splice(i, 1);
          return;
        }
      }
    },
    halt: function() {
      if (timeoutVar) {
        clearInterval(timeoutVar);
      }
    }
  };
  var schedule = function() {
    for (var i = 0, l = tasks.length; i < l; i++) {
      if (tasks[i] instanceof Array) {
        tasks[i][3] -= minimum;
        if (tasks[i][3] < 0) {
          tasks[i][3] = tasks[i][2] * minimum;
          tasks[i][0].apply(tasks[i][1]);
          if (tasks[i][4]) {
            tasks.splice(i, 1);
          }
        }
      }
    }
  };
  timeoutVar = setInterval(schedule, minimum);
  return output;
}());

export const timer =(function() {
  let time = void 0;

  return{
    set:function(e) {
      time = e;
    },
    get:function() {
      return time;
    }
  }
}());

export const gamestart = (function() {
  let bool = false;
  return{
    start :function() {
      bool = true;
    },get:function(){
      return bool;
    },end:function() {
      bool = false;
    }
  }
}());