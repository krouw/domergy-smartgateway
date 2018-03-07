const mqtt = require('mqtt')
const _ = require('lodash')

const services = `${process.env.MQTT_SERVER}:${process.env.MQTT_PORT}`
const clientStr = 'rasp1'


const client = mqtt.connect(services, {
  clientId: clientStr
 })

 client.on('connect', function () {
   console.log('mqtt conectado');
   client.subscribe('entity/relay')
 });


const publish = ( payload ) => {

  if (  _.isEmpty(payload) ) {
    return;
  }
   const data = JSON.stringify(payload.data);
   client.publish(payload.topic, data);
   console.log('MQTT message published: ', data);
}

module.exports = {
  client,
  publish,
}
