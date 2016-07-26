var pull = require('pull-stream')
var audio = require('read-audio')
var getUserMedia = require('getusermedia')


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

export default function(gain, source){
  return pull(
    audio({source: source}),
    dataThrough,
    rmsThrough, 
    amplifierThrough(gain)
  )
}

