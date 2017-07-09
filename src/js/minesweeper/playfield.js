import {minepics} from "./utils";

let mine = Symbol();
let numberOfMines = Symbol();

export class tile {

  constructor(x, y) {
    this.x = `${x * 5}%`;
    this.y = `${y * 5}%`;
    this.width = '25';
    this.height = '25';
    this['z-index'] = '-1';
    this["href"] = `${minepics}#Minesweeper_unopened_square`;
    this.id = `${y}-${x}`;
    this[mine] = false;
    this[numberOfMines] = 0;
  }

  static _neighbors() {
    return [[5, 5], [0, 5], [-5, 5], [5, 0], [-5, 0], [5, -5], [0, -5], [-5, -5]];
  }

  IsMine() {
    return this[mine];
  }

  numberOfMines() {
    return this[numberOfMines];
  }

  incrementMines() {
    return this[numberOfMines] += 1;
  };

  setmine() {
    this[mine] = true;
  };

  neighborTiles() {
    const neighbors = tile._neighbors();

    function getNeighbors(cell, adjustment) {

      let [x1, y1] = adjustment;
      let [x2, y2,] = cell;
      return [((+x1) + (+x2)), ((+y1) + (+y2))];
    }

    return neighbors.map(getNeighbors.bind(this, [this.x.slice(0, -1), this.y.slice(0, -1)]));
  }
}



