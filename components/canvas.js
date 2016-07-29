import {html} from 'inu'

module.exports = function createCanvas (options) {
  
  options = options || {height: window.innerHeight, width: 512}
  var el = html`<canvas height=${options.height}, width=${options.width} id="canvas"></canvas>`
  var ctx = el.getContext("2d")

  //var count = 0 
  
  return function canvasView (model, dispatch) {
		//el.height = window.innerHeight
		//el.width = window.innerWidth
    // translate for next frame
    // write next trame
    ctx.translate(0, 1)

    model.freqs.forEach(function (freq, index) {
      var color = `rgba(255, 0, 0, ${freq[0] / 1000})` 
      ctx.fillStyle = color 
      ctx.fillRect(index, 0, 1, 1)
    })

    /*
    var image = ctx.getImageData(0, 0, el.width, count + 1)
    debugger
    model.freqs.forEach(function(freq, index) {
      image.data[(count * el.width) + index * 4] = freq  
      image.data[((count * el.width) + index * 4) + 1] = 255  
      image.data[((count * el.width) + index * 4) + 2] = 255  
      image.data[((count * el.width) + index * 4) + 3] = 255  
    }) 
    count++
    ctx.putImageData(image, 0, 0 )
    */

    return html`<div class="canvas-wrapper">${el}</div>`
  }
}

