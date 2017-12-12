const expect = require("chai").expect
const Meter = require('../src/meter')
const assert = require('chai').assert

describe("attributeValidation", () => {

  const config = {
    id: '01',
    xbeeProductId: '6001',
    mqtt: {
      server: 'mqtt://192.168.0.2',
      port: '1883',
      client: 'rasp1'
    }
  }

  let meter = {};
  const testPromise = ( test ) => {
    return new Promise(function(resolve, reject) {
      let count = 0
      let func = []
      test.forEach( data => {
        func.push(meter.validateFrame(data))
      })
      Promise.all(func.map(p => p.catch(() => undefined)))
        .then((value) => {
          console.log('value', value);
          const filter = value.filter(Boolean)
          resolve(filter.length)
        })
    });
  }

  before( ( done ) => {
    meter = new Meter( config )

    done()
  })

  it('pass attributeValidation', ( done ) => {
    const test = [
      '03,3331, 0.000,01/11/2020,19:04:05',
      '02,3316,1.2,02/06/2010,18:04:27',
      '92,33281,227.12332,02/12/2017,20:18:03',
      '01,3317,1.323,11/12/2017,20:22:00'
    ]

    testPromise(test)
      .then((count) => {
        assert.equal(test.length, count, '== prueba');
        done()
      })
      .catch((err) => {
        done(err)
      })

  })

  it('fail attributeValidation', ( done ) => {
    const test = [
      'aas,3331, 0.000,01/11/2020,19:04:05',
      '06,30.32,,02/06/2010,18:04:27',
      '123,33281,227./12332,02/12/2017,20:18:03',
      '12,3317,1.323,,20:22',
      '21,3323,23.3.2,32-11-20-2,23:12',
      '23,3318,1.23,02-11-20-1,08',
      '22,3317,32.3,20/18/2017,22:32:01',
      '22,3317,32.3,20/12/2017,22:80:01',
      '3sdsa,dasdas,,dasd,dsa'
    ]

    testPromise(test)
      .then((count) => {
        assert.equal(0, count, '== prueba');
        done()
      })
      .catch((err) => {
        done(err)
      })

  })

});
