import P5 from 'p5'
import 'p5/lib/addons/p5.sound'
import 'p5/lib/addons/p5.dom'

const s = function (p) {
  let x = 100
  let y = 100

  p.setup = function () {
    p.createCanvas(p.windowWidth, p.windowHeight)
  }

  p.draw = function () {
    p.background(0)
    p.fill(255)
    p.rect(x, y, 50, 50)
  }
}

const a = new P5(s)
console.log(a) // to avoid linter error
