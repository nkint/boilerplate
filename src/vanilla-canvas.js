import * as _ from 'lodash'
import raf from 'raf'

let {random, times, assign} = _
const WIDTH = window.innerWidth
const HEIGHT = window.innerHeight

const FloatArray = window.Float32Array || Array

// base +/- range
function fuzzy(range, base) {
  return (base || 0) + (Math.random() - 0.5) * range * 2
}

function makeOctaveNoise(width, height, octaves) {
  let canvas = document.createElement('canvas')
  let ctx = canvas.getContext('2d')

  canvas.width = width
  canvas.height = height

  ctx.fillStyle = 'black'
  ctx.fillRect(0, 0, width, height)

  ctx.globalAlpha = 1 / octaves
  ctx.globalCompositeOperation = 'lighter'

  for (let i = 0; i < octaves; i++) {
    let octave = makeNoise(width >> i, height >> i)
    ctx.drawImage(octave, 0, 0, width, height)
  }
  return canvas
}

function makeNoise(width, height) {
  let canvas = document.createElement('canvas')
  let ctx = canvas.getContext('2d')

  canvas.width = width
  canvas.height = height

  let imgData = ctx.getImageData(0, 0, width, height)
  let data = imgData.data
  let pixels = data.length

  for (let i = 0; i < pixels; i += 4) {
    data[i] = Math.random() * 255
    data[i + 1] = Math.random() * 255
    data[i + 2] = Math.random() * 255
    //       data[i+1] = data[i];
    //     data[i+2] = data[i];
    data[i + 3] = 255
  }
  ctx.putImageData(imgData, 0, 0)

  return canvas
}

let defaults = {
  maxAge: 70,
  exposure: 0.1,
  damping: 0.8,
  noise: 1.0,
  fuzz: 1.0,
  intensity: 1.0,
  vx: 10,
  vy: 10,
  spawn: 5,
  octaves: 8,
  color: {
    r: 25,
    g: 100,
    b: 75,
  },
  width: WIDTH,
  height: HEIGHT,
  x: WIDTH * 0.5,
  y: HEIGHT * 0.5,
}

class Emitter {
  constructor(options) {
    assign(this, defaults, options)
    this.canvas = document.createElement('canvas')
    this.canvas.width = this.width
    this.canvas.height = this.height
    this.ctx = this.canvas.getContext('2d')

    document.createElement('canvas')
    this.canvas = document.createElement('canvas')
    this.canvas.width = this.width
    this.canvas.height = this.height
    this.ctx = this.canvas.getContext('2d')

    this.noiseData = this.noiseCanvas.getContext('2d').getImageData(0, 0, this.width, this.height).data
    this.particles = []

    this.ctx.fillStyle = 'black'
    this.ctx.fillRect(0, 0, this.width, this.height)
    this.imgdata = this.ctx.getImageData(0, 0, this.width, this.height)
    this.data = this.imgdata.data
    this.ctx.clearRect(0, 0, this.width, this.height)

    this.hdrdata = new FloatArray(this.data.length)
    times(this.noiseData.length, n => {
      this.hdrdata[n] = 0
    })
    this.velocity = {
      x: random(-0.5, 0.5, true),
      y: random(-0.5, 0.5, true),
    }

    this.update = this.update.bind(this)
  }

  tonemap(n) {
    return (1 - Math.pow(2, -n * 0.005 * this.exposure)) * 255
  }

  getNoise(x, y, channel) {
    // ~~  DOUBLE NOT BITWISE OPERATOR
    return this.noiseData[(~~x + ~~y * this.width) * 4 + channel] / 127 - 1.0
  }

  update() {
    if (this.x < 0 || this.x > this.width) {
      return
    }
    if (this.y < 0 || this.y > this.height) {
      return
    }

    this.x += this.velocity.x
    this.y += this.velocity.y

    let {x, y, vx, vy, width, height, color, maxAge, damping, noise, fuzz, intensity, spawn} = this
    let {r, g, b} = color

    times(spawn, n => {
      this.particles.push({
        vx: fuzzy(vx),
        vy: fuzzy(vy),
        x: x,
        y: y,
        age: 0,
      })
    })

    let alive = []

    this.particles.forEach(p => {
      p.vx = p.vx * damping + this.getNoise(p.x, p.y, 0) * 4 * noise + fuzzy(0.1) * fuzz
      p.vy = p.vy * damping + this.getNoise(p.x, p.y, 1) * 4 * noise + fuzzy(0.1) * fuzz
      p.age++
      times(10, x => {
        p.x += p.vx * 0.1
        p.y += p.vy * 0.1
        let index = (~~p.x + ~~p.y * width) * 4
        this.data[index] = this.tonemap(this.hdrdata[index] += r * intensity)
        this.data[index + 1] = this.tonemap(this.hdrdata[index + 1] += g * intensity)
        this.data[index + 2] = this.tonemap(this.hdrdata[index + 2] += b * intensity)
      })
      if (p.age < maxAge) {
        alive.push(p)
      }
    })
    this.ctx.putImageData(this.imgdata, 0, 0)
    this.particles = alive
  }
}

class Smoke {
  constructor(container) {
    let canvas = container

    let width = WIDTH
    let height = HEIGHT
    console.log(width, height)
    canvas.width = width
    canvas.height = height
    let ctx = canvas.getContext('2d')
    let y = canvas.height * 0.5
    let noiseCanvas = makeOctaveNoise(width, height, 8)
    let noiseCanvas2 = makeOctaveNoise(width, height, 8)

    let green = new Emitter({
      name: 'left',
      maxAge: 300,
      width: canvas.width,
      height: canvas.height,
      damping: 0.75,
      exposure: 0.05,
      intensity: 1.0,
      noiseCanvas: noiseCanvas,
    })

    let green2 = new Emitter({
      name: 'right',
      maxAge: 300,
      width: canvas.width,
      height: canvas.height,
      noiseCanvas: noiseCanvas2,
      damping: 0.75,
      intensity: 2.0,
      exposure: 0.05,
    })
    green.x = green2.x = 0
    green.y = green2.y = y
    green.velocity.x = 1
    green2.velocity.x = 1
    green.velocity.y = green2.velocity.y = 0
    this.canvas = canvas
    this.ctx = ctx
    this.emitters = [green]
    // this.emitters.push(green2, blue2, white2);

    this.update = this.update.bind(this)
    this.loop = this.loop.bind(this)
    this.loop()
  }
  update() {
    let ctx = this.ctx
    let canvas = this.canvas

    ctx.globalCompositeOperation = 'normal'
    ctx.fillStyle = 'rgba(5, 15, 16, 1.00)'
    ctx.fillRect(0, 0, canvas.width, canvas.height)

    this.ctx.globalCompositeOperation = 'lighter'
    this.emitters.forEach(emitter => {
      emitter.update()
      this.ctx.drawImage(emitter.canvas, 0, 0)
      emitter.ctx.restore()
    })
  }
  loop() {
    this.update()
    raf(this.loop)
  }
}

const canvas = document.createElement('canvas')
document.body.appendChild(canvas)
let smoke = new Smoke(canvas, {width: WIDTH, height: HEIGHT})
console.log(smoke)
