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
    const branch0 = new Branch(new Vec2D(), 10)
    this.branches.push(branch0)
    let count = 0
    // while (true) {
    //   let maxWeight = 0
    //   for (const branch of this.branches) {
    //     console.log(branch)
    //     const direction = random(-Math.PI / 5, Math.PI / 5)
    //     const newWeight = branch.weight - 1
    //     const branch1 = new Branch(branch.end, newWeight, direction)
    //     this.branches.push(branch1)
    //     maxWeight = Math.max(maxWeight, newWeight)
    //   }
    //   count++
    //   if (count > 100 || maxWeight === 1) {
    //     break
    //   }
    // }

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
