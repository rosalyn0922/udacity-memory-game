/*
 * Create a list that holds all of your cards
 */

/*
 * Display the cards on the page
 *   - shuffle the list of cards using the provided "shuffle" method below
 *   - loop through each card and create its HTML
 *   - add each card's HTML to the page
 */

const movesTotal = document.querySelector('.moves')
const gameContainer = document.querySelector('.game-container')
const container = document.querySelector('.game-content')
const bestScoreContent = document.querySelector('.best-score')
const scoreTimeContent = document.querySelector('.score-time')
const elapsedTimeInSecContent = document.getElementById('elapsedTimeInSeconds')
const elapsedTimeInMinContent = document.getElementById('elapsedTimeInMinutes')
const mainBestStar = document.getElementById('main-stars')
const currentStarRating = document.getElementById('current-stars')
const dialogWindow = document.getElementById('completeDialog')
const completionDialogContent = document.getElementById('completion-dialog-content')
const restart = document.querySelector('.restart')
const starRating = [
  { 1: { end: 200, start: 41 } },
  { 2: { end: 40, start: 31 } },
  { 3: { end: 30, start: 21 } },
  { 4: { end: 20, start: 11 } },
  { 5: { end: 10, start: 5 } }
]

let gameStarted = false
let numberOfMoves = 0
let matchedCards = []
let openCard = null
let elapsedTimeInSeconds = 0
let elapsedTimeInMinutes = 0
let timelimitInMinutes = 1
let intervalFunction = null
let bestScore = 0
let bestScoreTime = 0
let ultimateScore = 12
let currentStarScore = 5

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle (array) {
  let currentIndex = array.length
  let temporaryValue
  let randomIndex

  while (currentIndex !== 0) {
    randomIndex = Math.floor(Math.random() * currentIndex)
    currentIndex -= 1
    temporaryValue = array[currentIndex]
    array[currentIndex] = array[randomIndex]
    array[randomIndex] = temporaryValue
  }

  return array
}

/**
 * Check if the current score matches the array list of star Rating recommendations. This will return a numeric value that is the number of stars
 * @param {int} currentScore Numeric Score to determine
 * @returns {int} numericValue
 */
function determineStarRating (currentScore) {
  if (currentScore) {
    if (currentScore >= 5) {
      for (const score of starRating) {
        const key = Object.keys(score)[0]
        if (currentScore >= score[key].start && currentScore <= score[key].end) {
          return key
        }
      }
    }
    return 5
  } else {
    for (const score of starRating) {
      const key = Object.keys(score)[0]
      if (bestScore >= score[key].start && bestScore <= score[key].end) {
        return key
      }
    }
  }
}

/**
 * A reusable function use to generate the stars on the target container
 * @param {int} totalStars number of stars to display
 * @param {object} container actual container
 */
function generateStars (totalStars, container) {
  const starsFragment = document.createDocumentFragment('div')
  const liStars = document.createElement('li')
  const iStars = document.createElement('i')
  iStars.setAttribute('class', 'fa fa-star')

  for (let index = 0; index < totalStars; index++) {
    const star = iStars.cloneNode(true)

    liStars.appendChild(star)
  }

  starsFragment.appendChild(liStars)

  container.innerHTML = ''
  container.appendChild(starsFragment)
}

function toggleElement (element) {
  const parentElement = element.parentElement

  if (element.nodeName === 'LI') {
    element.classList.add('open')
    element.classList.add('show')
  } else {
    parentElement.classList.add('open')
    parentElement.classList.add('show')
  }
}

function closeElement (element) {
  const parentElement = element.parentElement

  if (element.nodeName === 'LI') {
    element.classList.remove('open')
    element.classList.remove('show')
  } else {
    parentElement.classList.remove('open')
    parentElement.classList.remove('show')
  }
}

/**
 * Adds an animation on the stars generated
 * @param {int} score Numeric equivalent score that will be determined later by determining the star rating
 */
function updateCurrentStar (score) {
  const generatedScore = determineStarRating(score)
  if (generatedScore !== currentStarScore) {
    currentStarRating.classList.add('swing')
  }
  currentStarScore = generatedScore
  setTimeout(function () {
    generateStars(generatedScore, currentStarRating)
  }, 1000)

  setTimeout(function () {
    currentStarRating.classList.remove('swing')
  }, 2000)
}

/**
 * Checks if the target Card matches the Currently opened card
 * @param {object} targetElement Element to Match
 * @param {object} openCard Current Open Card
 * @returns {boolean} IsCardMatched
 */
function isMatchingSymbol (targetElement, openCard) {
  const target = targetElement.childNodes[0]
  const open = openCard.childNodes[0]
  const elementToMatch = targetElement.childNodes[0].classList.value
  const childList = openCard.childNodes[0].classList.value

  // To keep this simple, assuming only one single list for each list item
  if (elementToMatch === childList) {
    target.parentElement.classList.add('animated', 'rubberBand')
    open.parentElement.classList.add('animated', 'rubberBand')
  }

  return elementToMatch === childList
}

function setMatchedCard (element, matchedCard) {
  matchedCards.push(element)
  element.removeEventListener('click', handleSymbolClick)
  matchedCard.removeEventListener('click', handleSymbolClick)
  openCard = null
}

/**
 * Main matching logic on every click
 * @param {object} event Event Handler for the actual card clicked
 */
let handleSymbolClick = function onSymbolClick (event) {
  const element = event.target

  if (element.classList.value.indexOf('open') === -1) {
    toggleElement(element)

    if (gameStarted === false) {
      gameStarted = true
      startGame()
    }

    event.preventDefault()
    event.stopPropagation()
    setTimeout(function () {
      if (openCard !== null) {
      // check if it matches currently open card
        if (isMatchingSymbol(element, openCard)) {
          setMatchedCard(element, openCard)

          // Check if the user is a winner
          if (matchedCards.length === 8) {
          // Clear interval first
            clearInterval(intervalFunction)

            elapseTimeFormatSeconds = (elapsedTimeInSeconds % 60 > 9 ? '' : '0') + (elapsedTimeInSeconds % 60).toString()
            elapseTimeFormatMinutes = (parseInt(elapsedTimeInSeconds / 60) > 9 ? '' : '0') + (parseInt(elapsedTimeInSeconds / 60)).toString()
            completionTime = elapseTimeFormatMinutes + ':' + elapseTimeFormatSeconds

            bestScore = numberOfMoves
            bestScoreTime = completionTime

            // Add best score and time in page. Time to beat
            bestScoreContent.textContent = bestScore
            scoreTimeContent.textContent = bestScoreTime
            gameContainer.classList.add('tada')

            const starRating = determineStarRating()
            const message = ('<b>Congratulations!!</b>, You are a winner. You have completed the game in ' + completionTime + ' with a total moves of <b>' + numberOfMoves + '</b>. You have earned ' + starRating + ' star(s). Way to go!!!')
            completionDialogContent.innerHTML = message

            generateStars(starRating, mainBestStar)
            // alert(message)
            $(dialogWindow).modal({ show: true })
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

        updateCurrentStar(numberOfMoves)
      } else {
      // if there is no open Card then assign to open card
        openCard = element
      }
    }, 500)
  }
}

function handleDoubleClick (e) {
  e.preventDefault()
  e.stopPropagation()
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
  const symbolCard = container.cloneNode(true)
  const symbolIcon = icon.cloneNode(true)
  symbolIcon.setAttribute('class', 'fa ' + symbol)
  symbolCard.setAttribute('id', Math.random() * (key + 1))
  symbolCard.appendChild(symbolIcon)
  symbolCard.addEventListener('click', handleSymbolClick)
  symbolCard.addEventListener('doubleclick', handleDoubleClick)

  return symbolCard
}

/**
 * Initialize Card Symbols. Create container and card element and attach to a document fragment
 * @param {array} symbols Array of symbols
 * @returns {object} Deck Container
 */
function initSymbolElements (symbols) {
  const deckContainer = document.createDocumentFragment('div')
  const cardDeck = document.createElement('ul')
  const cardContainer = document.createElement('li')
  const iconImage = document.createElement('i')
  const listSymbols = []

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
  try {
    let openedCards = document.getElementsByClassName('card open show')

    while (openedCards.length > 0) {
      const card = openedCards[0]
      closeElement(card)
      openedCards = document.getElementsByClassName('card open show')
    }
  } catch (error) {
    alert(error)
  }
}

function reset () {
  try {
    matchedCards = []
    openCard = null
    numberOfMoves = 0
    movesTotal.textContent = numberOfMoves
    generateStars(5, currentStarRating)
    resetCards()
    elapsedTimeInSeconds = 0
    elapsedTimeInMinutes = 0
    elapsedTimeInSecContent.textContent = '00'
    elapsedTimeInMinContent.textContent = '00'

    if (intervalFunction) { clearInterval(intervalFunction) }
  } catch (error) {
    alert(error)
  }
}

function newGameAndCloseDialog () {
  closeDialog()
  newGame()
}

function closeDialog () {
  $(dialogWindow).modal('hide')
}

/**
 * Starts a new game, remove deck and reinitialize and randomize symbols
 */
function newGame () {
  reset()

  // reshuffles card
  container.querySelector('.deck').remove()
  initializeAndShuffleSymbols()

  startGame()
}

function initializeAndShuffleSymbols () {
  const allSymbols = [
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
    elapsedTimeInMinutes += parseInt(elapsedTimeInSeconds / 60)
    elapseTimeFormatSeconds = (elapsedTimeInSeconds % 60 > 9 ? '' : '0') + (elapsedTimeInSeconds % 60).toString()
    elapseTimeFormatMinutes = (parseInt(elapsedTimeInSeconds / 60) > 9 ? '' : '0') + (parseInt(elapsedTimeInSeconds / 60)).toString()

    elapsedTimeInSecContent.textContent = elapseTimeFormatSeconds
    elapsedTimeInMinContent.textContent = elapseTimeFormatMinutes
  }, 1000)
}

document.addEventListener('DOMContentLoaded', function () {
  initializeAndShuffleSymbols()
  generateStars(5, currentStarRating)

  restart.addEventListener('click', newGame)
})
