import P5 from 'p5'
import 'p5/lib/addons/p5.sound'
import 'p5/lib/addons/p5.dom'
import Tree from './tree'

const s = function (p) {
  let tree = new Tree()

  p.setup = function () {
    p.createCanvas(640, 360)

    console.log(tree)
  }

  p.draw = function () {
    p.background(51)

    p.translate(p.width / 2, p.height / 2)
    p.rotate(Math.PI)

    p.stroke(255)
    tree.branches.forEach(branch => {
      p.line(
        branch.start.x,
        branch.start.y,
        branch.end.x,
        branch.end.y
      )

      p.ellipse(
        branch.start.x,
        branch.start.y,
        3, 3
      )
    })
  }

  p.mousePressed = function() {
    tree = new Tree()
  }
}

const a = new P5(s)
console.log(a) // to avoid linter error
