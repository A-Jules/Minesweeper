import {tile} from "./playfield";
import {minepics, showTile, trueTarget, Handler, extracted, mineCounter, data, Scheduler, timer, gamestart,detectIE} from "./utils";
let {MineCheck, MineFlag, renderIT, REVEALED, MINES, FIELD, HighlightStart, HighlightEnd, UnHighlight} = extracted();

export class minefield {

  onclick(smiley, evt) {

    evt.preventDefault();

    gamestart.start();

    let el = trueTarget(evt);

    var [y, x] = el.id.split("-");



    if (!data.get(REVEALED).includes(el.id)) {

      this[renderIT] = this.render.bind(this, showTile, data.get(FIELD));

      if (data.get(FIELD)[y][x].IsMine()) {

        data.get(MINES).map(function(mine) {
          return el.parentElement.parentElement.parentElement.getElementById(mine);
        }).map(function(mine) {
          mine.setAttribute('href', `${minepics}#Minesweeper_mine`);
        });

        Handler.removeListener(MineCheck);
        Handler.removeListener(MineFlag);
        Handler.removeListener(HighlightStart);
        Handler.removeListener(HighlightEnd);
        Handler.removeListener(UnHighlight);
        Scheduler.remove(timer.get(), null);
        return;
      } else if (data.get(FIELD)[y][x].numberOfMines() === 0) {

        this.revealMultiple.call(this, el);

        document.getElementsByTagName('h4')[1].textContent = (data.get(MINES).length - mineCounter.get().length ) > 0 ? data.get(MINES).length - mineCounter.get().length : 0;

      } else {
        data.get(REVEALED).push(el.id);
        this[renderIT](el);

        if (mineCounter.get().sort(function(a, b) {
            return a > b;
          }).equals(data.get(MINES).sort(function(a, b) {
            return a > b;
          })) && (data.get(REVEALED).length == ((20 * 20) - 40))) {
          Handler.removeListener(MineCheck);
          Handler.removeListener(MineFlag);
          Handler.removeListener(HighlightStart);
          Handler.removeListener(HighlightEnd);
          Handler.removeListener(UnHighlight);
          Scheduler.remove(timer.get(), null);
          return smiley.id = "cool";
        }
      }

    }


  }

  revealMultiple(el) {
    data.get(REVEALED).push(el.id);
    this[renderIT](el);

    function getall(matrix, el) {

      let [y, x] = el.split("-");
      var toShow = matrix[y][x].neighborTiles();

      return toShow.filter(function(current) {
        let [y, x] = current;
        return ((0 <= (parseInt(x, 10))) && ((parseInt(x, 10)) <= 95)) && ( 0 <= (parseInt(y, 10))) && (((parseInt(y, 10)) <= 95));
      }).filter(function(current) {
        let [y, x] = current;
        return !data.get(REVEALED).includes(`${+x / 5}-${+y / 5}`);
      }).map(function(current) {
        let [y, x] = current;
        data.get(REVEALED).push(`${+x / 5}-${+y / 5}`);

        return `${+x / 5}-${+y / 5}`
      });
    }

    function sho(info, perimeter) {
      var well = function(el) {
        return bound(el)
      };

      var zeros = perimeter.filter(function(el) {
        let [y, x] = el.split("-");
        return info[y][x].numberOfMines() === 0;
      }).map(well.bind(this)).map(bindto.bind(null, info));

    };

    var bound = getall.bind(this, data.get(FIELD));

    var shown = bound(el.id);

    var bindto = sho.bind(this);

    bindto(data.get(FIELD), shown);

    data.get(REVEALED).map(function(cell) {
      return el.parentElement.parentElement.parentElement.getElementById(cell);
    }).map(this[renderIT]);

  }

  oncontextmenu(smiley, evt) {
    evt.preventDefault();

    let el = trueTarget(evt);

    if (data.get(REVEALED).includes(el.id)) {
      return 0;
    }

    let background = mineCounter.update(el.id) ? `${minepics}#Minesweeper_flag` : `${minepics}#Minesweeper_unopened_square`;

    el.removeAttribute("href");

    el.setAttribute("href", background);

    console.log(mineCounter.get().sort(function(a, b) {
      return a > b;
    }));
    console.log(data.get(MINES).sort(function(a, b) {
      return a > b;
    }));

    if (mineCounter.get().sort(function(a, b) {
        return a > b;
      }).equals(data.get(MINES).sort(function(a, b) {
        return a > b;
      })) && (data.get(REVEALED).length == ((20 * 20) - 40))) {
      Handler.removeListener(MineCheck);
      Handler.removeListener(MineFlag);
      Handler.removeListener(HighlightStart);
      Handler.removeListener(HighlightEnd);
      Handler.removeListener(UnHighlight);
      Scheduler.remove(timer.get(), null);
      document.getElementsByTagName('h4')[1].textContent = (data.get(MINES).length - mineCounter.get().length ) > 0 ? data.get(MINES).length - mineCounter.get().length : 0;
      return smiley.id = "cool";
    }
    document.getElementsByTagName('h4')[1].textContent = (data.get(MINES).length - mineCounter.get().length ) > 0 ? data.get(MINES).length - mineCounter.get().length : 0;
  }

  render(showTile, field, el) {

    if (mineCounter.get().includes(el.id)) {
      mineCounter.update(el.id);
    }

    if (!data.get(MINES).includes(el.id)) {
      let [y, x] = el.id.split("-");
      const background = showTile(field[y][x].numberOfMines());
      el.removeAttribute("href");
      el.setAttribute('href', `${background}`);
    }

  }

  selectMines(minefield, amount) {

    let randomArray = [].concat.apply([], Array.apply(null, Array(20)).map(function(_, y) {
      return Array.apply(null, Array(20)).map(function(_, x) {
        return [y, x]
      })
    })).sort(function() {
      return Math.random() - 0.5
    }).sort(function() {
      return Math.random() - 0.5
    });

    randomArray = randomArray.slice(0, amount);

    function setMineNumber(info, mine) {

      return mine.neighborTiles().map(function(current) {
        let [y, x] = current;

        if (((0 <= (parseInt(x, 10))) && ((parseInt(x, 10)) <= 95)) && ( 0 <= (parseInt(y, 10))) && (((parseInt(y, 10)) <= 95))) {

          info[+x / 5][+y / 5].incrementMines();
        }
      });
    }

    var numberMines = setMineNumber.bind(this, minefield);

    var mines = randomArray.map(function(mine) {
      let [x, y] = mine;
      minefield[x][y].setmine();
      return minefield[x][y];
    });

    mines.map(numberMines);

    return mines;
  }

  mouseDown(smiley, evt) {
    let el = trueTarget(evt);

    if (el.getAttribute("href") === `${minepics}#Minesweeper_unopened_square`) {
      function doSomething(e) {
        var rightclick;
        if (!e) var e = window.event;
        if (e.which) rightclick = (e.which == 3);
        else if (e.button) rightclick = (e.button == 2);
        return rightclick;
      }

      if (doSomething(evt)) {
        return void 0;
      }

      var [y, x] = el.id.split("-");

      if (data.get(REVEALED).includes(el.id)) {
        return void 0;
      }

      el.style.opacity = "0.2";

      return smiley.id = "surprised";
    }
  }

  mouseUp(smiley, evt) {

    function doSomething(e) {
      var rightclick;
      if (!e) var e = window.event;
      if (e.which) rightclick = (e.which == 3);
      else if (e.button) rightclick = (e.button == 2);
      return rightclick;
    }

    smiley.id = "smiley-face";

    let el = trueTarget(evt);
    if (el.style.opacity == 0.2) {

      if (data.get(REVEALED).includes(el.id)) {
        return void 0;
      }

      el.style.opacity = "1";

      var [y, x] = el.id.split("-");

      if (!doSomething(evt)) {
        if(detectIE()){
          this.onclick(smiley,evt);
        }
        if (data.get(FIELD)[y][x].IsMine()) {
          return smiley.id = "dead";
        }else {
          if(detectIE()){

            this.oncontextmenu(smiley,evt);

          }
        }
      }
    }
  }

  mouseOut(evt) {
    let el = trueTarget(evt);
    el.style.opacity = "1";
  };

  renderfield(field) {

    let m = 40;

    document.getElementsByTagName('h4')[1].textContent = m;

    data.get(FIELD).map(function(rows) {
      rows.map(function(cell) {
        let xmlns = "http://www.w3.org/2000/svg";
        let el = document.createElementNS(xmlns, "use");

        Object.keys(cell).forEach(function(attribute) {
          el.setAttribute(`${attribute}`, `${cell[attribute]}`);
        });

        let box = document.createElementNS(xmlns, "g");
        box.appendChild(el);
        return field.appendChild(box);
      })
    });

    REVEALED = data.init(Array.apply(null, Array(0)));
    MINES = data.init(this.selectMines.call(this, data.get(FIELD), m).map(el => el.id));

    var smiley = document.getElementsByClassName("smile")[0];


    let clicked = this.onclick.bind(this, smiley);
    let rightClicked = this.oncontextmenu.bind(this, smiley);
    let mousedown = this.mouseDown.bind(this, smiley);
    let mouseup = this.mouseUp.bind(this, smiley);
    let mouseout = this.mouseOut.bind(this);

    MineCheck = Handler.addListener(field, 'click', clicked, false);
    MineFlag = Handler.addListener(field, 'contextmenu', rightClicked, false);
    HighlightStart = Handler.addListener(field, 'mousedown', mousedown, false);
    HighlightEnd = Handler.addListener(field, 'mouseup', mouseup, false);
    UnHighlight = Handler.addListener(field, 'mouseout', mouseout, false);

  }

  constructor(height, width, field) {
    FIELD = data.init(Array.apply(null, Array(height)).map(function(_, y) {
      return Array.apply(null, Array(width)).map(function(_, x) {
        return new tile(x, y);
      })
    }));
    this.renderfield(field);
  }
}