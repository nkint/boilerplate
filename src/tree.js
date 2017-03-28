import range from 'lodash/range'
import random from 'lodash/random'
import toxi from 'toxiclibsjs'

const Vec2D = toxi.geom.Vec2D

class Branch {
  length = 30

  constructor(start, direction) {
    direction = direction || 0
    this.start = start
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
    console.log('Tree constructor', this.branches)

    this.branches = range(5).reduce((acc, i) => {
      if (acc.length === 0) {
        const branch0 = new Branch(new Vec2D())
        return acc.concat([branch0])
      } else {
        const lastBranch = acc[acc.length - 1]
        const direction = random(-Math.PI / 5, Math.PI / 5)
        const branch1 = new Branch(lastBranch.end, direction)
        return acc.concat([branch1])
      }
    }, [])
  }
}

export default Tree
