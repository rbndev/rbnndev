
// let url = location.protocol;
// let ws = (url !== "https:") ? location.protocol = "https:" : '';
var socket = io();
var obj = {}
var jwt = localStorage.getItem('jwt');


if(jwt == null){
    socket.emit('jwt', `null`);
}else{
    socket.emit('jwt', jwt);
}

// $(function () {
//     $('[data-toggle="tooltip"]').tooltip();
// });

// $(function () {
//     $('#m').emoji();
// });

// $(document).on("click", "#btn-login", function(){ //Logar
//     socket.emit('signin', $('#nickRoom').val(),  $('#senhaRoom').val(), jwt);
// });

var btnlogin = document.getElementById("btn-login");
btnlogin.addEventListener("click", logar, true);

function logar() {
    let nickroom = document.getElementById("nickRoom").value;
    let senharoom = document.getElementById("senhaRoom").value;
    socket.emit('signin', nickroom, senharoom, jwt);
}


var cam = document.getElementById("cam");
cam.addEventListener("click", ligarcam, true);

function ligarcam() {
    const vid = document.getElementById("vid");
    const offcam = document.getElementById("offcam");
    const cam = document.getElementById("cam");
    vid.hidden = false;
    offcam.hidden = false;
    cam.hidden = true;  
    navigator.mediaDevices.getUserMedia({ 
        video: {
        width: { min: 150, ideal: 270, max: 300 },
        height: { min: 150, ideal: 200, max: 250 }
        }, audio: true })
    .then((stream) => {
        document.getElementById('vid').srcObject = stream
    })
    socket.emit('cam', "ligou");
}


// $(document).on("click", "#cam", function(){ // Ligar Cam
//     socket.emit('cam', "ligou");
//     $("#vid").removeAttr("hidden");
//     $("#offcam").removeAttr("hidden");
//     $("#cam").attr("hidden", true);
//     navigator.mediaDevices.getUserMedia({ 
//         video: {
//         width: { min: 150, ideal: 270, max: 300 },
//         height: { min: 150, ideal: 200, max: 250 }
//         }, audio: true })
//     .then((stream) => {
//         document.getElementById('vid').srcObject = stream
//     })
// });

var offcam = document.getElementById("offcam");
offcam.addEventListener("click", offcam, true);

function offcam() {
    const vid = document.getElementById("vid");
    const offcam = document.getElementById("offcam");
    const cam = document.getElementById("cam");
    socket.emit('cam', "desligou");

    vid.hidden = true;
    cam.hidden = false;
    offcam.hidden = true;
}

// $(document).on("click", "#offcam", function(){ // Ligar Cam
//     socket.emit('cam', "desligou");
//     $("#vid").attr("hidden", true);
//     $("#cam").removeAttr("hidden");
//     $("#offcam").attr("hidden", true);
// });

var nickroom = document.getElementById("nickRoom");
var senharoom = document.getElementById("senhaRoom");
nickroom.addEventListener('keypress', function (e) {
    if (e.key == 13) {
        sendLogin();
    }
});
senharoom.addEventListener('keypress', function (e) {
    if (e.key == 13) {
        sendLogin();
    }
});

function sendLogin() {
    const nick = document.getElementById("nickRoom").value;
    const senha = document.getElementById("senhaRoom").value;
    socket.emit('signin', nick,  senha, jwt);        
}

// $("#nickRoom").keypress(function(e) { //Logar com enter login
//     if (e.which == 13) {
//         socket.emit('signin', $('#nickRoom').val(),  $('#senhaRoom').val(), jwt);
//     }
// });

// $("#senhaRoom").keypress(function(e) { //Logar com enter senha
//     if (e.which == 13) {
//         socket.emit('signin', $('#nickRoom').val(),  $('#senhaRoom').val(), jwt);
//     }
// });



$(".inputmessage").keyup(function(e) { //Keyup Input
    var msgSound = new Audio("cdn/audios/tecla.mp3");
    msgSound.play();
    var m = $('#m').val();

    if(m != ''){
        socket.emit('digitando', `digitando`);
    }else{
        socket.emit('digitando', `naodigitando`);
    }

});

$(document).on("click", "#privado", function (){
    Swal.fire({
        title: `Msg Privada ${$(this).html()}`,
        html: `<textarea id="msgpv" type="text" class="form-control" rows="4"></textarea>
                `,
        focusConfirm: false,
        showCancelButton: true,
        confirmButtonColor: "#114e11",
        cancelButtonColor: "rgb(121 15 45 / 1)",
        confirmButtonText: "ENVIAR",
        cancelButtonText: "Cancelar",
        preConfirm: () => {
            const to = $(this).data("socket");
            const message = $("#msgpv").val();
            // socket.emit("chat message", `/pm ${to} ${$("#msgpv").val()}`);
            socket.emit("pm", to, message);
        }
    });
});

$(document).on("click", "#vercam", function (){
    let id = $(this).data("webid");

    socket.emit("offer", id);

    // console.log(id);
});

$(document).on("click", "#responderPm", function (){
    $("#m").val(`/pm ${$(this).data("responderpm")} `);
    $("#m").focus();
});

$(document).on("click", "#logout", function (){
    socket.emit('logout', jwt);
    localStorage.removeItem('jwt');
    localStorage.removeItem('idcam');
    location.reload(true);
});

$(document).on("click", "#options", function (){
    var attr = document.getElementById('optiondown').hasAttribute('hidden');
    if(attr){
        $("#optiondown").removeAttr("hidden");
    }else{
        document.getElementById("optiondown").hidden = true;
    }
});

$(document).on("click", "#marcar", function (){
    var msgm = $("#m").val();
    if(msgm == "" || null || undefined){
        $("#m").val(`@${$(this).data("nome")}, `);
        $("#m").focus();
    }else{
        $("#m").val(`${$("#m").val()} @${$(this).data("nome")}`);
        $("#m").focus();
    }
});

$('form').submit(function(e) {      
    e.preventDefault(); // prevents page reloading
    socket.emit('chat message', $('#m').val());
    $('#m').val('');
    document.getElementById("btnEnviar").disabled = true;
    setTimeout(function(){
            document.getElementById("btnEnviar").disabled = false;
            }, 1000);
    return false;	
});

socket.on('chat message', function(msg){
    var msgSound = new Audio("cdn/audios/effect.mp3");
    $('#messages').append(`<li class="blockli"><a>${msg}</a></li>`);
    msgSound.play();
    window.scrollBy(0, 300);
});

socket.on('pv', function (msg) {
    var msgSound = new Audio("cdn/audios/effect.mp3");
    $('#messages').append(`<li class="blockli"><a>${msg}</a></li>`);
    msgSound.play();
    window.scrollBy(0, 300);
});

socket.on('profile', function(dados){
    $('#profile').append(`<img id="profile-me" class="imgme" src="${dados.img}">`);
    $('#profile').append(`<i id="options" style="cursor: pointer;" class="fas fa-ellipsis-v profileoptions" data-toggle="tooltip" data-placement="bottom" title="Configurações"></i>`);
    $('#profile').append(`<i id="cam" style="cursor: pointer;" class="fas fa-video profileoptions" data-toggle="tooltip" data-placement="bottom" title="Ligar WebCam"></i>`);
    $('#profile').append(`<i id="offcam" style="cursor: pointer;" class="fas fa-times profileoptions" data-toggle="tooltip" data-placement="bottom" title="Desligar Webcam" hidden></i>`);
    
    $(document).on("click", "#alterarcor", function () {
        document.getElementById("optiondown").hidden = true;
        var newcolor = {cor: dados.cor, shadow: dados.glow}
        const {value: cores} = Swal.fire({
            title: "Alterar COR / BRILHO",
            html: `<canvas id="paleta1"></canvas>
                    <canvas id="paleta2"></canvas>
                    <hr>
                    <input id="novacor" type="hidden" value="${dados.cor}" maxlenght="7">
                    <input id="novoglow" type="hidden" value="${dados.shadow}" maxlenght="7">
                    `,
            focusConfirm: false,
            showCancelButton: true,
            confirmButtonColor: "#66ff66",
            cancelButtonColor: "#ff6666",
            confirmButtonText: "Alterar",
            cancelButtonText: "Cancelar",
            preConfirm: () => {
                dados.cor = $("#novacor").val();
                dados.shadow = $("#novoglow").val();
                socket.emit("chat message", `/cor ${$("#novacor").val()} ${$("#novoglow").val()}`);
            }
        });
        new KellyColorPicker({place: "paleta1", input: "novacor", size: 150});
        new KellyColorPicker({place: "paleta2", input: "novoglow", size: 150});
    });
    
    $(document).on("click", "#alterarsenha", function (){
        document.getElementById("optiondown").hidden = true;
        Swal.fire({
            title: "Alterar Senha",
            html: `<input type="text" placeholder="Senha Antiga" class="form-control" id="oldsenha" maxlenght="50">
                    <input type="text" placeholder="Nova Senha" class="form-control" id="newsenha" maxlenght="50">
                    `,
            focusConfirm: false,
            showCancelButton: true,
            confirmButtonColor: "#66ff66",
            cancelButtonColor: "#ff6666",
            confirmButtonText: "Alterar",
            cancelButtonText: "Cancelar",
            preConfirm: () => {
                var senha = {id: dados.id, new: $("#newsenha").val(), old: $("#oldsenha").val()}
                socket.emit("alterarsenha", senha);
            }
        });
    });

    $(document).on("click", "#alterarnick", function (){
        document.getElementById("optiondown").hidden = true;
        Swal.fire({
            title: "Alterar Nick",
            html: `<input type="text" class="form-control" id="newnick" value="${dados.nome}" maxlenght="15">
                    `,
            focusConfirm: false,
            showCancelButton: true,
            confirmButtonColor: "#66ff66",
            cancelButtonColor: "#ff6666",
            confirmButtonText: "Alterar",
            cancelButtonText: "Cancelar",
            preConfirm: () => {
                dados.nome = $("#newnick").val();
                socket.emit("chat message", `/nick ${$("#newnick").val()}`);
            }
        });
    });
    
    $(document).on("click", "#alterarimg", function (){
        document.getElementById("optiondown").hidden = true;
        const {value: img} = Swal.fire({
            title: "Alterar Imagem",
            html: `
                <p style="color: red;font-size: 13px;">Faça o upload da sua imagem e adicione abaixo o link!</p>
                <a style="color: green;font-size: 10px;">LIKE »</a> <i style="font-size: 12px;">https://uploaddeimagens.com.br/</i>
                <hr>
                <input type="text" class="form-control" id="newimg" value="${dados.img}" maxlenght="50">                
                `,
            focusConfirm: false,
            showCancelButton: true,
            confirmButtonColor: "#66ff66",
            cancelButtonColor: "#ff6666",
            confirmButtonText: "Alterar",
            cancelButtonText: "Cancelar",
            preConfirm: () => {
                dados.img = $("#newimg").val();
                var img = document.getElementById('profile-me');
                img.src = $("#newimg").val();
                socket.emit("chat message", `/foto ${$("#newimg").val()}`);
            }
        });
    });

});

socket.on('responderPm', function(marcarPm){
    console.log(marcarPm);
});

socket.on('buzina', function(nome, cargo, cor, shadow, img){
    var cargocor = "";

    switch(cargo){
    case "dev":
        cargocor = `glitter cusers cargodev`;
        break;
    case "adm":
        cargocor = `glitter cargoadm cusers`;
        break;
    case "vip":
        cargocor = `glitter cusers cargovip`;
        break;
    default:
        return 0;
    }


    var span = `text-shadow: ${shadow} 0px 0px 0.2rem, ${shadow} 0px 0px 0.2rem, ${shadow} 0px 0px 0.2rem;color: ${cor};`;
    var msgSound = new Audio("cdn/audios/buzina.mp3");
        $( "#flex" ).effect( "shake" );
            msgSound.play();
        $('#messages').append(`<li class="cmd-audios">
            <a>
            <img class="imgtxt" style="margin-right:10px;" src="${img}">
            <span id="marcar" data-nome="${nome}" style="${span}cursor: pointer;">${nome} </span>
            <span style="margin-left:4px;" class="${cargocor}">${cargo.toUpperCase()} »</span>
            <span class="comandos"> ☆☆☆ Enviou um Buzina!!! ☆☆☆</span>
            </a></li>`);
            window.scrollBy(0, 1000);
});

socket.on('gemido', function(nome, cargo, cor, shadow, img){
    var cargocor = "";
    
    switch(cargo){
        case "dev":
            cargocor = `glitter cusers cargodev`;
            break;
        case "adm":
            cargocor = `glitter cargoadm cusers`;
            break;
        case "vip":
            cargocor = `glitter cusers cargovip`;
            break;
        default:
            return 0;
        }

    var span = `text-shadow: ${shadow} 0px 0px 0.2rem, ${shadow} 0px 0px 0.2rem, ${shadow} 0px 0px 0.2rem;color: ${cor};`;
    var msgSound = new Audio("cdn/audios/gemido.mp3");
    msgSound.play();
    $('#messages').append(`<li class="cmd-audios">
    <a>
    <img class="imgtxt" style="margin-right:10px;" src="${img}">
    <span id="marcar" data-nome="${nome}" style="${span}cursor: pointer;">${nome} </span>
    <span style="margin-left:4px;" class="${cargocor}">${cargo.toUpperCase()} »</span>
    <span class="comandos"> ☆☆☆ Enviou um Gemidãããão!!! ☆☆☆</span>
    </a></li>`);
    window.scrollBy(0, 1000);
});

socket.on('fiufiu', function(nome, cargo, cor, shadow, img){
    var cargocor = "";
    
    switch(cargo){
        case "dev":
            cargocor = `glitter cusers cargodev`;
        break;
        case "adm":
            cargocor = `glitter cargoadm cusers`;
        break;
        case "vip":
            cargocor = `glitter cusers cargovip`;
        break;
        default:
            return 0;
        }

    var span = `text-shadow: ${shadow} 0px 0px 0.2rem, ${shadow} 0px 0px 0.2rem, ${shadow} 0px 0px 0.2rem;color: ${cor};`;
    var msgSound = new Audio("cdn/audios/fiufiu.mp3");
    msgSound.play();
    $('#messages').append(`
    <li class="cmd-audios">
    <a>
    <img class="imgtxt" style="margin-right:10px;" src="${img}">
    <span id="marcar" data-nome="${nome}" style="${span}cursor: pointer;">${nome} </span>
    <span style="margin-left:4px;" class="${cargocor}">${cargo.toUpperCase()} »</span>
    <span class="comandos"> ☆☆☆ Enviou um Assobio!!! ☆☆☆</span>
    </a></li>`);
    window.scrollBy(0, 1000);
});



socket.on('enter', function(enter){
    var enterRoom = new Audio("cdn/audios/enterRoom.mp3");
    $('#messages').append(`<p id="helloroom">${enter}</p>`);
    enterRoom.play();
    window.scrollBy(0, 1000);
});

socket.on('quit', function(quit){
    var quitRoom = new Audio("cdn/audios/quitRoom.mp3");
    $('#messages').append(`<p id="byeroom">${quit}</p>`);
    window.scrollBy(0, 1000);
    quitRoom.play();
});



$(document).on("click", "#registrar", function(){     
    
    Swal.fire({
        title: 'Registrar',
        html:
        `<div class="input-group mb-3">
            <div class="input-group-prepend"><span class="input-group-text" id="basic-addon1">Login</span></div>
            <input id="ulogin" type="text" class="form-control" placeholder="Escolha o seu login" aria-label="Username" aria-describedby="basic-addon1" required>
        </div>
        <div class="input-group mb-3">
            <div class="input-group-prepend"><span class="input-group-text" id="basic-addon1">Senha</span></div>
            <input id="senha" type="password" class="form-control" placeholder="*****" aria-label="Password" aria-describedby="basic-addon1" required>
        </div>
        <div class="input-group mb-3">
            <div class="input-group-prepend"><span class="input-group-text" id="basic-addon1">Nick</span></div>
            <input id="nick" type="text" class="form-control" placeholder="Escolha um Nickname" aria-label="Nick" aria-describedby="basic-addon1" required>
        </div>`,
        preConfirm: function () {
            return new Promise(function (resolve) {
                resolve([
                    socket.emit('registrar', $('#ulogin').val(), $('#senha').val(), $('#nick').val(),),
                ])
            })
            },
        focusConfirm: false,
        heightAuto: false,     
    });
    
});

socket.on("alert", function (alerta){

    switch(alerta){
        case "Userinvalid":
            Swal.fire({
                icon: 'error',
                title: 'Sorry!!!',
                text: 'Usuário ou senha inválidos, tente novamente.',
                heightAuto: false,
                });
        break;
        case "Userconectado":
            $("#pagina").attr("hidden", true);
            $("#login").removeAttr("hidden");
            Swal.fire({
                icon: 'error',
                title: 'User Logado!!!',
                text: 'O club já está aberto em outra janela.',
                heightAuto: false,
                });
        break;
        case "Cadastrado":
            Swal.fire({
                icon: 'success',
                title: 'WoW!!!',
                text: 'Usuário cadastrado com sucesso.',
                heightAuto: false,
                });
        break;
        case "Cadastrojaexistente":
            Swal.fire({
                icon: 'error',
                title: 'Sorry!!!',
                text: 'Usuário já cadastrado.',
                heightAuto: false,
                });
        break;
        case "Loginnickinvalido":
            Swal.fire({
                icon: 'error',
                title: 'Sorry!!!',
                text: 'Você precisa digitar um login válido.',
                heightAuto: false,
                });
        break;
        case "Alteradosucess":
            Swal.fire({
                icon: 'success',
                title: 'WoW!!!',
                text: 'Sua cor foi alterada com sucesso.',
                heightAuto: false,
                });
        break;
        case "Fotoalterada":
            Swal.fire({
                icon: 'success',
                title: 'WoW!!!',
                text: 'Sua foto foi alterada com sucesso.',
                heightAuto: false,
                });
        break;
        case "Senhaalterada":
            Swal.fire({
                icon: 'success',
                title: 'WoW!!!',
                text: 'Sua senha foi alterada com sucesso.',
                heightAuto: false,
                });
        break;
        case "Senhanaoalterada":
            Swal.fire({
                icon: 'error',
                title: 'Sorry!!!',
                text: 'Senha antiga incorreta.',
                heightAuto: false,
                });
        break;
        case "Fotonaoalterada":
            Swal.fire({
                icon: 'error',
                title: 'Sorry!!!',
                text: 'Digite um link válido.',
                heightAuto: false,
                });
        break;
        case "Nickalterado":
            Swal.fire({
                icon: 'success',
                title: 'WoW!!!',
                text: 'Seu nick foi alterado com sucesso.',
                heightAuto: false,
                });
        break;
        case "Nicknaofoialterado":
            Swal.fire({
                icon: 'error',
                title: 'Sorry!!!',
                text: 'Escolha outro nick, Esse já está sendo utilizado.',
                heightAuto: false,
                });
        break;
        case "SemPermissao":
            Swal.fire({
                icon: 'error',
                title: 'Sorry!!!',
                text: 'Você não tem permissão para isso.',
                heightAuto: false,
                });
        break;
        case "Pvforme":
            Swal.fire({
                icon: 'error',
                title: 'FALHA NO PV!!!',
                text: 'Você não pode enviar mensagens privada para você mesmo.',
                heightAuto: false,
                });
        break;
        case "Vocefoikikado":
            Swal.fire({
                icon: 'error',
                title: 'Kikado',
                text: 'Você foi chutado da sala, respeite as regras.',
                heightAuto: false,             
                confirmButtonColor: "#0d5d0c",
                confirmButtonText: "RECONECTAR",
                preConfirm: () => {
                    location.reload(true);
                }
                });
        break;
        case "Vocefoibanido":
            Swal.fire({
                icon: 'error',
                title: 'BANIDO',
                text: 'Você foi banido da sala, Caso esteja arrependido entrar em contato com a equipe.',
                heightAuto: false,
                });
        break;
        case "CorInvalida":
            Swal.fire({
                icon: 'error',
                title: 'Sorry!!!',
                text: 'Digite uma cor e um brilho.',
                heightAuto: false,
                });
        break;
        case "reload":
            location.reload(true);
        break;
    }

});

socket.on("clear", function(clear, cargo){
    if(clear == `clear`){
        $( "li" ).remove( ".blockli" );
        $( "li" ).remove( ".cmd-audios" );
        $( "p" ).remove( "#helloroom" );
        $( "p" ).remove( "#byeroom" );
        $( "span" ).remove( ".comandos" );
    }
});

socket.on("session", function(token){
    if(!jwt){
        localStorage.setItem("jwt", token); //setar
    }
});

socket.on("logado", function (dados){
    // localStorage.setItem("login", dados.login); //setar
    // localStorage.setItem("senha", dados.senha); //setar
    const Toast = Swal.mixin({
        toast: true,
        position: 'top-end',
        showConfirmButton: false,
        timer: 2000,
        timerProgressBar: true,
        onOpen: (toast) => {
            toast.addEventListener('mouseenter', Swal.stopTimer)
            toast.addEventListener('mouseleave', Swal.resumeTimer)
        }
        })
        
        Toast.fire({
        icon: 'success',
        title: 'Você foi logado com sucesso!'
        })
    $("#login").attr("hidden", true);
    $("#pagina").removeAttr("hidden");
    $("#m").focus();
    document.getElementById("bemvindo").innerHTML = `<span><i>Olá <b class='colorbemvindo glitter'>${dados.nick}</b>, Seja bem vindo ao club!</i></span>`;
});

socket.on("digitando", function (valor, ico){
    if(valor == `add`){
        $('i').filter(`[data-ico="${ico}"]`).removeAttr("hidden");
    }else if(valor == `del`){
        $('i').filter(`[data-ico="${ico}"]`).attr("hidden", true);
    }
});

socket.on("webon", function (socket, func){
    if(func == `add`){
        $('i').filter(`[data-ico="web${socket}"]`).removeAttr("hidden");
    }else if(func == `del`){
        $('i').filter(`[data-ico="web${socket}"]`).attr("hidden", true);
    }
});

socket.on('users', function (users, cor) {
    var list = "";
    var listagem = {
        dev: 1,
        adm: 2,
        vip: 3,
        user:4,
    }      
    users = Object.entries(users).reduce((acc, [id, user]) => [...acc, {id, ...user }], []).sort((a,b) => listagem[a.cargo] - listagem[b.cargo]);
    for (var i in users){
        var u = users[i].cargo;            
        switch (u) {         
            case "dev":
                var cor = users[i].cor;
                var shadow = users[i].shadow;    
                var span = `text-shadow: ${shadow} 0px 0px 0.2rem, ${shadow} 0px 0px 0.2rem, ${shadow} 0px 0px 0.2rem;color: ${cor};`;
                
                list += `<div id="user-menu"><img class="imgprofile" src="${users[i].img}">
                <a id='privado' data-socket='${users[i].socket}' style='cursor: pointer;'>
                <span style="margin-left:9px;${span}" class='glitter nick'>${users[i].nome}</span>
                <span class='glitter cusers cargodev'>${users[i].cargo.toUpperCase()}</a>
                <a>
                <i id="vercam" style="color:#fff; margin-left:5px;" data-ico="web${users[i].socket}" 
                                        data-webid='${users[i].socket}' data-teste="${users[i].nome}" class="fas fa-video"hidden></i>
                <i id="typing" style="color:#fff; margin-left:5px;" data-ico="ico${users[i].socket}" class="fa fa-pencil-alt" hidden></i></a>
                </span><br></div>`;
            break;
            case "adm":
                var cor = users[i].cor;
                var shadow = users[i].shadow;
                var span = `text-shadow: ${shadow} 0px 0px 0.2rem, ${shadow} 0px 0px 0.2rem, ${shadow} 0px 0px 0.2rem;color: ${cor};`;

                list += `<div id="user-menu"><img class="imgprofile" src="${users[i].img}">
                <a id='privado' data-socket='${users[i].socket}' style='cursor: pointer;'>
                <span style="margin-left:9px;${span}" class='glitter nick'>${users[i].nome}</span> 
                <span class='glitter cargoadm cusers'>${users[i].cargo.toUpperCase()}</a>
                <a> 
                <i id="vercam" style="color:#fff; margin-left:5px;" data-ico="web${users[i].socket}" 
                                        data-webid="${users[i].socket}" class="fas fa-video"hidden></i>
                <i id="typing" style="color:#fff; margin-left:5px;" data-ico="ico${users[i].socket}" class="fa fa-pencil-alt" hidden></i>
                </span><br></div>`;
            break;
            case "vip":
                var cor = users[i].cor;
                var shadow = users[i].shadow;
                var span = `text-shadow: ${shadow} 0px 0px 0.2rem, ${shadow} 0px 0px 0.2rem, ${shadow} 0px 0px 0.2rem;color: ${cor};`;

                list += `<div id="user-menu"><img class="imgprofile" src="${users[i].img}">
                <a id='privado' data-socket='${users[i].socket}' style='cursor: pointer;'>
                <span style="margin-left:9px;${span}" class='glitter nick'>${users[i].nome}</span> 
                <span class='glitter cusers cargovip'>${users[i].cargo.toUpperCase()}</a>
                <a>
                <i id="vercam" style="color:#fff; margin-left:5px;" data-ico="web${users[i].socket}" 
                                        data-webid="${users[i].socket}" class="fas fa-video"hidden></i>
                <i id="typing" style="color:#fff; margin-left:5px;" data-ico="ico${users[i].socket}" class="fa fa-pencil-alt" hidden></i>
                </span><br></div>`;
            break;
            default:
                list += `<div id="user-menu"><img class="imgprofile" src="${users[i].img}">
                <a style='cursor: pointer;' id='privado' data-socket='${users[i].socket}'>
                <span style="margin-left:9px;" class='nick'>${users[i].nome}</span> 
                <span class='glitter cargo cusers'>
                <i id="vercam" style="color:#fff; margin-left:5px;" data-ico="web${users[i].socket}" 
                                        data-webid="${users[i].socket}" class="fas fa-video"hidden></i>
                <i id="typing" style="color:#fff; margin-left:5px;" data-ico="ico${users[i].socket}" class="fa fa-pencil-alt" hidden></i>
                </span><br></a></div>`;
                
        }

    }
    $("#users").html(`<span class="nameRoom">(${Object.keys(users).length}) Rbn Club!</span> <br><a class="navNick">${list}</a>`);

});

socket.on('listlive', function(array){
    setTimeout(function(){
        var i = 0;
        for(i=0;i < array.length; i++){
            $('i').filter(`[data-ico="web${array[i]}"]`).removeAttr("hidden");
        }
        }, 500);
    
});

socket.on('answer', (receive) =>{
    // console.log(`to: ${receive}`);
    socket.emit('answer', `${receive}`);
});
