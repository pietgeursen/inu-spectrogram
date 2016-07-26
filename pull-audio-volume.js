var pull = require('pull-stream')
var pullWindow = require('pull-window')
var audio = require('read-audio')
var getUserMedia = require('getusermedia')
var unpack = require('ndarray-unpack')

var freqs = require('ndsamples-frequencies')

var dataThrough = pull.map(function(sample) {
  return sample.data 
})

var rmsThrough = pull.map(function(arr) {
  var squares = arr.map(function(num) {
    return num * num 
  }) 

  var sum = squares.reduce(function(prev, curr) {
    return prev + curr 
  })
  var mean = sum / arr.length

  return Math.sqrt(mean)
})

function amplifierThrough(gain) {
  return pull.map(function(num) {
    return parseInt(num * gain) 
  }) 
}

function meanOf(windowSize) {
  var i = 0
  return pullWindow(function(_, cb) {
    if(i != 0) return
    var sum = 0  
    return function(end, data) {
      if(end) return cb(null, sum)
      sum += data
      if(++i >= windowSize) {
        i = 0
        var mean = parseInt(sum / windowSize)
        console.log(mean);
        cb(null, mean)
      }
    }
  })  
}

export default function(gain, source){

  return pull(
    audio({source: source}),
    pull.map(freqs), 
    pull.map(unpack)
  )

  return pull(
    audio({source: source}),
    rmsThrough, 
    amplifierThrough(gain)
  )
}

