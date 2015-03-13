/**
 * UserController
 *
 * @module		:: Controller
 * @description	:: Contains logic for handling requests.
 */

module.exports = {
  index: function(req, res) {
    
    var AsteriskManager = require('asterisk-manager');
    var socket = req.socket;
    var io = sails.io;

	io.sockets.on('connection', function(socket) {
		var ami = new AsteriskManager('5038','localhost','admin','1234', true),
			peer_list = [];

		// quando client fizer requisicoes para este evento
		// retorna a listagem dos peers
		socket.on('get peers', function() {
			peer_list = [];
			ami.action({
			  'action':'SIPpeers'
			});
		});

		ami.keepConnected();

console.log('xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx');
		ami
		.on('managerevent', function(evt) {
			// ignoramos eventos sem status
			// pois o que interessa são as informacoes no bloco que contem o status
			if (!(evt.status >= 0)) {
				console.log('managerevent', evt);
				return;
			}

			console.log('evento com status', evt);

			socket.emit('asterisk connected', {
				exten: evt.exten,
				context: evt.context,
				status: evt.status
			});
		})
		.on('peerentry', function(evt) {
			peer_list.push(evt.objectname);
		})
		.on('peerlistcomplete', function() {
			socket.emit('get peers', peer_list);
		});
	});

    res.view({
    	layout: 'layouts/layout'
    });
  }
};
