let canvas = document.querySelector('canvas')
let ctx = canvas.getContext('2d')

document.querySelector('.start').addEventListener('click', startGame)
document.querySelector('.stop').addEventListener('click', stopGame)
document.querySelector('.step').addEventListener('click', step)

let resolution = 10
canvas.width = 400
canvas.height = 400

let cols = canvas.width / resolution
let rows = canvas.height / resolution

let grid = createGrid()
draw(grid)

let isStopped = false


function createGrid() {
  // fill da bi moglo da bude iterable
  return new Array(cols).fill(null)
    .map(() => new Array(rows).fill(0)
      .map(() => Math.floor(Math.random() * 2)))
}


function draw(grid) {
  for (let col = 0; col < grid.length; col++) {
    for (let row = 0; row < grid[col].length; row++) {
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
      // no need for else because it stays same
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
  // we counted cell value when we were counting neighbours 10 lines of code above
  numNeighbour -= grid[col][row]
  return numNeighbour
}


function step() {
  grid = nextGen(grid)
  draw(grid)
}



function startGame() {
  if (!isStopped) {
    grid = nextGen(grid)
    draw(grid)
    requestAnimationFrame(startGame)
  }
  isStopped = false
}


function stopGame() {
  isStopped = true
}








