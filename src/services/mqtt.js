const mqtt = require('mqtt')
const _ = require('lodash')

const publish = ( service, payload ) => {

  if ( _.isEmpty(service)  || _.isEmpty(payload) ) {
    return;
  }
   const data = JSON.stringify(payload.data);
   console.log('< ================ >\n');
   console.log('Publishing to MQTT service.');

   const client = mqtt.connect(service.server, {
     clientId: service.client
    })
   client.on('connect', function () {
        console.log('MQTT topic: ', payload.topic);
        client.publish(payload.topic, data);
        console.log('MQTT message published: ', data);
        client.end();
        console.log('\n');
  });
}

module.exports = publish
