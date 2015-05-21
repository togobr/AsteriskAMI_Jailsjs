/**
 * UserController
 *
 * @module		:: Controller
 * @description	:: Contains logic for handling requests.
 */

module.exports = {
	index: function(req, res) {
		return res.json({});
	},

	getPeers: function(req, res) {
		var ami = sails.config.globals.ami;

		ami.action({
          'action':'SIPpeers'
        }, function(err, result) {
        	return res.json(result);
        });
	},

	message: function(req, res) {
		var from = req.param('from'),
			to = req.param('to'),
			message = req.param('message');

		sails.io.sockets.emit('message', {
			from: from,
			to: to,
			message: message
		});
	}
};