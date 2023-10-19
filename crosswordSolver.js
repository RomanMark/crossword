//  * Check if a word can be inserted horizontally in a specific position in the puzzle
//  Puzzle - the current puzzle state
//  word - the word to insert
//  i - the row index of the starting position
//  j - the column index of the starting position
//  true if the word can be inserted horizontally, false otherwise

function checkHorizontal(Puzzle, word, i, j) {
  // Check if the word can fit in the row starting from column j
  if (word.length > Puzzle[i].length - j) return false;

  // Check if the word matches the characters in the row starting from column j
  let substr = Puzzle[i].substring(j, j + word.length);
  for (let k = 0; k < substr.length; k++) {
    if ((/[a-z]/.test(substr[k]) && substr[k] != word[k]) || substr[k] == ".")
      return false;
  }

  // Check if the row has enough space to accommodate the word
  substr = Puzzle[i].substring(j, Puzzle[i].length);
  if (substr.length > word.length) {
    for (let k = word.length; k < substr.length; k++) {
      if (substr[k] == ".") break;
      else return false;
    }
  }
  return true;
}

// * Insert a word vertically in a specific position in the puzzle
// emptyPuzzle - the current puzzle state
// words - the list of remaining words to insert
// i - the row index of the starting position
// j - the column index of the starting position

function checkVertical(Puzzle, word, i, j) {
  // Build a string with the characters in the column starting from row i
  let substr = "";
  for (let k = i; k < Puzzle.length; k++) {
    substr += Puzzle[k][j];
  }

  // Check if the word can fit in the column starting from row i
  if (word.length > substr.length) return false;

  // Check if the word matches the characters in the column starting from row i
  for (let k = 0; k < word.length; k++) {
    if ((/[a-z]/.test(substr[k]) && substr[k] != word[k]) || substr[k] == ".")
      return false;
  }

  // Check if the column has enough space to accommodate the word
  if (substr.length > word.length) {
    for (let k = word.length; k < substr.length; k++) {
      if (substr[k] == ".") break;
      else return false;
    }
  }
  return true;
}

function insertWordHorizontal(Puzzle, words, x, j) {
  // Loop through each word in the list of words to insert
  for (let k = 0; k < words.length; k++) {
    // Check if the current word can be inserted horizontally in the puzzle
    if (checkHorizontal(Puzzle, words[k], x, j)) {
      // If the word can be inserted horizontally, insert it in the puzzle
      // by replacing the corresponding substring in the row
      Puzzle[x] =
        Puzzle[x].substring(0, j) +
        words[k] +
        Puzzle[x].substring(j + words[k].length, Puzzle[x].length);

      // Remove the inserted word from the list of words to insert
      words.splice(k, 1);
      // Decrement the index to account for the removed word
      k -= 1;
      // Exit the loop since we have successfully inserted a word
      break;
    }
  }
}

function insertWordVertical(Puzzle, words, x, j) {
  // Check if each word in the list can fit vertically in the column starting from row i and column j
  for (let k = 0; k < words.length; k++) {
    if (checkVertical(Puzzle, words[k], x, j)) {
      // If the word fits, insert it in the column
      for (let l = x; l - x < words[k].length; l++) {
        Puzzle[l] =
          Puzzle[l].substr(0, j) +
          words[k][l - x] +
          Puzzle[l].substr(j + 1, Puzzle[l].length);
      }
      // Remove the word from the list of remaining words to insert
      words.splice(k, 1);
      k -= 1;
      break;
    }
  }
}

// This function takes in an empty puzzle, a list of words, and starting coordinates (x,y).
function solve(Puzzle, words) {
  // If there are no words to insert or if the starting coordinates are outside the bounds of the puzzle, return the empty puzzle.
  if (words == [] || (0 == Puzzle.length - 1 && 0 == Puzzle[0].length))
    return Puzzle;
  // Create a copy of the empty puzzle.
  let tempPuzzle = [...Puzzle];
  // Loop through each row of the puzzle starting at the given x coordinate.
  for (let x = 0; x < Puzzle.length; x++) {
    // Loop through each column of the row starting at the given y coordinate.
    for (let y = 0; y < Puzzle[0].length; y++) {
      // If the current cell is a numbered cell, try inserting words horizontally and vertically from that cell.
      if (/\d/.test(Puzzle[x][y]) && Puzzle[x][y] > "0") {
        insertWordHorizontal(tempPuzzle, words, x, y);
        insertWordVertical(tempPuzzle, words, x, y);
      }
    }
  }
  // If all words have been inserted, return the filled puzzle. Otherwise, return an error.
  if (words.length === 0) {
    return tempPuzzle;
  } else {
    return ["Error"];
  }
}

function crosswordSolver(Puzzle, words) {
  let canBeSolved = true;
  function err() {
    canBeSolved = false;
    return "Error";
  }
  // Validation checks for input parameters
  if (
    !/^[.\n012]+$/.test(Puzzle) ||
    typeof Puzzle !== "string" ||
    Puzzle === ""
  ) {
    err();
  } else if (
    !Array.isArray(words) ||
    words.some((word) => typeof word !== "string")
  ) {
    err();
  } else if (new Set(words).size !== words.length) {
    err();
  }
  // If all input parameters are valid, solve the puzzle
  if (canBeSolved) {
    wordsCopy = [...words].reverse();
    let output = solve(Puzzle.split("\n"), words).join("\n");
    if (output === "Error") {
      return solve(Puzzle.split("\n"), wordsCopy).join("\n");
    } else {
      return output;
    }
  } else {
    return "Error";
  }
}

const puzzle1 = "2001\n0..0\n1000\n0..0";

const words1 = ["casa", "alan", "ciao", "anta"];

const puzzle2 = `...1...........
  ..1000001000...
  ...0....0......
  .1......0...1..
  .0....100000000
  100000..0...0..
  .0.....1001000.
  .0.1....0.0....
  .10000000.0....
  .0.0......0....
  .0.0.....100...
  ...0......0....
  ..........0....`;

const words2 = [
  "sun",
  "sunglasses",
  "suncream",
  "swimming",
  "bikini",
  "beach",
  "icecream",
  "tan",
  "deckchair",
  "sand",
  "seaside",
  "sandals",
];

const puzzle3 = `..1.1..1...
  10000..1000
  ..0.0..0...
  ..1000000..
  ..0.0..0...
  1000..10000
  ..0.1..0...
  ....0..0...
  ..100000...
  ....0..0...
  ....0......`;

const words3 = [
  "popcorn",
  "fruit",
  "flour",
  "chicken",
  "eggs",
  "vegetables",
  "pasta",
  "pork",
  "steak",
  "cheese",
];

const puzzle4 = `...1...........
  ..1000001000...
  ...0....0......
  .1......0...1..
  .0....100000000
  100000..0...0..
  .0.....1001000.
  .0.1....0.0....
  .10000000.0....
  .0.0......0....
  .0.0.....100...
  ...0......0....
  ..........0....`;

const words4 = [
  "sun",
  "sunglasses",
  "suncream",
  "swimming",
  "bikini",
  "beach",
  "icecream",
  "tan",
  "deckchair",
  "sand",
  "seaside",
  "sandals",
].reverse();

const puzzle5 = "2001\n0..0\n2000\n0..0";

const words5 = ["casa", "alan", "ciao", "anta"];

const puzzle6 = "0001\n0..0\n3000\n0..0";

const words6 = ["casa", "alan", "ciao", "anta"];

const puzzle7 = "2001\n0..0\n1000\n0..0";

const words7 = ["casa", "casa", "ciao", "anta"];

const puzzle8 = "";

const words8 = ["casa", "alan", "ciao", "anta"];

const puzzle9 = 123;

const words9 = ["casa", "alan", "ciao", "anta"];

const puzzle10 = "";

const words10 = 123;

const puzzle11 = "2000\n0...\n0...\n0...";

const words11 = ["abba", "assa"];

const puzzle12 = "2001\n0..0\n1000\n0..0";

const words12 = ["aaab", "aaac", "aaad", "aaae"];

console.log("Test 1:\n" + crosswordSolver(puzzle1, words1) + "\n");
console.log("Test 2:\n" + crosswordSolver(puzzle2, words2) + "\n");
console.log("Test 3:\n" + crosswordSolver(puzzle3, words3) + "\n");
console.log("Test 4:\n" + crosswordSolver(puzzle4, words4) + "\n");
console.log("Test 5:\n" + crosswordSolver(puzzle5, words5) + "\n");
console.log("Test 6:\n" + crosswordSolver(puzzle6, words6) + "\n");
console.log("Test 7:\n" + crosswordSolver(puzzle7, words7) + "\n");
console.log("Test 8:\n" + crosswordSolver(puzzle8, words8) + "\n");
console.log("Test 9:\n" + crosswordSolver(puzzle9, words9) + "\n");
console.log("Test 10:\n" + crosswordSolver(puzzle10, words10) + "\n");
console.log("Test 11:\n" + crosswordSolver(puzzle11, words11) + "\n");
console.log("Test 12:\n" + crosswordSolver(puzzle12, words12) + "\n");
