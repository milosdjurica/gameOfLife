let canvas = document.querySelector('canvas')
let ctx = canvas.getContext('2d')

let startStopButton = document.querySelector('.start-stop')
let stepButton = document.querySelector('.step')
let clearButton = document.querySelector('.clear')
let speedButton = document.querySelector('.speed')
let slowButton = document.querySelector('.slow')
let saveButton = document.querySelector('.save')
let loadButton = document.querySelector('.load')


startStopButton.addEventListener('click', playGame)
stepButton.addEventListener('click', step)
clearButton.addEventListener('click', handleClearRandomizeButton)
speedButton.addEventListener('click', speedUp)
slowButton.addEventListener('click', slowDown)
saveButton.addEventListener('click', savePattern)
loadButton.addEventListener('click', loadPattern)


let resolution = 10
canvas.width = 500
canvas.height = 500

let cols = canvas.width / resolution
let rows = canvas.height / resolution




let interval
let speed = 1000
let isPlaying = false
let isCleared = false



let grid = createRandomizedGrid()
draw(grid)




function savePattern() {
  localStorage.setItem('pattern', grid);
}




function loadPattern() {
  let saved = localStorage.getItem('pattern');
  arr = Array.from(saved.split(','))
  let arrIndex = 0

  grid = new Array(cols).fill(null)
    .map(() => new Array(rows).fill(0))

  for (let i = 0; i < cols; i++) {
    for (let j = 0; j < rows; j++) {
      grid[i][j] = Number(arr[arrIndex])
      arrIndex++
    }
  }

  // stop game to see loaded grid, and reset start/stop button
  draw(grid)

  if (isCleared) {
    isCleared = false
    clearButton.innerText = "Clear"
    clearButton.classList.add("btn-dark")
    clearButton.classList.remove("btn-light")
  }

  isPlaying = true
  playGame()
}



function createRandomizedGrid() {
  // fill null because otherwise cant iterate over array
  return new Array(cols).fill(null)
    .map(() => new Array(rows).fill(0)
      .map(() => Math.floor(Math.random() * 2)))
}




function draw(grid) {
  for (let col = 0; col < cols; col++) {
    for (let row = 0; row < rows; row++) {
      let cell = grid[col][row]

      ctx.beginPath()
      // x position, y position, width, height
      ctx.rect(col * resolution, row * resolution, resolution, resolution)

      // give it a color
      ctx.fillStyle = cell ? 'white' : 'black'
      ctx.fill()
      // make border for each of cells
      ctx.stroke()
    }
  }
}



function nextGen(grid) {
  let copy = grid.map(arr => [...arr])
  for (let col = 0; col < grid.length; col++) {
    for (let row = 0; row < grid[col].length; row++) {
      let cell = grid[col][row]
      let numNeighbour = countNeighbours(col, row, grid)

      // rules
      if (cell === 1 && numNeighbour < 2) {
        copy[col][row] = 0
      } else if (cell === 1 && numNeighbour > 3) {
        copy[col][row] = 0
      } else if (cell === 0 && numNeighbour === 3) {
        copy[col][row] = 1
      }
      // otherwise grid doesnt change
    }
  }
  return copy
}


function countNeighbours(col, row, grid) {
  let numNeighbour = 0
  // counting neighbours 
  for (let i = -1; i < 2; i++) {
    for (let j = -1; j < 2; j++) {

      // edges problem
      let xCell = col + i
      let yCell = row + j
      // check if neighbour is in grid and if it is then count value from it
      if (xCell >= 0 && yCell >= 0 && xCell < cols && yCell < rows) {
        let currNeighbour = grid[col + i][row + j]
        numNeighbour += currNeighbour
      }
    }
  }
  // removing cell from its neighbours count
  numNeighbour -= grid[col][row]
  return numNeighbour
}





function playGame() {
  if (isPlaying) {
    clearInterval(interval)
    isPlaying = false
    startStopButton.innerText = "Start"
    startStopButton.classList.add("btn-success")
    startStopButton.classList.remove("btn-danger")
  } else {
    interval = setInterval(step, speed)
    isPlaying = true
    startStopButton.innerText = "Stop"
    startStopButton.classList.add("btn-danger")
    startStopButton.classList.remove("btn-success")
  }
}



function step() {
  grid = nextGen(grid)
  draw(grid)
}



function speedUp() {
  speed = speed / 2
  clearInterval(interval)
  if (isPlaying) {
    interval = setInterval(step, speed)
  }
}


function slowDown() {
  speed = speed * 2
  clearInterval(interval)
  if (isPlaying) {
    interval = setInterval(step, speed)
  }
}




function handleClearRandomizeButton() {
  if (!isCleared) {
    grid = new Array(cols).fill(null)
      .map(() => new Array(rows).fill(0))

    isCleared = true
    draw(grid)

    clearButton.innerText = "Randomize"
    clearButton.classList.add("btn-light")
    clearButton.classList.remove("btn-dark")

  } else {
    grid = createRandomizedGrid()
    isCleared = false
    draw(grid)

    clearButton.innerText = "Clear"
    clearButton.classList.add("btn-dark")
    clearButton.classList.remove("btn-light")
  }
}





