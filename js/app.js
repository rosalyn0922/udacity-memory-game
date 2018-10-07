/*
 * Create a list that holds all of your cards
 */

/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */

var numberOfMoves = 0
var matchedCards = []
var openCard = null
var movesTotal = document.querySelector('.moves')
var container = document.querySelector('.game-container')
var bestScoreContent = document.querySelector('.best-score')
var scoreTimeContent = document.querySelector('.score-time')
var elapsedTimeInSecContent = document.getElementById('elapsedTimeInSeconds')
var elapsedTimeInMinContent = document.getElementById('elapsedTimeInMinutes')
var elapsedTimeInSeconds = 0
var elapsedTimeInMinutes = 0
var timelimitInMinutes = 1
var intervalFunction = null
var bestScore = 0
var bestScoreTime = 0
var ultimateScore = 12

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle (array) {
  var currentIndex = array.length
  var temporaryValue
  var randomIndex

  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex)
    currentIndex -= 1
    temporaryValue = array[currentIndex]
    array[currentIndex] = array[randomIndex]
    array[randomIndex] = temporaryValue
  }

  return array
}

function determineStarRating () {
  // Formula: Ultimate Move / Best Move + Ultimate Move * 100 %
  // Each star is equivalent to 20%

  if (bestScore <= ultimateScore) {
    return 5
  } else {
    var scorePercent = (ultimateScore / (bestScore + ultimateScore)) * 100
    var starEquivalent = Math.round(scorePercent) / 20

    return Math.abs(starEquivalent)
  }
}

function generateStars (totalStars) {
  var starsFragment = document.createDocumentFragment('div')
  var liStars = document.createElement('li')
  var iStars = document.createElement('i')
  iStars.setAttribute('class', 'fa fa-star')

  for (let index = 0; index < totalStars; index++) {
    var star = iStars.cloneNode(true)

    liStars.appendChild(star)
  }

  starsFragment.appendChild(liStars)

  // clear stars
  var starContainer = document.querySelector('.stars')
  starContainer.innerHTML = ''
  starContainer.appendChild(starsFragment)
}

function toggleElement (element) {
  var parentElement = element.parentElement

  if (element.nodeName === 'LI') {
    element.classList.toggle('open')
    element.classList.toggle('show')
  } else {
    parentElement.classList.toggle('open')
    parentElement.classList.toggle('show')
  }
}

function closeElement (element) {
  var parentElement = element.parentElement

  if (element.nodeName === 'LI') {
    element.classList.remove('open')
    element.classList.remove('show')
  } else {
    parentElement.classList.remove('open')
    parentElement.classList.remove('show')
  }
}

function isMatchingSymbol (targetElement, openCard) {
  var elementToMatch = targetElement.childNodes[0].classList.value
  var childList = openCard.childNodes[0].classList.value

  // To keep this simple, assuming only one single list for each list item
  return elementToMatch === childList
}

function setMatchedCard (element, matchedCard) {
  matchedCards.push(element)
  element.removeEventListener('click', handleSymbolClick)
  matchedCard.removeEventListener('click', handleSymbolClick)
  openCard = null
}

var handleSymbolClick = function onSymbolClick (event) {
  var element = event.target
  toggleElement(element)

  event.preventDefault()
  event.stopPropagation()
  setTimeout(function () {
    if (openCard !== null) {
      // check if it matches currently open card
      if (isMatchingSymbol(element, openCard)) {
        setMatchedCard(element, openCard)

        // Check if the user is a winner
        if (matchedCards.length === 8) {
          elapseTimeFormatSeconds = (elapsedTimeInSeconds % 60 > 9 ? '' : '0') + (elapsedTimeInSeconds % 60).toString()
          elapseTimeFormatMinutes = (parseInt(elapsedTimeInSeconds / 60) > 9 ? '' : '0') + (parseInt(elapsedTimeInSeconds / 60)).toString()
          completionTime = elapseTimeFormatMinutes + ':' + elapseTimeFormatSeconds

          bestScore = numberOfMoves
          bestScoreTime = completionTime

          // Add best score and time in page. Time to beat
          bestScoreContent.textContent = bestScore
          scoreTimeContent.textContent = bestScoreTime

          var starRating = determineStarRating()
          var message = ('Congratulations, You are a winner. You have completed the game in ' + completionTime + ' with a total moves of ' + numberOfMoves + '. You have earned ' + starRating + ' star(s). Way to go!!!')

          generateStars(starRating)
          alert(message)

          // Now clear everything
          reset()
          clearInterval(intervalFunction)
          // end the game prematurely
          return message
        }
      } else {
        // if they don't match, reset last two elements clicked open
        closeElement(element)
        closeElement(openCard)
        openCard = null
      }

      numberOfMoves++
      movesTotal.textContent = numberOfMoves
    } else {
      // if there is no open Card then assign to open card
      openCard = element
    }
  }, 1000)
}

/**
 * Create a symbol function
 * @param {object} container Card Container
 * @param {object} icon Main Font Icon Container, see FontAwesome for a list of symbols
 * @param {string} symbol The actual symbol to append
 * @param {int} key Main numeric integer
 * @returns {object} symbol created
 */
function createSymbol (container, icon, symbol, key) {
  var symbolCard = container.cloneNode(true)
  var symbolIcon = icon.cloneNode(true)
  symbolIcon.setAttribute('class', 'fa ' + symbol)
  symbolCard.setAttribute('id', Math.random() * (key + 1))
  symbolCard.appendChild(symbolIcon)
  symbolCard.addEventListener('click', handleSymbolClick)

  return symbolCard
}

/**
 * Initialize Card Symbols. Create container and card element and attach to a document fragment
 * @param {array} symbols Array of symbols
 * @returns {object} Deck Container
 */
function initSymbolElements (symbols) {
  var deckContainer = document.createDocumentFragment('div')
  var cardDeck = document.createElement('ul')
  var cardContainer = document.createElement('li')
  var iconImage = document.createElement('i')
  var listSymbols = []

  cardDeck.setAttribute('class', 'deck')
  cardContainer.setAttribute('class', 'card')

  // Repeat to create a duplicate symbol
  for (let index = 0; index < 2; index++) {
    for (let [index, symbol] of symbols.entries()) {
      listSymbols.push(createSymbol(cardContainer, iconImage, symbol, index))
    }
  }

  // Randomize array and append to Deck Container
  const shuffledSymbols = shuffle(listSymbols)

  for (const symbol of shuffledSymbols) {
    cardDeck.appendChild(symbol)
  }

  return deckContainer.appendChild(cardDeck)
}

/**
 * Get all opened cards and toggle it to close
 */
function resetCards () {
  var openedCards = document.getElementsByClassName('card open show')

  while (openedCards.length > 0) {
    const card = openedCards[0]
    toggleElement(card)
    openedCards = document.getElementsByClassName('card open show')
  }
}

function reset () {
  matchedCards = []
  openCard = null
  numberOfMoves = 0
  movesTotal.textContent = numberOfMoves
  resetCards()
  elapsedTimeInSeconds = 0
  elapsedTimeInMinutes = 0
  elapsedTimeInSecContent.textContent = '00'
  elapsedTimeInMinContent.textContent = '00'
}

/**
 * Starts a new game, remove deck and reinitialize and randomize symbols
 */
function newGame () {
  matchedCards = []
  openCard = null
  numberOfMoves = 0
  movesTotal.textContent = numberOfMoves
  // reshuffles card
  container.querySelector('.deck').remove()
  initializeAndShuffleSymbols()
  elapsedTimeInSeconds = 0
  elapsedTimeInMinutes = 0
  elapsedTimeInSecContent.textContent = '00'
  elapsedTimeInMinContent.textContent = '00'

  startGame()
}

function initializeAndShuffleSymbols () {
  var allSymbols = [
    'fa-diamond',
    'fa-paper-plane-o',
    'fa-anchor',
    'fa-cube',
    'fa-bolt',
    'fa-leaf',
    'fa-bicycle',
    'fa-bomb' ]

  // 1. Get all the symbols and shuffle
  const deckFragment = initSymbolElements(allSymbols)
  // 2. Append
  container.appendChild(deckFragment)
}

/**
 * Start the game by initiating an interval based on timelimitInMinutes
 */
function startGame () {
  intervalFunction = setInterval(function () {
    elapsedTimeInSeconds++
    elapsedTimeInMinutes = parseInt(elapsedTimeInSeconds / 60)
    elapseTimeFormatSeconds = (elapsedTimeInSeconds % 60 > 9 ? '' : '0') + (elapsedTimeInSeconds % 60).toString()
    elapseTimeFormatMinutes = (parseInt(elapsedTimeInSeconds / 60) > 9 ? '' : '0') + (parseInt(elapsedTimeInSeconds / 60)).toString()

    if (elapsedTimeInMinutes === timelimitInMinutes) {
      elapsedTimeInSecContent.textContent = elapseTimeFormatSeconds
      elapsedTimeInMinutes.textContent = elapseTimeFormatMinutes

      clearInterval(intervalFunction)
      alert('Time is up!!!!')
    } else {
      elapsedTimeInSecContent.textContent = elapseTimeFormatSeconds
      elapsedTimeInMinutes.textContent = elapseTimeFormatMinutes
    }
  }, 1000)
}

document.addEventListener('DOMContentLoaded', function () {
  initializeAndShuffleSymbols()

  var restart = document.querySelector('.restart')
  restart.addEventListener('click', reset)
})
