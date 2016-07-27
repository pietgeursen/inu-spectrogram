import { start, pull, html } from 'inu'
import Immutable from 'seamless-immutable'
import getUserMedia from 'getusermedia'
import defer from 'pull-defer'
import audio from 'read-audio'
import unpack from 'ndarray-unpack'
import freqs from 'ndsamples-frequencies'


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
    return html`<main>
        <svg height="1000" width="500">
          ${model.freqs.map(function(freq, index) {
            return html`<line x1=${index} y1="0" x2=${index} y2=${freq} style="stroke:rgb(255,0,0);stroke-width:1" />`
          })}
        </svg>
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
