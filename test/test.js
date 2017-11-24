const expect = require("chai").expect
const Meter = require('../src/meter')

describe("attributeValidation", () => {

  const config = {
    id: '01',
    xbeeProductId: '6001',
    mqtt: {
      server: 'mqtt://192.168.0.2:1883',
      client: 'rasp1'
    }
  }

  let meter = {};

  before( ( done ) => {
    meter = new Meter( config.id ,config.xbeeProductId, config.mqtt)
    done()
  })

  it('attributeValidation', ( done ) => {
    var test = ioServer.start(server)
    expect(test).to.be.true
    done()
  })

});
