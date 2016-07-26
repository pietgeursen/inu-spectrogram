import {html} from 'inu'
import classnames from 'classnames'

export default function notes(model, dispatch) {
  return model.notes.map(function(note, index) {
    return html`
      <div 
        onclick=${()=> dispatch({type: 'TOGGLE_NOTE', payload: index})} 
        class=${classnames({playing: model.index === index, on: note}, 'note')}
      >
      </div>` 
  })
}
