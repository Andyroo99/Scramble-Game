$(document).ready(function() {
  var words = ["about", "after", "again", "below", "could", "every", "first", "found", "great", "house", "large", "learn", "never", "other", "place", "plant", "point", "right", "small", "sound", "spell", "still", "study", "their", "there", "these", "thing", "think", "three", "water", "where", "which", "world", "would", "write", "after", "again", "about", "below", "could", "every", "first", "found", "great", "house", "large", "learn", "never", "other", "place", "plant", "point", "right"]; // Add more words if desired
  var guessesLeft = 3;
  var chosenWord = getRandomWord();
  var scrambledWord = scrambleWord(chosenWord);
  var guessedWords = []; // Array to store the guessed words

  // Display the scrambled word (if it is actually different from the original word)
  if (scrambledWord !== chosenWord) {
    $("#scrambled-word").text("Scrambled Word: " + scrambledWord);
  } else {
    // Retry scrambling if the word is not actually scrambled
    scrambledWord = scrambleWord(chosenWord);
    $("#scrambled-word").text("Scrambled Word: " + scrambledWord);
  }

  // Display the number of letters in the scrambled word
  $("#scrambled-word-length").text("Number of letters: " + scrambledWord.length);

  // Handle the submit button click
  function submitGuess() {
    var guess = $("#guess-input").val().toLowerCase();

    if (guess.length !== scrambledWord.length) {
      // Number of letters does not match
      $("#result").text("Please enter a word with " + scrambledWord.length + " letters.");
      return;
    }

    if (!words.includes(guess)) {
      // Invalid word
      $("#result").text("That word is not on the list.");
      return;
    }

    if (guessedWords.includes(guess)) {
      // Word already guessed
      $("#result").text("You have already guessed that word.");
      return;
    }

    // Remove the "The word is not a valid answer." message if present
    $("#result").text("");

    guessedWords.push(guess); // Add the guessed word to the array

    if (guess === chosenWord) {
      // Correct guess
      var successMessage = "Congratulations! You guessed the word correctly. The word was: <span class='highlight'>" + guess + "</span>";
      $("#result").html(successMessage);
      $("#submit-button").prop("disabled", true);
      $("#guess-input").prop("disabled", true);
    } else {
      // Incorrect guess
      guessesLeft--;

      if (guessesLeft === 0) {
        // No more guesses left
        $("#result").text("Game over. You ran out of guesses. The word was: " + chosenWord);
        $("#submit-button").prop("disabled", true);
        $("#guess-input").prop("disabled", true);
      } else {
        // Display the remaining guesses and the incorrect guess
        $("#guesses-left").text(guessesLeft);
        $("#guesses-list").append("<li>" + guess + "</li>");
      }
    }

    // Clear the input field
    $("#guess-input").val("");
  }

  $("#submit-button").click(submitGuess);

  // Allow Enter key to submit guess
  $("#guess-input").keypress(function(event) {
    if (event.which === 13) {
      submitGuess();
    }
  });

  // Generate a random word from the words array
  function getRandomWord() {
    var randomIndex = Math.floor(Math.random() * words.length);
    return words[randomIndex];
  }

  // Scramble the letters of a word
  function scrambleWord(word) {
    var scrambled = word.split("").sort(function() {
      return 0.5 - Math.random();
    }).join("");
    return scrambled;
  }

  // Dark mode toggle functionality
  $("#dark-mode-toggle").click(function() {
    $("body").toggleClass("dark-mode");
    $("#dark-mode-toggle").toggleClass("btn-dark btn-primary");
    $("#submit-button").toggleClass("btn-dark btn-primary");
  });
});
