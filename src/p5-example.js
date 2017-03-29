import P5 from 'p5'
import 'p5/lib/addons/p5.sound'
import 'p5/lib/addons/p5.dom'
import Tree from './tree'

const s = function (p) {
  let tree = new Tree()

  p.setup = function () {
    const bodyWidth = window.innerWidth
    const bodyHeight = window.innerHeight
    p.createCanvas(bodyWidth, bodyHeight)

    console.log(tree)
  }

  p.draw = function () {
    p.background(51)

    p.translate(p.width / 2, p.height / 2)
    p.rotate(Math.PI)

    p.stroke(255, 255, 255, 50)
    tree.branches.forEach(branch => {
      p.strokeWeight(branch.weight)
      p.line(
        branch.start.x,
        branch.start.y,
        branch.end.x,
        branch.end.y
      )

      p.strokeWeight(1)
      p.ellipse(
        branch.start.x,
        branch.start.y,
        3, 3
      )
    })
  }

  p.mousePressed = function () {
    tree = new Tree()
  }
}

const a = new P5(s)
console.log(a) // to avoid linter error
