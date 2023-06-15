$(document).ready(function() {
  // Load dark mode preference from localStorage
  var darkModeEnabled = localStorage.getItem("darkModeEnabled");
  if (darkModeEnabled === "true") {
    $("body").addClass("dark-mode");
    $("#dark-mode-toggle").addClass("btn-primary").removeClass("btn-dark");
    $("#submit-button").addClass("btn-primary").removeClass("btn-dark");
  }

  // Load words from JSON file
  $.getJSON("words.json", function(data) {
    var words = data.words;
    var guessesLeft = 5;
    var chosenWord = getRandomWord(words);
    var scrambledWord = scrambleWord(chosenWord);

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
    $("#submit-button").click(handleSubmit);

    // Handle enter key press in the input field
    $("#guess-input").keypress(function(event) {
      if (event.which === 13) {
        handleSubmit();
      }
    });

    // Generate a random word from the words array
    function getRandomWord(wordsArray) {
      var randomIndex = Math.floor(Math.random() * wordsArray.length);
      return wordsArray[randomIndex];
    }

    // Scramble the letters of a word
    function scrambleWord(word) {
      var scrambled = word.split("").sort(function() {
        return 0.5 - Math.random();
      }).join("");
      return scrambled;
    }

    // Handle the submission of a guess
    function handleSubmit() {
      var guess = $("#guess-input").val().toLowerCase();

      if (guess.length === 0 || guess.trim() === "") {
        return;
      }

      if (guess.length !== chosenWord.length) {
        $("#result").text("The word is too short or too long.");
        return;
      }

      if (!isValidWord(guess)) {
        $("#result").text("The word is not a valid answer.");
        return;
      }

      if (guess === chosenWord) {
        // Correct guess
        $("#result").text("Congratulations! You guessed the word correctly. The word was: " + guess).addClass("success-message");
        $("#submit-button").prop("disabled", true);
      } else {
        // Incorrect guess
        if (isDuplicateGuess(guess)) {
          $("#result").text("You have already answered that word.");
        } else {
          guessesLeft--;
          if (guessesLeft === 0) {
            // No more guesses left
            $("#result").text("Game over. You ran out of guesses. The word was: " + chosenWord);
            $("#submit-button").prop("disabled", true);
          } else {
            // Display the remaining guesses and the incorrect guess
            $("#guesses-left").text(guessesLeft);
            $("#guesses-list").append("<li>" + formatGuessedWord(guess) + "</li>");
          }
        }
      }

      // Clear the input field
      $("#guess-input").val("");
    }

    // Check if a word is valid (exists in the words array)
    function isValidWord(word) {
      return words.includes(word);
    }

    // Check if the guess is a duplicate
    function isDuplicateGuess(guess) {
      return $("#guesses-list li[data-word='" + guess + "']").length > 0;
    }

    // Format the guessed word with correct and incorrect letter positions
    function formatGuessedWord(guess) {
      var formattedWord = "";
      for (var i = 0; i < guess.length; i++) {
        var letter = guess[i];
        if (letter === chosenWord[i]) {
          formattedWord += "<span class='correct-letter'>" + letter + "</span>";
        } else if (chosenWord.includes(letter)) {
          formattedWord += "<span class='incorrect-position'>" + letter + "</span>";
        } else {
          formattedWord += "<span class='incorrect-letter'>" + letter + "</span>";
        }
      }
      return formattedWord;
    }
  })
  .fail(function() {
    console.log("Failed to load words from JSON file.");
  });

  // Dark mode toggle functionality
  $("#dark-mode-toggle").click(function() {
    $("body").toggleClass("dark-mode");
    $("#dark-mode-toggle").toggleClass("btn-primary btn-dark");
    $("#submit-button").toggleClass("btn-primary btn-dark");
    var darkModeEnabled = $("body").hasClass("dark-mode");
    localStorage.setItem("darkModeEnabled", darkModeEnabled.toString());
  });
});
