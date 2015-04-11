$(function() {
    // STATUS CODES
    /*-1 = Extension not found
    0 = Idle
    1 = In Use
    2 = Busy
    4 = Unavailable
    8 = Ringing
    16 = On Hold*/

    // armazena as instancias de UserView.js
    var user_views = {};


    // STATUS CODES
    /*-1 = Extension not found
    0 = Idle
    1 = In Use
    2 = Busy
    4 = Unavailable
    8 = Ringing
    16 = On Hold*/

    // conectando com backend
    var socket = io.connect();
        socket
            .on('connect', function () {
                console.log('conectado ao server... aguardando respostas do back-end.');
                //faz requisicao pro back
                io.socket.get('/socket/getPeers', function(peer) {
                    console.log('retorno de /socket/getPeers', peer);
                });
            })
            // recebido informações do backend. É disparado quando algum usuário connecta no asterisk
            .on('asterisk connected', function(participant) {

                console.log('recebido informacoes do participante', participant);
                var user_view = user_views[participant.exten];
                if (!user_view) return;

                user_view.data.ramalOnline = (participant.status == 0);
                user_view.data.ramalEmUso = ((participant.status == 1) || (participant.status == 8));
                user_view.render();
                console.log('asterisk connected', user_view);

            })
            .on('get peers', function(peers) {
                console.log('Retorna os ramais registrados no sip.conf', peers);
                // cada vez que alguem conectar, cada cliente vai disparar o evento `get peers` (rever isso)
                
                // para prevenir a duplicação de views
                $('.usersDiv').html('');

                user_views = {};

                // renderiza as UserViews para cada ramal
                // e guarda em user_views
                $.each(peers, function(k, peer) {
                    var user_view = new UserView();

                    user_view.setPeer(peer);
                    user_views[peer.objectname] = user_view;
                    user_view.render();

                    $('.usersDiv').append(user_view.$el);
                });

                //insere na usersDiv um bloco que vai conter o status da ligação, e o botão de encerrar a ligação também.
                $('.usersDiv').append(
                    '<div class="callStatus">' +
                        '<span id="timeCall"></span>' +
                        '<input type="button" id="btnHangUp" class="btn btn-primary" value="HangUp" onclick="sipHangUp();"/>'+
                    '</div>'
                );
                 
            })
            /*.on('show result', function(result) {
                console.log('SHOWING RESULT:', result);
            })*/;
});
