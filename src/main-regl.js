import createRegl from 'regl'
import mat4 from 'gl-mat4'
import createCamera from 'canvas-orbit-camera'
import fit from 'canvas-fit'

import vert from './shader.vert'

const canvas = document.createElement('canvas')
const regl = createRegl(canvas)
const camera = createCamera(canvas)

const POINTS = 300

const positions = []
let alpha = 0
for (let i = 0; i < POINTS + 3; i++) {
  alpha += 0.1
  const x = Math.cos(alpha) * 5
  const y = Math.sin(alpha) * 5
  const z = i / 20
  positions.push([x, y, z])
}

const cells = []
for (let i = 0; i < POINTS - 4; i += 2) {
  cells.push([i, i + 1, i + 2])
  cells.push([i + 2, i + 1, i + 3])
}

const offset = []
for (let i = 0; i < POINTS * 2; i++) {
  offset.push([0.5, -0.5])
}

const frag = `
precision mediump float;
uniform vec4 color;
void main() {
  gl_FragColor = color;
}`

const draw = regl({
  attributes: {
    prevPosition: positions.slice(0, positions.length - 2),
    currPosition: positions.slice(1, positions.length - 1),
    nextPosition: positions.slice(2),
    offsetScale: offset,
  },
  elements: cells,

  uniforms: {
    projection: ({viewportWidth, viewportHeight}) => (
      mat4.perspective([],
        Math.PI / 2,
        viewportWidth / viewportHeight,
        0.01,
        1000)
    ),
    model: mat4.identity([]),
    view: () => camera.view(),
    aspect: ({viewportWidth, viewportHeight}) => (
      viewportWidth / viewportHeight
    ),

    color: [0.8, 0.5, 0, 1],
    thickness: 1,
    miter: 0,
  },
  vert,
  frag,
})

regl.frame(({tick}) => {
  regl.clear({
    color: [0.1, 0.1, 0.1, 1],
    depth: 1,
  })
  camera.tick()
  draw()
})

window.addEventListener('resize', fit(canvas), false)
document.body.appendChild(canvas)
