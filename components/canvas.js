import {html} from 'inu'

module.exports = function createCanvas (options) {
  
  options = options || {height: 512, width: 512}
  var el = html`<canvas height=${options.height}, width=${options.width} id="canvas"></canvas>`
  var ctx = el.getContext("2d")

  var count = 0 
  
  return function canvasView (model, dispatch) {

    ctx.clearRect(count, 0, 1, model.freqs.length)

    model.freqs.forEach(function (freq, index) {
      var color = `rgba(255, 0, 0, ${freq[0] / 1000})` 
      ctx.fillStyle = color 
      ctx.fillRect(count, index, 1, 1)
    })

    count = (count + 1) % options.height

    return html`<div class="canvas-wrapper">${el}</div>`
  }
}

