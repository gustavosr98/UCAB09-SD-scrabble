<template>
  <div v-if="loading" id="loader" class="d-flex justify-content-center loader">
    <v-progress-circular class="loader-dots" size="70" indeterminate color="primary"></v-progress-circular>
  </div>

  <v-container v-else >      
      <div>
        <v-row v-for="(row,i) in board" :key="i" class="row-justify">
          <div v-for="(cell, j) in board[i]" :key="i*15+j" @click="onBoardClick(i, j)">
            <v-avatar size="45" tile class="cell border-letter" :class="{
              'selected': cell.selected,
              'pending': cell == selectedBoardCell,
              'locked': cell.isLocked,
              'normal-letter': cell.effect!=EFFECTS.START && cell.effect!=EFFECTS.TRIPLE_WORD && cell.effect!=EFFECTS.TRIPLE_LETTER && cell.effect!=EFFECTS.DOUBLE_WORD && cell.effect!=EFFECTS.DOUBLE_LETTER,
              'start-cell': cell.effect==EFFECTS.START,
              'triple-word': cell.effect==EFFECTS.TRIPLE_WORD,
              'triple-letter': cell.effect==EFFECTS.TRIPLE_LETTER,
              'double-word': cell.effect==EFFECTS.DOUBLE_WORD,
              'double-letter': cell.effect==EFFECTS.DOUBLE_LETTER}"
            >
              <span>
                {{board[i][j].content}}
              </span>
            </v-avatar>
          </div>
        </v-row>
        <br/>
        <br/>
        <v-row class="row-justify">
          <v-avatar size="72" tile class="cell default hand mx-2"  
            @click="onHandClick(0, i)"
            v-for="(letter, i) in players[0].hand"
            :key="i"
            :class="{'locked': (currentPlayer != players[0]), 'pending': (currentPlayer == players[0]) && i == selectedHandIndex}"
          >
            <span>
              {{letter}}
            </span>
            <sub>
              {{letters[letter].score}}
            </sub>
          </v-avatar>
        </v-row>
      </div>
      
    <button @click="cancel()">Clear</button>
    <button @click="validate()">Validate</button>
  </v-container>
</template>

<script>
import _ from "lodash";
import {LETTERS_DESTRIBUTION, BOARD_SPECIAL_CASES, EMPTY_CELL, W3, L3, W2, L2, SS, N0} from "@/config/constants.js";

let checkWord = require('check-if-word');
let WORDS = checkWord('es');
 


export default {
  name: "board",
  data: () => ({
    EFFECTS: {
      DOUBLE_LETTER: L2,
      DOUBLE_WORD: W2,
      TRIPLE_LETTER: L3,
      TRIPLE_WORD: W3,
      START: SS
    },
    loading: true,
    board: [],
    lettersDeck: [],
    waiting: false,
    players: [
      {
        name: "Player 1",
        hand: [],
        score: 0
      },
      {
        name: "Player 2",
        hand: [],
        score: 0
      }
    ],
    wordsDict: [],
    letters: LETTERS_DESTRIBUTION,
    currentPlayer: null,
    selectedBoardCell: null,
    selectedHandIndex: -1
  }),
  methods: {
    applyToBoard(f) {
      this.board.forEach(v => v.forEach(f));
    },
    addLetters(letters){
      for (let letter of letters){
        this.board[letter.i][letter.j].content= letter.content;
        this.board[letter.i][letter.j].isLocked= true;
      }
    },
    hasAdjacentCell(cell) {
      // Up
      return (
        (cell.i > 0 && this.board[cell.i - 1][cell.j].isLocked) ||
        // Down
        (cell.i < this.board.length - 1 &&
          this.board[cell.i + 1][cell.j].isLocked) ||
        // Left
        (cell.j > 0 && this.board[cell.i][cell.j - 1].isLocked) ||
        // Right
        (cell.j < this.board[cell.i].length - 1 &&
          this.board[cell.i][cell.j + 1].isLocked)
      );
    },
    getSelectedCells() {
      var selectedCells = [];

      this.applyToBoard(cell => {
        if (cell.selected && cell.content != EMPTY_CELL) {
          selectedCells.push(cell);
        }
      });
      return selectedCells;
    },
    getSelectedCellsAlignement(selectedCells) {
      console.log(selectedCells.some(cell => this.board[cell.i][cell.j].effect == this.EFFECTS.START))
      if (
        !selectedCells.some(cell => this.board[cell.i][cell.j].effect ==
          this.EFFECTS.START) &&
        !selectedCells.some(cell => this.hasAdjacentCell(cell))
      )
        return false;

      const isHorizontal = (cell, j) =>
        (j == 0 || this.board[cell.i][cell.j - 1].content != EMPTY_CELL) &&
        cell.i == selectedCells[0].i;

      const isVertical = (cell, i) =>
        (i == 0 || this.board[cell.i - 1][cell.j].content != EMPTY_CELL) &&
        cell.j == selectedCells[0].j;

      return selectedCells.every(isHorizontal)
        ? "horizontal"
        : selectedCells.every(isVertical)
        ? "vertical"
        : false;
    },
    _getVerticalWord(cell, board) {
      // move all way up
      const j = cell.j;
      let i = cell.i;
      let word = "";
      while (i > 0 && board[i][j].content != EMPTY_CELL) i--;
      // move back down
      i++;
      while (i < board.length && board[i][j].content != EMPTY_CELL) {
        word += board[i][j].content;
        i++;
      }

      return word;
    },
    _getHorizontalWord(cell, board) {
      // move all way left
      const i = cell.i;
      let j = cell.j;
      let word = "";
      while (j > 0 && board[i][j].content != EMPTY_CELL) j--;
      // move back right
      j++;
      while (j < board[i].length && board[i][j].content != EMPTY_CELL) {
        word += board[i][j].content;
        j++;
      }

      return word;
    },
    getFormedWords(selectedCells, direction, board) {
      // Get Direction
      let words = [];
      // add the main word
      let word =
        direction == "horizontal"
          ? this._getHorizontalWord(selectedCells[0], board)
          : this._getVerticalWord(selectedCells[0], board);
      if (word.length > 1) words.push(word);

      // Add other words
      for (let cell of selectedCells) {
        word =
          direction == "horizontal"
            ? this._getVerticalWord(cell, board)
            : this._getHorizontalWord(cell, board);
        if (word.length > 1) words.push(word);
      }

      return words;
    },
    validate() {
      
      let selectedCells = this.getSelectedCells();
      let direction = this.getSelectedCellsAlignement(selectedCells);
      let isAligned = direction == "horizontal" || direction == "vertical";
      let words = isAligned
        ? this.getFormedWords(selectedCells, direction, this.board)
        : [];
      
      let isWordValid = words.every(
        word =>   WORDS.check(word.toLowerCase())
      );

      console.log(direction, isAligned, words);
      if (isAligned && isWordValid) {
        this.applyToBoard(cell => {
          if (cell.selected && cell.content != EMPTY_CELL) {
            cell.isLocked = true;
            cell.selected = false;
          }
        });

        this.computeScore(words, selectedCells);

        this.nextTurn();
        this.fillHands();
      } else {
        this.cancel();
      }
    },
    computeScore(words, selectedCells) {
      let score = 0;
      for (let word of words)
        for (let letter of word) score += LETTERS_DESTRIBUTION[letter].score;

      // Apply letter effects
      for (let cell of selectedCells) {
        switch (cell.effect) {
          case this.EFFECTS.DOUBLE_LETTER:
            score += LETTERS_DESTRIBUTION[cell.content].score;
            break;
          case this.EFFECTS.TRIPLE_LETTER:
            score += LETTERS_DESTRIBUTION[cell.content].score * 2;
            break;
        }
      }

      // Apply Words effects
      for (let cell of selectedCells) {
        switch (cell.effect) {
          case this.EFFECTS.START:
          case this.EFFECTS.DOUBLE_WORD:
            score += words[0]
              .split("")
              .map(letter => LETTERS_DESTRIBUTION[letter].score)
              .reduce((p, v) => p + v);
            break;
          case this.EFFECTS.TRIPLE_WORD:
            score +=
              2 *
              words[0]
                .split("")
                .map(letter => LETTERS_DESTRIBUTION[letter].score)
                .reduce((p, v) => p + v);
            break;
        }
      }
      this.currentPlayer.score += score;
    },
    nextTurn() {
      this.currentPlayer =
        this.currentPlayer == this.players[0]
          ? this.players[1]
          : this.players[0];
    },
    cancel() {
      this.selectedBoardCell = null;
      this.waiting = false;
      // Reset Board
      this.applyToBoard(cell => {
        if (cell.selected && cell.content != EMPTY_CELL) {
          this.currentPlayer.hand.push(cell.content);
          cell.content = EMPTY_CELL;
          cell.selected = false;
        }
        cell.selected = false;
      });
    },
    insertLetter() {
      if (this.selectedBoardCell.content != EMPTY_CELL)
        this.currentPlayer.hand.push(this.selectedBoardCell.content);
      this.selectedBoardCell.content = this.currentPlayer.hand[
        this.selectedHandIndex
      ];
      this.currentPlayer.hand.splice(this.selectedHandIndex, 1);
      this.selectedBoardCell = null;
      this.selectedHandIndex = -1;
    },
    onHandClick(playerIndex, i) {
      if (this.players[playerIndex] != this.currentPlayer) return;
      this.selectedHandIndex = i;

      if (this.selectedBoardCell && this.selectedHandIndex > -1)
        this.insertLetter();
    },
    onBoardClick(i, j) {
      
      // Prevent click on locked cells
      if (this.board[i][j].isLocked) return;

      // If Letter already set, put back to hand
      if (
        this.selectedBoardCell &&
        this.board[i][j].selected &&
        this.board[i][j].content != EMPTY_CELL
      ) {
        this.currentPlayer.hand.push(this.board[i][j].content);
        this.board[i][j].content = EMPTY_CELL;
      }

      // If hand is selected, Insert it
      if (this.selectedHandIndex > -1) {
        this.selectedBoardCell = this.board[i][j];
        this.selectedBoardCell.selected = true;

        this.insertLetter();
        return;
      }

      // If a cell is already selected
      if (this.selectedBoardCell) {
        // Remove selection from other cells
        this.selectedBoardCell.selected = false;

        // Undo Selection on empty cells
        if (
          this.board[i][j] == this.selectedBoardCell &&
          this.selectedBoardCell.content == EMPTY_CELL
        ) {
          this.selectedBoardCell = null;
          return;
        }
      }

      // Select the clicked case
      this.selectedBoardCell = this.board[i][j];
      this.selectedBoardCell.selected = true;
    },
    initGameBoard() {
      const getSpecialCaseValue = (i, j) => {
        const key =
          Object.keys(this.EFFECTS).find(
            key => this.EFFECTS[key] == BOARD_SPECIAL_CASES[i][j]
          ) || null;
        return this.EFFECTS[key];
      };

      this.board = Array(15)
        .fill([])
        .map((row, i) =>
          Array(15)
            .fill({})
            .map((col, j) => ({
              i: i,
              j: j,
              content: EMPTY_CELL,
              effect: getSpecialCaseValue(i, j),
              isLocked: false,
              selected: false
            }))
        );
    },
    generateLettersDeck() {
      this.lettersDeck = [];
      console.log(LETTERS_DESTRIBUTION);
      for (let letter in LETTERS_DESTRIBUTION) {
        this.lettersDeck = this.lettersDeck.concat(
          Array(LETTERS_DESTRIBUTION[letter].count)
            .fill(" ")
            .map(l => LETTERS_DESTRIBUTION[letter].letter)
        );
      }
      this.lettersDeck = _.shuffle(this.lettersDeck);
    },
    fillHands() {
      for (let player of this.players) {
        while (player.hand.length < 7) player.hand.push(this.lettersDeck.pop());
      }
    }
  },
  beforeMount() {
    this.loading = true;
    this.currentPlayer = this.players[0];
    this.initGameBoard();
    this.generateLettersDeck();
    this.fillHands();
    this.cancel();
    let ans = WORDS.check('thfrow');
     console.log("answer student", ans);
    // this.board[7][7].content = this.lettersDeck.pop();
    // this.board[7][7].isLocked = true;
    this.loading = false;
   /* fetch(`words_dictionary.json`)
      .then(res => res.json())
      .then(res => {
        console.log(res);
        this.wordsDict = res;
        this.loading = false;
      });*/
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang='scss' scoped>
$primary-color: #27ae60;
$cell-size: 24px;

.board-background{
  background-color: #005432
}

.row-justify{
  justify-content: center;
}
.container {
  padding: 0;
  width: 100%;
  height: 100%;
  text-align: center;
  // max-width: 500px;
}
.score-row {
}

.border-letter{
  border: solid 2px black !important;
  &:hover {
      border: 2px solid red !important;
    }
}

.double-letter {
  background-color: rgb(38,205,239);

  &.selected {
    background-color: rgb(177, 255, 255) !important;
  }
}

.hand{
  border-radius: 10px !important;
  &:hover {
      border: 2px solid red !important;
    }
}

.normal-letter {
  background-color: rgb(0,84,50);

  &.selected {
    background-color: rgb(177, 255, 255) !important;
  }
}

.triple-letter {
  background-color: rgb(0,133,231); 
  &.selected {
    background-color: rgb(43, 100, 253)!important;
  }
}

.double-word {
  background-color: rgb(255,167,169);
}

.triple-word {
  background-color: rgb(246,85,90);
  &.selected {
    background-color: rgb(247, 189, 168) !important;
  }
}

.start-cell {
  background-color: rgb(246,85,90);
  &.selected {
    background-color: rgb(255, 94, 73) !important;
  }
}
.pending {
  background-color: #fff;
  border: 2px solid red;
}
.default {
  background-color: rgb(248, 248, 248);
}

.locked {
  background-color: grey;
}
.game {
  display: flex;

  justify-content: space-between;
  width: 100%;
  margin: auto;

  background-color: #fff;

  &-palette {
    list-style-type: none;
    display: flex;
    li {
      display: block;
    }
  }

  &-player-one,
  &-player-two {
    display: flex;
    flex-direction: column;
    margin: auto;
    width: 300px;
    text-align: center;
  }

  &-board {
    display: table;

    .row {
      display: flex;
      border: 1px solid $primary-color;
      justify-content: space-between;
    }
  }

  .cell {
    height: $cell-size;
    line-height: 100%;
    background-color: #2ecc71;
    width: $cell-size;
    font-size: calc(#{$cell-size} + -2px);
    border: 2px solid $primary-color;
    margin: 1px;
    user-select: none;
    cursor: pointer;

    &.double-letter {
      background-color: rgb(0, 255, 255);

      &.selected {
        background-color: rgb(177, 255, 255);
      }
      // &::before {
      //   font-size: 12px;
      //   content: "L2";
      // }
    }

    &.triple-letter {
      background-color: rgb(0, 0, 255);
      // &::before {
      //   font-size: 12px;
      //   content: "L3";
      // }

      &.selected {
        background-color: rgb(43, 100, 253);
      }
    }

    &.double-word {
      background-color: palevioletred;
      // &::before {
      //   font-size: 12px;
      //   content: "W2";
      // }
    }

    &.triple-word {
      background-color: rgb(255, 69, 0) !important;
      // &::before {
      //   font-size: 12px;
      //   content: "W3";
      // }
      &.selected {
        background-color: rgb(247, 189, 168);
      }
    }
    &.start-cell {
      background-color: rgb(255, 30, 0);
      // &::before {
      //   font-size: 12px;
      //   content: "W3";
      // }
      &.selected {
        background-color: rgb(255, 94, 73);
      }
    }

    &.selected {
      background-color: #fff;
      margin: 1px;
    }
    &.pending {
      background-color: #fff;
      border: 2px solid red;

      margin: 1px;
    }

    &:hover {
      margin: 1px;
      border: 2px solid red;
    }

    &.locked {
      background-color: grey;
    }
  }
}
/* LOADER */
.loader {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 10;
  height: 100vh;
  text-align: center;
  width: 100vw;
  background-color: #fff;
  padding-top: 20px;

  &-text {
    position: absolute;
    top: 50%;
    left: 50%;
    -webkit-transform: translateX(-50%) translateY(-50%);
    transform: translateX(-50%) translateY(-50%);
  }

  &-dots {
    width: 100px;
    height: 23.3333333333px;
    position: absolute;
    top: 40%;
    left: 50%;
    -webkit-transform: translateX(-50%) translateY(-50%);
    transform: translateX(-50%) translateY(-50%);
  }

  &-dots-dot {
    will-change: transform;
    height: 23.3333333333px;
    width: 23.3333333333px;
    border-radius: 50%;
    background-color: lightBlue;
    position: absolute;
    -webkit-animation: grow 1s ease-in-out infinite alternate;
    animation: grow 1s ease-in-out infinite alternate;

    &.dot1 {
      left: 0;
      -webkit-transform-origin: 100% 50%;
      transform-origin: 100% 50%;
    }
    &.dot2 {
      left: 50%;
      -webkit-transform: translateX(-50%) scale(1);
      transform: translateX(-50%) scale(1);
      -webkit-animation-delay: 0.33s;
      animation-delay: 0.33s;
    }
    &.dot3 {
      right: 0;
      -webkit-animation-delay: 0.66s;
      animation-delay: 0.66s;
    }
  }
}

@-webkit-keyframes grow {
  to {
    -webkit-transform: translateX(-50%) scale(0);
    transform: translateX(-50%) scale(0);
  }
}

@keyframes grow {
  to {
    -webkit-transform: translateX(-50%) scale(0);
    transform: translateX(-50%) scale(0);
  }
}
</style>
