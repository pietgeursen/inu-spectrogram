import {html} from 'inu'

module.exports = function createCanvas () {

  var el = html`<canvas height=${window.innerHeight}, width=${window.innerWidth} id="canvas"></canvas>`
  var ctx = el.getContext("2d")
  
  return function canvasView (model, dispatch) {
		el.height = window.innerHeight
		el.width = window.innerWidth
    ctx.clearRect(0,0, el.width, el.height)
    model.freqs.forEach(function(freq, index) {
      ctx.fillStyle = "red";
      ctx.fillRect(index, 0, 1, freq)
    })

    return html`<div class="canvas-wrapper">${el}</div>`
  }
}

