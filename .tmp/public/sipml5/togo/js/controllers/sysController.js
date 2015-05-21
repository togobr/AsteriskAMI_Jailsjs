window.userViews = {};
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
                    userViews[peer.objectname] = (user_view);

                    user_view.setPeer(peer);
                    user_views[peer.objectname] = user_view;
                    user_view.render();

                    $('.usersDiv').append(user_view.$el);
                });
                 
            })
            .on('asterisk callstatus', function(call) {
                console.log('foo callStatus', call);
                $('#ramalSrc').html(call.callerid1);
                $('#ramalDest').html(call.callerid2);


                myInterval = setInterval(clock, 1000);

                function clock() {
                  var $secondelement = $('#secondelement'),
                        $minuteelement = $('#minuteelement'),
                        $hourelement = $('#hourelement');

                    secondcounter = secondcounter + 1;
                    $secondelement.html(secondcounter);
                    if ( (secondcounter%60) == 0) {
                        minutecounter = minutecounter + 1;
                        $minuteelement.html(minutecounter);
                        if ( (minutecounter%60) == 0) {
                            hourcounter = hourcounter + 1;
                            $hourelement.html(hourcounter);
                        }
                    }
                }

                if(call.bridgestate !== "Link"){
                    clearInterval(myInterval);
                    console.log('foo call.bridgestate123', call.bridgestate);
                }

            })
            .on('message', function(data) {
                var my_ramal = $('#txtPrivateIdentity').val();
                console.log('fooooo received message', data, my_ramal);
                if (my_ramal == data.from) {
                    userViews[data.to].openChat(data.to).newMessage(data.from, data.message);
                    return;
                }
                if (data.to != my_ramal) return;

                userViews[data.from].openChat(data.from).newMessage(data.from, data.message);
            })
            /*.on('show result', function(result) {
                console.log('SHOWING RESULT:', result);
            })*/;
});
