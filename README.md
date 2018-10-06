# Udacity Memory Game Project

## Requirements

It's very important that you plan your project before you start writing any code. Break your project down into small pieces of work and plan out your approach to each one. It's much easier to debug and fix an issue if you've only made a small change. It becomes much more difficult if you wait longer to test your code.

Feel free to implement your own design workflow, but if you get stuck -- here are some quick tips to get you up and running!

<ol>
<li> Start by building a grid of cards. After all, the rest of your game's functionality depends on this grid.
<ul>
  <li>How many total pairs of cards would you have?</li>
  <li>Which data structure can you use to store card symbols? How would you iterate (i.e., loop) over this data structure?</li>
  <li>Think about how you can create, say, an unordered list (i.e., bulleted list) in HTML from this structure. Recall some of the tools and methods you've learned to manipulate the DOM:
    <ul> 
      <li>createElement()</li>
      <li>querySelector()</li>
      <li>getElementbyId()</li>
      <li>getElementsByClassName()</li>
      <li>appendChild()</li>
      <li>Document</li>
    </ul>
  </li>
  <li>Are your cards randomly placed onto the grid?</li>
  <li>Figure out the HTML needed to represent a card. Remember, you have to represent two sides of the card, and the symbols are faced down</li>
  <li>How can you use CSS properties like transform or opacity to represent the sides of a card?</li>
</ul>
</li>
<li> Add the functionality to handle clicks. This should reveal the "hidden" side of each card. Clicking on the first card should turn it over, show the symbol, and remain turned over. Clicking on a different card must also turn it over and show the symbol.
</li>
<li> Which event(s) are you listening for?
|- How can that event affect CSS? Hint: what about a new CSS class?
|- Work on the matching logic. How does your game "know" if a player guesses correctly or incorrectly?
</li>
<li> Think about how you can temporarily store the first opened card somewhere. After all, this card needs to be compared to the next card turned over.
|- How can you prevent the user from selecting the same card twice?
|- If the two cards match, they stay turned over
|- If the two cards do not match, they turn back
|- Create the winning condition. How does your game “know” if a player has won?
</li>
<li> Your user should see a modal when the game ends
|- What information can this modal show? See below!
|- Implement additional functionality:
</li>
<li>Move counter. The game should display the number of moves the player has made.
Timer (hint: how does setTimeout() come into play here?). This timer should start when the player starts a game, and end when the player wins the game.
Star rating. The player should begin with a certain number of stars displayed on the screen. The number of moves made during the game should visually decrease this star rating.
Reset button. This should allow the player to reset the entire grid as well as all the above.
We recommend saving most of the styling until the very end. Allow your game logic and functionality to dictate the styling.
</li>
</ol>


## Instructions

- Clone it from [https://github.com/rosalyn0922/udacity-memory-game](here)
- open index.html from a browser

## Author

This is created by Rosalyn Guerrero for the Udacity Memory Game Project.
