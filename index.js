import { start, pull, html } from 'inu'
import Pushable from 'pull-pushable'
import Immutable from 'seamless-immutable'
import classnames from 'classnames'
import getUserMedia from 'getusermedia'
import defer from 'pull-defer'

import pullAudioVolume from './pull-audio-volume'

const app = {
  init: function () {
    return Immutable({
      model: {
        volume: 0,
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
      <div class='volume'>
        ${model.volume}
        <svg height="400" width="500">
          ${model.freqs.map(function(freq, index) {
            return html`<line x1=${index} y1="0" x2=${index} y2=${freq} style="stroke:rgb(255,0,0);stroke-width:1" />`
          })}
        </svg>
      </div>
    </main>`
  },
  run: function (effect, sources) {
    switch(effect.type){
      case 'INIT': 

      var deferred = defer.source()
      getUserMedia({audio: true, video: false}, function(err, source) {
        deferred.resolve(pullAudioVolume(100, source))
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
