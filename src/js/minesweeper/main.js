import {minefield} from "./minefield";
import {trueTarget, Handler, data, Scheduler, timer, mineCounter,gamestart, detectIE} from "./utils";

export function minesweeper(evt) {
  var el =  trueTarget(evt);

  var svgdoc;

  try {
    svgdoc = el.contentDocument;
  }
  catch (e) {
    try {
      svgdoc = el.getSVGDocument();
    }
    catch (e) {
      alert("SVG in object not supported in your environment");
    }
  }

  var field = svgdoc.getElementById("group1");

  new minefield(20, 20, field);
  var t = this;

  function forceRedraw(element, evt) {
    let el = trueTarget(evt);


    gamestart.end();
    el.id = "smiley-face";
    mineCounter.reset();
    Handler.removeAllListeners();
    Scheduler.remove(example1, null);

    if (detectIE()){
      data.reset();
      while (element.getSVGDocument().getElementById("group1").lastChild) {
        element.getSVGDocument().getElementById("group1").removeChild(element.getSVGDocument().getElementById("group1").lastChild);
      }
      element.getSVGDocument().onload = minesweeper.call(t,null,data);
    }

    if (navigator.userAgent.toLowerCase().indexOf('firefox') > -1) {
      element.contentWindow.location.reload();
    } else {
      var disp = element.style.display;
      element.style.display = 'none';
      var trick = element.offsetHeight;
      element.style.display = disp;
      var c = document.createElement('div');
      c.innerHTML = 'x';
      c.style.visibility = 'hidden';
      c.style.height = '1px';
      document.body.insertBefore(c, element.firstChild);
      /*Scheduler.add(function() {element.removeChild(c)},null, 10,true);
      Scheduler.remove(function() {element.removeChild(c)},null);*/
    }
    if (!detectIE()) {
      data.reset();
    }
  }

  var restart = forceRedraw.bind(null, document.getElementById('minefield'));

  const smile = document.getElementById("smiley-face");

  Handler.addListener(smile, 'click', restart, false);

  let h1 = document.getElementById('mine-counter');
  let seconds = 0, minutes = 0, hours = 0;

  var example1 = function() {
    if(gamestart.get()){
    seconds++;
    if (seconds >= 60) {
      seconds = 0;
      minutes++;
      if (minutes >= 60) {
        minutes = 0;
        hours++;
      }
    }
    h1.textContent = (hours ? (hours > 9 ? hours : "0" + hours) : "00") + ":" + (minutes ? (minutes > 9 ? minutes : "0" + minutes) : "00") + ":" + (seconds > 9 ? seconds : "0" + seconds);
  }

    Scheduler.add(example1, null, 100, true);
  };

  timer.set(example1);

  example1();
}