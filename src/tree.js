import clamp from 'lodash/clamp'
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
    let count = 0
    console.log('dudee >')
    while (true) {
      console.log('dudee >>', count)
      let maxWeight = -100000000
      const newBranches = []

      // to be safe
      if (this.branches.length > 1000) {
        console.error('something is failing')
        return
      }

      for (let i = 0; i < this.branches.length; ++i) {
        const branch = this.branches[i]
        console.log(i)
        newBranches.push(branch)
        if (!branch.isFinished && branch.weight > 1) {
          console.log('do new branch')
          branch.isFinished = true
          const direction = random(-Math.PI / 3, Math.PI / 3)
          const newWeight = clamp(branch.weight - 1, 0, 10)
          const branch1 = new Branch(branch.end, newWeight, direction)
          const branch2 = new Branch(branch.end, newWeight, -direction)
          newBranches.push(branch1)
          newBranches.push(branch2)
          maxWeight = Math.max(maxWeight, newWeight)
        }
      }
      this.branches = newBranches
      if (maxWeight === 1) {
        break
      }

      // to be safe
      count++
      if (count > 100) {
        console.error('something is failing (2)')
        break
      }
    }

    // this.branches = range(5).reduce((acc, i) => {
    //   if (acc.length === 0) {
    //     const branch0 = new Branch(new Vec2D(), 2)
    //     return acc.concat([branch0])
    //   } else {
    //     const lastBranch = acc[acc.length - 1]
    //     const direction = random(-Math.PI / 5, Math.PI / 5)
    //     const branch1 = new Branch(lastBranch.end, 2, direction)
    //     return acc.concat([branch1])
    //   }
    // }, [])
  }
}

export default Tree
