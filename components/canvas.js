import {html} from 'inu'

module.exports = function createCanvas (options) {

  options = options || {}
  var el = html`<canvas height=${options.height}, width=${options.width} id="canvas"></canvas>`
  var ctx = el.getContext("2d")
  
  return function canvasView (model, dispatch) {
    ctx.clearRect(0,0, el.width, el.height)
    model.freqs.forEach(function(freq, index) {
      ctx.fillStyle = "red";
      ctx.fillRect(index, 0, 1, freq)
    })

    return html`<div class="canvas-wrapper">${el}</div>`
  }
}

