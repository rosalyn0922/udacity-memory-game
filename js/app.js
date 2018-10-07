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
var container = document.querySelector('.container')

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
  matchedCards.push(matchedCard)
  element.removeEventListener('click', handleSymbolClick)
  matchedCard.removeEventListener('click', handleSymbolClick)
  openCard = null
}

var handleSymbolClick = function onSymbolClick (event) {
  var element = event.target
  toggleElement(element)

  setTimeout(function () {
    if (openCard !== null) {
      // check if it matches currently open card
      if (isMatchingSymbol(element, openCard)) {
        setMatchedCard(element, openCard)
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
  }, 1500)
}

function createSymbol (container, icon, symbol, key) {
  var symbolCard = container.cloneNode(true)
  var symbolIcon = icon.cloneNode(true)
  symbolIcon.setAttribute('class', 'fa ' + symbol)
  symbolCard.setAttribute('id', Math.random() * (key + 1))
  symbolCard.appendChild(symbolIcon)
  symbolCard.addEventListener('click', handleSymbolClick)

  return symbolCard
}

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

function reset () {
  matchedCards = []
  openCard = null
  numberOfMoves = 0
  movesTotal.textContent = numberOfMoves
  // reshuffles card
  container.querySelector('.deck').remove()
  initializeAndShuffleSymbols()
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

/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */

document.addEventListener('DOMContentLoaded', function () {
  initializeAndShuffleSymbols()

  var restart = document.querySelector('.restart')
  restart.addEventListener('click', reset)
})
