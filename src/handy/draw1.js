function draw1(ctx) {
  ctx.strokeWeight(3)
  ctx.stroke(0, 50, 180)
  drawFillQuad(ctx.scribble, 10, 100, 10, 100)

  // increase randomness
  ctx.scribble.bowing = 0.1
  ctx.scribble.roughness = 4.5
  ctx.strokeWeight(10)
  ctx.stroke(0, 0, 0)
  ctx.scribble.scribbleLine(200, 100, 200, 400)

  // set randomness to default
  ctx.scribble.bowing = 0.1
  ctx.scribble.roughness = 1.5

  ctx.strokeWeight(1)
  ctx.stroke(0, 0, 0)
  ctx.scribble.scribbleEllipse(400, 50, 60, 60)
}

function drawFillQuad(scribble, xleft, xright, ytop, ybottom) {
  const gap = 3.5
  const angle = 90
  var xCoords = [ xleft, xright, xright, xleft ]
  var yCoords = [ ytop, ytop, ybottom, ybottom ]
  scribble.scribbleFilling(xCoords, yCoords, gap, angle)
}

export default draw1
