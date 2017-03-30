import range from 'lodash/range'
import random from 'lodash/random'
import toxi from 'toxiclibsjs'

const Vec2D = toxi.geom.Vec2D

class Branch {
  length = 30

  constructor(start, weight, direction) {
    direction = direction || 0
    this.weight = weight
    this.start = start
    this.finished = false // TODO: REFACTOR, a tree data structure is needed.

    // rotation around a point plus length translation
    this.end = start.copy()
      .subSelf(this.start)
      .addSelf(0, this.length)
      .rotate(direction)
      .addSelf(this.start)
  }
}

class Tree {
  branches = []

  constructor() {
    const branch0 = new Branch(new Vec2D(), 5)
    this.branches.push(branch0)

    this.branches = range(5).reduce((acc, i) => {
      if (acc.length === 0) {
        const branch0 = new Branch(new Vec2D(), 2)
        return acc.concat([branch0])
      } else {
        const lastBranch = acc[acc.length - 1]
        const direction = random(-Math.PI / 5, Math.PI / 5)
        const branch1 = new Branch(lastBranch.end, 2, direction)
        return acc.concat([branch1])
      }
    }, [])
  }
}

export default Tree
