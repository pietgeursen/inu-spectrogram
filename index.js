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
        volume: 0
      },
      effect: {type: 'INIT', payload: null}
    })
  },
  update: function (model, action) {
    var newModel = Immutable(model)
    switch(action.type){
      case 'SET_VOLUME':
        newModel = newModel.set('volume', action.payload)
        break;
    }
    return {model: newModel.asMutable({deep: true})}
  },
  view: function (model, dispatch) {
    return html`<main>
      <div class='volume'>
        ${model.volume}
      </div>
    </main>`
  },
  run: function (effect, sources) {
    console.log(effect);
    switch(effect.type){
      case 'INIT': 

      var deferred = defer.source()
      getUserMedia({audio: true, video: false}, function(err, source) {
        deferred.resolve(pullAudioVolume(100, source))
      })

      return pull(
        deferred,
        pull.map(function(num) {
         return {type: 'SET_VOLUME', payload: num} 
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
