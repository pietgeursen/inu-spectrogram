import { start, pull, html } from 'inu'
import Immutable from 'seamless-immutable'
import getUserMedia from 'getusermedia'
import defer from 'pull-defer'
import audio from 'read-audio'
import unpack from 'ndarray-unpack'
import freqs from 'ndsamples-frequencies'

import createCanvas from './components/canvas'

const Canvas = createCanvas()

const app = {
  init: function () {
    return Immutable({
      model: {
        freqs: []
      },
      effect: {type: 'INIT', payload: null}
    })
  },
  update: function (model, action) {
    var newModel = Immutable(model)
    switch(action.type){
      case 'SET_FREQS':
        newModel = newModel.set('freqs', action.payload)
        break;
    }
    return {model: newModel.asMutable({deep: true})}
  },
  view: function (model, dispatch) {
    return html`
      <main>
        ${Canvas(model, dispatch)}
      </main>`
  },
  run: function (effect, sources) {
    switch(effect.type){
      case 'INIT': 

      var deferred = defer.source()
      getUserMedia({audio: true, video: false}, function(err, source) {
        var src =  pull(
          audio({source: source}),
          pull.map(freqs), 
          pull.map(function(freq) {
           return freq.step(-1) 
          }),
          pull.map(unpack)
        )
        deferred.resolve(src)
      })

      return pull(
        deferred,
        pull.map(function(num) {
         return {type: 'SET_FREQS', payload: num} 
        })        
      )
    } 
  }
}

const {views} = start(app)

const main = document.querySelector('main')

pull(views(), pull.drain(function (view) {
  html.update(main, view)
}))
