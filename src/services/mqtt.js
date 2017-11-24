const mqtt = require('mqtt')
const _ = require('lodash')

const publish = ( service, payload ) => {

  if ( _.isEmpty(service)  || _.isEmpty(payload) ) {
    return;
  }
   const data = JSON.stringify(payload.data);

   const client = mqtt.connect(service.server, {
     clientId: service.client
    })

   client.on('connect', function () {
        client.publish(payload.topic, data);
        console.log('MQTT message published: ', data);
        client.end();
  });
}

module.exports = publish
