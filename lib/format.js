import '//unpkg.com/simplex-noise/simplex-noise.js?module'

// Constants
const canvas = document.querySelector('canvas')
const ctx = canvas.getContext('2d')

const noise = new SimplexNoise()

const scale = 8
const noiseScale = 100
const timeGain = 0.1

// Only odd amounts
const colorAmount = 9
const colorDelta = 1

let cW = ~~(colorAmount / 2)
let cM = colorAmount - cW
let colors = new Array(colorAmount).fill({ r: 0, g: 0, b: 0 })

// Viewport Variables
let width
let height

// Image Variables
let imageData
let buf
let buf8
let data

// Other Variables
let time = 0
let reqId
let frames = 0
let timestamp = Date.now()

// Default gradient
let gradient = makeColorGradient(0.3, 0.3, 0.3, 0, 2, 4, 0.001)

// Stats
let stats = new Stats()
let div = document.createElement('div')
div.classList.add('stats')
div.addEventListener('click', e => div.classList.toggle('open'))
div.appendChild(stats.dom)
document.body.appendChild(div)

// Necessary in some browsers to prevent anti-aliasing screwing with the clean pixels
ctx.imageSmoothingEnabled = false

// Draw loop
function draw () {
  time += timeGain * (Date.now() - timestamp) / 1000
  timestamp = Date.now()

  // Loop through each "cell"
  for (let y = height; y--;) {
    for (let x = width; x--;) {
      // Decide the color based on some good 'ole perlin noise
      let clr = colors[~~(noise.noise3D(x / noiseScale, y / noiseScale, time) * cW) + cM]

      // Fill each cell with pixels
      pixel(x, y, clr)
    }
  }

  // Fill imageData with the buffer
  imageData.data.set(buf8)
  // Display the image
  ctx.putImageData(imageData, 0, 0)
}

// Basic pixel fill function
function pixel (x, y, color) {
  // Get the components of the color
  let { r, g, b } = color

  // data is a one dimensional array so we need to do some math to find our pixel
  // (y * width + x) is the location of the pixel we want to color
  // Then we do some bitwise math to build the color from the components provided
  data[y * width + x] = r | (g << 8) | (b << 16) | (255 << 24)
}

// Color gradient generator
function * makeColorGradient (frequency1, frequency2, frequency3, phase1, phase2, phase3, inc = 0.01, center = 128, width = 127, len = 50) {
  let i = 0
  let off = 0

  while (true) {
    // Do the math to find the color
    let r = Math.sin(frequency1 * (i + off) + phase1) * width + center
    let g = Math.sin(frequency2 * (i + off) + phase2) * width + center
    let b = Math.sin(frequency3 * (i + off) + phase3) * width + center

    // Yield the output value
    // Receive the input with the off variable
    off = yield { r, g, b }
    i += inc
  }
}

// Running loop
function loop () {
  // Keep track of frames for the gradient progression
  frames++

  // Run stats around draw to find the performance of draw
  stats.begin()

  // Try removing the gradient update if you have performance problems
  updateGradient()
  draw()

  stats.end()

  // Restart the loop
  reqId = requestAnimationFrame(loop)
}

// Update the color gradient
function updateGradient () {
  let f = frames / 100

  for (let i = 0; i < colors.length; i++) {
    colors[i] = gradient.next(f + i * colorDelta).value
  }
}

// Initialization function for starting the pen
function init () {
  // Cancel any running draw
  cancelAnimationFrame(reqId)

  // Set up the viewport
  width = ~~(window.innerWidth / scale)
  height = ~~(window.innerHeight / scale)
  canvas.width = width
  canvas.height = height

  // Set up the image variables
  imageData = ctx.getImageData(0, 0, width, height)
  buf = new ArrayBuffer(imageData.data.length)
  buf8 = new Uint8ClampedArray(buf)
  data = new Uint32Array(buf)

  // Start the loop
  reqId = requestAnimationFrame(loop)
}

// Re-initialize if the viewport is resized
window.addEventListener('resize', init)

// Start the pen
init()
