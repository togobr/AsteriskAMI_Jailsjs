var ChatView = Backbone.View.extend({
    events: {
        "click button" : "submit"
    },

    peer: null,

    initialize: function(ramal) {
        this.ramal = ramal;
        this.$el = $('#chatView').clone(true).attr('id', 'chatView-' + ramal);
        this.message = $('<div class="message"><h2 class="ramal"></h2><div class="text"></div></div>');
        
    },

    submit: function(event) {
        var self = this,
            ramal = this.ramal,
            input = this.$el.find('input'),
            message = input.val();

        event.preventDefault();  // cancela a submissao do formulario
        input.val('');

        window.io.socket.post('/socket/message', {
            from: $('#txtPrivateIdentity').val(),
            to: ramal,
            message: message
        });

        return false;
    },

    newMessage: function(ramal, message) {
        var message_element = this.message.clone(true);
        console.log('new message', ramal, message, message_element);
        message_element
            .find('.ramal')
            .html(ramal)
            .end()
            .find('.text')
            .html(message);

        this.$el.find('.messages').append(message_element);
    }
});