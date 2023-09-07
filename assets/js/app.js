

(() => {
    'use strict'

    let baraja       = [''];
    const tipos      = ['C','D','H','S'],
          especiales = ['A','J','Q','K'];

    //let puntosJugador = 0;
   // let puntosComputadora = 0;
    let puntosJugadores = [];

    //Referencias del html
    const btnPedir = document.querySelector('#btnPedir'),
          btnDetener = document.querySelector('#btnDetener'),
          btnNuevo = document.querySelector('#btnNuevo');

    const divCartasJugadores = document.querySelectorAll('.divCartas'),
          puntosHTML = document.querySelectorAll('small'),
          mensaje = document.querySelector('#mensaje');

    //Inicializar el juego
    const inicializarJuego = ( numJugadores = 2 ) => {
        baraja = crearBaraja();
        puntosJugadores = [];
        for( let i = 0; i< numJugadores; i++ ) {
            puntosJugadores.push(0);
        }    

        puntosHTML.forEach(elem => elem.innerText = 0); //Reinicia los puntos de los jugadores
        divCartasJugadores.forEach(elem => elem.innerHTML = ''); //Borra las cartas
      
        btnPedir.disabled = false;
        btnDetener.disabled = false;

        mensaje.innerText = ('');
    }

    //Creando nueva baraja
    const crearBaraja = () => {
        baraja = [];
        for (let i = 2; i <= 10; i++ ){
            for(let tipo of tipos){
                baraja.push(i + tipo);
            } 
        }
        for (let tipo of tipos){
            for(let esp of especiales){
                baraja.push(esp + tipo);
            }
        }
        return _.shuffle( baraja );  
    }
    
    //Tomando a carta 
    const pedirCarta = () => {

        if (baraja.length === 0) {
            throw 'La baraja está vacía. No se puede pedir más cartas.';
        }
        return baraja.shift();
    }

    const valorCarta = (carta) => {

        const valor = carta.substring(0, carta.length -1);
        let puntos = 0;
        if( isNaN( valor )){
            puntos = (valor === 'A') ? 11 : 10;
        }else{
            puntos = (valor * 1);
        }
        return puntos;
    }

    //Turno 0 = Primer Jugador y el ultimo siempre sera la computadora
    const acumularPuntos = ( carta, turno ) =>{
        puntosJugadores[turno] = puntosJugadores[turno] + valorCarta(carta);
        puntosHTML[turno].innerText = puntosJugadores[turno];

        return puntosJugadores[turno];
    }

    const crearCarta = (carta, turno) => {
        const imgCarta = document.createElement('img');
        imgCarta.src = `assets/cartas/${carta}.png`;
        imgCarta.className = 'carta';
        divCartasJugadores[turno].append(imgCarta);
    }

    //Turno de la computadora
    const turnoComputadora = (puntosMinimos) => {

        const intervalo = 700; // Intervalo de tiempo en milisegundos (1000 = 1 segundo)
        let puntosComputadora = 0;
        const realizarTurno = () => {

        const carta = pedirCarta();
        puntosComputadora = acumularPuntos(carta, puntosJugadores.length -1);
        crearCarta(carta, puntosJugadores.length -1);
        
        if (puntosMinimos > 21) {
            generarMensajes(puntosMinimos, puntosComputadora);
            return;
        }
        if (puntosComputadora <= puntosMinimos && puntosMinimos <= 21) {
            setTimeout(realizarTurno, intervalo);
        } else {
                
            generarMensajes(puntosMinimos, puntosComputadora);
        }    
        };   
        realizarTurno();
    };       

    //Eventos
    btnPedir.addEventListener('click', () => {

        const carta = pedirCarta();
        const puntosJugador = acumularPuntos(carta, 0);

        crearCarta(carta, 0);

        if(puntosJugador > 21){
            btnPedir.disabled = true;
            btnDetener.disabled = true;
            turnoComputadora(puntosJugador);
         
        }else if(puntosJugador === 21){
            btnPedir.disabled = true;
            btnDetener.disabled = true;
            turnoComputadora(puntosJugador);
        }
    });


    //Detener
    btnDetener.addEventListener('click', () => {
        const carta = pedirCarta();
        turnoComputadora(puntosJugadores[0]);
        btnPedir.disabled = true;
        btnDetener.disabled = true;
    })


    //Nuevo Juego
    btnNuevo.addEventListener('click', () => {
        console.clear();
        inicializarJuego()
        mensaje.classList.remove('background');
    });

    //Conteo de Puntuaciones
    function generarMensajes(puntosMinimos, puntosComputadora) {

        let empateCount = parseInt(sessionStorage.getItem('empateCount')) || 0;
        let perdisteCount = parseInt(sessionStorage.getItem('perdisteCount')) || 0;
        let ganasteCount = parseInt(sessionStorage.getItem('ganasteCount')) || 0;


        if (puntosComputadora === puntosMinimos) {
        empateCount++;
        sessionStorage.setItem('empateCount', empateCount);
        mensaje.innerText = (`EMPATE!! \n Computadora: ${perdisteCount} Jugador: ${ganasteCount}`);
        mensaje.classList.add('background');

        }else if (puntosMinimos > 21) {
        perdisteCount++;
        sessionStorage.setItem('perdisteCount', perdisteCount);
        mensaje.innerText = (`PERDISTE!! :( \n Computadora: ${perdisteCount} Jugador: ${ganasteCount} `);
        mensaje.classList.add('background');


        }else if (puntosComputadora > 21 || puntosMinimos === 21){
        ganasteCount++;
        sessionStorage.setItem('ganasteCount', ganasteCount);
        mensaje.innerText = (`¡¡GANASTE¡¡ :) \n Computadora: ${perdisteCount} Jugador: ${ganasteCount}`);
        mensaje.classList.add('background');


        }else{
            perdisteCount++;
            mensaje.innerText = (`¡¡PERDISTE¡¡ :( \n Computadora: ${perdisteCount} Jugador: ${ganasteCount}`);
            mensaje.classList.add('background'); 
        }
    }

})();

