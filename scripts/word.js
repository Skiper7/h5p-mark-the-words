H5P.MarkTheWords = H5P.MarkTheWords || {};
H5P.MarkTheWords.Word =(function(){
  // CSS Classes for marking words:
  var MISSED_MARK = "h5p-word-missed";
  var CORRECT_MARK = "h5p-word-correct";
  var WRONG_MARK = "h5p-word-wrong";

  /**
   * Class for keeping track of selectable words.
   *
   * @class
   * @param {jQuery} $word
   */
  function Word($word) {
    var self = this;
    H5P.EventDispatcher.call(self);

    var input = $word.text();
    var handledInput = input;

    // Check if word is an answer
    var isAnswer = checkForAnswer();

    // Remove single asterisk and escape double asterisks.
    handleAsterisks();

    var isSelectable = true;

    if (isAnswer) {
      $word.text(handledInput);
    }

    /**
     * Checks if the word is an answer by checking the first, second to last and last character of the word.
     * @private
     * @return {Boolean} Returns true if the word is an answer.
     */
    function checkForAnswer() {
      // Check last and next to last character, in case of punctuations.
      var wordString = removeDoubleAsterisks(input);
      if (wordString.charAt(0) === ('*') && wordString.length > 2) {
        if (wordString.charAt(wordString.length - 1) === ('*')) {
          handledInput = input.slice(1, input.length - 1);
          return true;
        }
        // If punctuation, add the punctuation to the end of the word.
        else if(wordString.charAt(wordString.length - 2) === ('*')) {
          handledInput = input.slice(1, input.length - 2);
          return true;
        }
        return false;
      }
      return false;
    }

    /**
     * Removes double asterisks from string, used to handle input.
     * @private
     * @param {String} wordString The string which will be handled.
     * @results {String} slicedWord Returns a string without double asterisks.
     */
    function removeDoubleAsterisks(wordString) {
      var asteriskIndex = wordString.indexOf('*');
      var slicedWord = wordString;
      while (asteriskIndex !== -1) {
        if (wordString.indexOf('*', asteriskIndex + 1) === asteriskIndex + 1) {
          slicedWord = wordString.slice(0, asteriskIndex) + wordString.slice(asteriskIndex + 2, input.length);
        }
        asteriskIndex = wordString.indexOf('*', asteriskIndex + 1);
      }
      return slicedWord;
    }

    /**
     * Escape double asterisks ** = *, and remove single asterisk.
     * @private
     */
    function handleAsterisks() {
      var asteriskIndex = handledInput.indexOf('*');
      while (asteriskIndex !== -1) {
        handledInput = handledInput.slice(0, asteriskIndex) + handledInput.slice(asteriskIndex + 1, handledInput.length);
        asteriskIndex = handledInput.indexOf('*', asteriskIndex + 1);
      }
    }

    /**
     * Clears all marks from the word.
     * @public
     */
    this.markClear = function () {
      $word.removeClass(MISSED_MARK)
        .removeClass(CORRECT_MARK)
        .removeClass(WRONG_MARK)
        .removeAttr('aria-selected');
    };

    /**
     * Check if the word is correctly marked and style it accordingly.
     * Reveal result
     *
     * @public
     */
    this.markCheck = function () {
      if (this.isSelected()) {
        if (isAnswer) {
          $word.addClass(CORRECT_MARK);
        } else {
          $word.addClass(WRONG_MARK);
        }
      } else if (isAnswer) {
        $word.addClass(MISSED_MARK);
      }
    };

    /**
     * Checks if the word is marked correctly.
     * @public
     * @returns {Boolean} True if the marking is correct.
     */
    this.isCorrect = function () {
      return (isAnswer && this.isSelected());
    };

    /**
     * Checks if the word is marked wrong.
     * @public
     * @returns {Boolean} True if the marking is wrong.
     */
    this.isWrong = function () {
      return (!isAnswer && this.isSelected());
    };

    /**
     * Checks if the word is correct, but has not been marked.
     * @public
     * @returns {Boolean} True if the marking is missed.
     */
    this.isMissed = function () {
      return (isAnswer && !this.isSelected());
    };

    /**
     * Checks if the word is an answer.
     * @public
     * @returns {Boolean} True if the word is an answer.
     */
    this.isAnswer = function () {
      return isAnswer;
    };

    /**
     * Checks if the word is selected.
     * @public
     * @returns {Boolean} True if the word is selected.
     */
    this.isSelected = function () {
      return $word.attr('aria-selected') === 'true';
    };

    /**
     * Sets that the Word is selected
     *
     * @param selected
     */
    this.setSelected = function(){
      $word.attr('aria-selected', true);
    };
  }
  Word.prototype = Object.create(H5P.EventDispatcher.prototype);
  Word.prototype.constructor = Word;

  return Word;
})();