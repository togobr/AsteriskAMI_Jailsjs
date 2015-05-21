var counter = 0;
var hourcounter = 0;
var minutecounter = 0;
var secondcounter = 0;

var UserView = Backbone.View.extend({
    tagName: 'div',
    className: 'user',

    events: {
        "click .icon.video" : "openVideo",
        "click .icon.audio" : "openAudio",
        "click .icon.chat" : "openChat"
    },

    peer: null,

    initialize: function() {
        _.bindAll(this, 'render');

        this.data = {
            ramalOnline: false,
            ramalEmUso: false
        };

        this.chatView = null;

        this.template = $('#userTemplate').html();
    },

    render: function() {
        console.log("Rendering...");
        var data = $.extend(true, {}, this.peer, this.data);

        // console.log('fooo', data);

        var rendered = Mustache.to_html(this.template, data);
        this.$el.html(rendered);
    },

    setPeer: function(peer) {
        this.peer = peer;

        // console.log('foo this.data', this.data);
        
        this.data.ramalOnline = peer.ipport != 0;
    },

    openVideo: function() {
        var $el = $(this.el),
            x = $el.find('ul'),
            data = x.attr('data-ramal');

            // sipCall("call-audiovideo"); //função do pŕoprio sipML5. js/lib/index.js

            this.callStatus($el);
    },

    openAudio: function() {
        var $el = $(this.el),
            x = $el.find('ul'),
            data = x.attr('data-ramal'),
            $id_txtPhoneNumber = $('#txtPhoneNumber'),
            $remoteRamal = $('#remoteRamal');

            //para não mudar muito a estrutura original do sipML5, foi pego o número do ramal 
            //e setado no input #txtPhoneNumber que o próprio sipML5 trata.
            $id_txtPhoneNumber.val(data);

            $remoteRamal.html(data);

            sipCall("call-audio"); //função do pŕoprio sipML5. js/lib/index.js

            this.callStatus($el);
    },

    openChat: function(ramal) {
        var $el = $(this.el),
            x = $el.find('ul'),
            ramal = $.isNumeric(ramal) ? ramal : x.attr('data-ramal');

        /*window.alert("Abrindo comunicação de CHAT para o ramal "+data);*/
        if (!this.chatView) {
            console.log('sddsds', this.chatView, ramal);
            this.chatView = new ChatView(ramal);
            this.chatView.$el.show().prependTo('body');
        }

        return this.chatView;
    },

    callStatus: function(user){
        var $blockCallStatus = $('.blockCallStatus');
            seconds = new Date().getSeconds();

        $blockCallStatus.addClass('inUse');   
        
    }
});