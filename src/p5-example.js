import P5 from 'p5'
import 'p5/lib/addons/p5.sound'
import 'p5/lib/addons/p5.dom'
import mat3 from 'gl-mat3'
import vec2 from 'gl-vec2'

function getTransform(len, theta) {
  let transformLeft = mat3.create()
  mat3.translate(
    transformLeft,
    transformLeft,
    [0, -len])
  mat3.rotate(
    transformLeft,
    transformLeft,
    theta)
  return transformLeft
}

const s = function (p) {
  var theta = Math.PI / 2
  // const pointStack = []
  // let pointCurrent = vec2.create()
  const branches = []

  p.setup = function () {
    p.createCanvas(640, 360)

    // const transformRight = getTransform(50, theta)
    const transformLeft = getTransform(50, -theta)

    doBranch(50, 2, transformLeft, [0, 0])
    // doBranch(50, 3, transformRight, [0, 0])

    // branches.forEach((b, i) => {
    //   console.log(i)
    //   console.log('start: ', b.start)
    //   console.log('end: ', b.end)
    // })
  }

  p.draw = function () {
    p.background(51)

    p.translate(p.width / 2, p.height / 2)
    p.stroke(255)
    p.ellipse(0, 0, 5, 5)

    branches.forEach(branch => {
      // console.log(branch.start[0],
      //   branch.start[1],
      //   branch.end[0],
      //   branch.end[1])
      p.strokeWeight(branch.weight + 1)
      p.line(
        branch.start[0],
        branch.start[1],
        branch.end[0],
        branch.end[1])
    })
  }

  function doBranch(len, i, tr, pointCurrent) {
    console.log('------------- doBranch', i, pointCurrent)

    const endPoint = vec2.create()
    vec2.transformMat3(
      endPoint,
      pointCurrent,
      tr)

    const p1 = [50, -50]
    const p2 = vec2.create()
    vec2.transformMat3(
      p2,
      p1,
      tr)
    console.log('----------', p2)

    const pointClone = vec2.clone(pointCurrent)

    const branch = {
      weight: i,
      start: pointClone,
      end: endPoint,
    }
    branches.push(branch)
    console.log('start end', branch.start, branch.end)

    // pointCurrent = vec2.clone(endPoint)
    console.log('pointCurrent', pointCurrent)

    // len *= 0.66
    if (i !== 0) {
      // pointStack.push(
      //   vec2.clone(pointCurrent)
      // )

      const transformRight = getTransform(len, theta)
      const transformLeft = getTransform(len, -theta)

      doBranch(len, i - 1, transformRight, endPoint)       // Ok, now call myself to draw two new branches!!
      // pointCurrent = pointStack.pop()

      doBranch(len, i - 1, transformLeft, endPoint)

      // Repeat the same thing, only branch off to the "left" this time!
      // pointStack.push(
      //   vec2.clone(pointCurrent)
      // )
      // doBranch(len, i - 1, transformLeft)
      // pointCurrent = pointStack.pop()
    }
    return pointCurrent
  }
}

const a = new P5(s)
console.log(a) // to avoid linter error
