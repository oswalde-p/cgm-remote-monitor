'use strict';

const http = require('http') // require('https') to work with TLS
const crypto = require('crypto')

const env = {
  PORT: process.env.PORT
  , HOST: process.env.HOST
  , API_SECRET: process.env.API_SECRET
}

const RECORDS_TO_CREATE = 2000
const INITIAL_SGV = 108 // 6.0 mmol/L
const SGV_FLOOR = 50
const SGV_CEILING =180
const DELTA_FACTOR = 5
const TIMESTEP = 60000 // ms

main();

function main () {
  const NOW = (new Date()).getTime()
  let prevReading
  for (let i = 0; i < RECORDS_TO_CREATE; i++) {
    const newReading = generateLibreReading(prevReading && prevReading.sgv, NOW - (i * TIMESTEP))
    sendEntryRest(JSON.stringify(newReading))
    prevReading = newReading
  }
}

function generateLibreReading (prevSgv = INITIAL_SGV, dateMS) {
  const rand = Math.random()
  const deltaSize = Math.floor(DELTA_FACTOR * rand)
  const deltaDir = Math.round(Math.random()) ? 1 : -1
  const delta = deltaDir * deltaSize

  let direction
  if (rand <= 0.15) {
    direction = 'Flat'
  } else {
    deltaDir > 0 ? 'FortyFiveUp' : 'FortyFiveDown'
  }

  const sgv = prevSgv + delta > SGV_FLOOR
    && prevSgv + delta < SGV_CEILING
    ? prevSgv + delta
    : prevSgv

  return {
    device: 'libre'
    , date: dateMS
    , sgv
    , direction
    , dateString: new Date(dateMS)
  }
}

function sendEntryRest (recordString) {

  const shasum = crypto.createHash('sha1');
  shasum.update(env.API_SECRET)

  var options = {
    host: env.HOST
    , port: env.PORT
    , path: '/api/v1/entries/'
    , method: 'POST'
    , headers: {
      'api-secret' : shasum.digest('hex')
      , 'Content-Type': 'application/json'
      , 'Content-Length': recordString.length
    }
  };

  var req = http.request(options, function (res) {
    // console.log('Ok: ', res.statusCode);
  });

  req.on('error', function (e) {
    console.error('error');
    console.error(e);
  });

  req.write(recordString);
  req.end();
}
