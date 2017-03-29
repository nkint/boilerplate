import P5 from 'p5'
import 'p5/lib/addons/p5.sound'
import 'p5/lib/addons/p5.dom'
import Scribble from './scribble'
import draw1 from './draw1'

function initAndInjectScrbble(ctx) {
  ctx.scribble = new Scribble(ctx)
  ctx.scribble.bowing = 0.1
  ctx.scribble.roughness = 1.5
}

const s = function (ctx) {
  ctx.setup = function () {
    // create canvas and fill background color
    ctx.createCanvas(ctx.windowWidth, ctx.windowHeight)
    ctx.background(255)

    initAndInjectScrbble(ctx)

    draw1(ctx)
  }
}

const a = new P5(s)
console.log(a) // to avoid linter error
