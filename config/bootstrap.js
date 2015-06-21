/**
 * Bootstrap
 * (sails.config.bootstrap)
 *
 * An asynchronous bootstrap function that runs before your Sails app gets lifted.
 * This gives you an opportunity to set up your data model, run jobs, or perform some special logic.
 *
 * For more information on bootstrapping your app, check out:
 * http://sailsjs.org/#/documentation/reference/sails.config/sails.config.bootstrap.html
 */

module.exports.bootstrap = function(cb) {
    //200.135.233.35 - asterisk remoto
	var AsteriskManager = require('asterisk-manager'),
        ami = new AsteriskManager('5038','177.96.170.56','admin','1234', true),
        peer_list = {};

    ami.keepConnected();

    ami
    .on('managerevent', function(evt) { //captura qualquer evento que acontecer no Asterisk.
        // console.log('managerevent', evt);
    })
    // é disparado quando algum usuário connecta no asterisk
    .on('extensionstatus', function(evt) {
        //dispara evento para o front
        sails.io.sockets.emit('asterisk connected', {
            exten: evt.exten,
            context: evt.context,
            status: evt.status
        });
    })
    // evento que dispara quando é enviado a action de SIPpeers (SocketController.js)
    .on('peerentry', function(evt) {
        peer_list[evt.objectname] = {
            objectname: evt.objectname,
            ipport: evt.ipport,
            ipaddress: evt.ipaddress
        };
    })
    .on('peerlistcomplete', function() {
        //dispara evento para o front
        sails.io.sockets.emit('get peers', peer_list);
    })
    .on('bridge', function(evt) { 
        sails.io.sockets.emit('asterisk callstatus', {
            bridgestate: evt.bridgestate,
            callerid1: evt.callerid1,
            callerid2: evt.callerid2
        });
    })

    /*.on('anyeventhere', function(result) {
        sails.io.sockets.emit('show result', result);
    })*/;

    sails.config.globals.ami = ami;

  // It's very important to trigger this callback method when you are finished
  // with the bootstrap!  (otherwise your server will never lift, since it's waiting on the bootstrap)
  cb();
};
