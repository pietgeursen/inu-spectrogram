export default = function notes(model, dispatch) {
  ${model.notes.map(function(note, index) {
    return html`
      <div 
        onclick=${()=> dispatch({type: 'TOGGLE_NOTE', payload: index})} 
        class=${classnames({playing: model.index === index, on: note}, 'note')}
      >
      </div>` 
  })}
}
