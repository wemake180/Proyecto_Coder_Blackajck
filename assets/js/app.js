/**
 * 2C = TWO OF CLUBS
 * 2D = TWO OF DIAMONDS
 * 2H = TWO OF  HEARTS
 * 2S = TWO OF SPADES
 */

let = deck       = [];
const tipos      = ['C','D','H','S'];
const especiales = ['A','J','Q','K'];

let puntosJugador = 0;
let puntosComputadora = 0;


//Referencias del html

const btnPedir = document.querySelector('#btnPedir');
const puntosHTML = document.querySelectorAll('small');
const divCartasJugador = document.querySelector('#jugador-cartas');
const divCartasComputadora = document.querySelector('#computadora-cartas');
const btnDetener = document.querySelector('#btnDetener');
const btnNuevo = document.querySelector('#btnNuevo');
const mensaje = document.querySelector('#mensaje');

//Creando nuevo deck
const crearDeck = () => {
    for (let i = 2; i <= 10; i++ ){
        for(let tipo of tipos){
            deck.push(i + tipo);
        } 
    }

    for (let tipo of tipos){
        for(let esp of especiales){
            deck.push(esp + tipo);
        }
    }

    //console.log( deck );
    deck = _.shuffle( deck ) ;
    console.log( deck );
    return deck;
}
crearDeck();

//Tomando a carta 

const pedirCarta = () => {

    if (deck.length === 0) {
        console.log("La baraja está vacía. No se puede pedir más cartas.");
        return null;
    }

    const carta= deck.shift();
    return carta;
}

//pedirCarta();

const valorCarta = (carta) => {

    const valor = carta.substring(0, carta.length -1);
    //let puntos = 0;
    if( isNaN( valor )){
        puntos = (valor === 'A') ? 11 : 10;
    }else{
        puntos = valor * 1;
    }
    return puntos;
}

//Turno de la computadora

const turnoComputadora = (puntosMinimos) => {

    const intervalo = 700; // Intervalo de tiempo en milisegundos (1000 = 1 segundo)

    const realizarTurno = () => {
    const carta = pedirCarta();
    puntosComputadora = puntosComputadora + valorCarta(carta);
    puntosHTML[1].innerText = puntosComputadora;
    
    const imgCarta = document.createElement('img');
    imgCarta.src = `assets/cartas/${carta}.png`;
    imgCarta.className = 'carta';
    divCartasComputadora.append(imgCarta);
    
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
    puntosJugador = puntosJugador + valorCarta(carta);
    puntosHTML[0].innerText = puntosJugador;

    const imgCarta = document.createElement('img');
    imgCarta.src = `assets/cartas/${carta}.png`;
    imgCarta.className = ('carta');
    divCartasJugador.append(imgCarta);

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
    turnoComputadora(puntosJugador);
    btnPedir.disabled = true;
    btnDetener.disabled = true;
})


//Nuevo Juego

btnNuevo.addEventListener('click', () => {

    console.clear();

    deck = [];
    deck = crearDeck();

    puntosJugador     = 0;
    puntosComputadora = 0;

    puntosHTML[0].innerText = 0;
    puntosHTML[1].innerText = 0;

    divCartasComputadora.innerHTML = '';
    divCartasJugador.innerHTML = '';

    btnPedir.disabled = false;
    btnDetener.disabled = false;

    mensaje.innerText = ('');
});


//Mensaje de Victoria

function generarMensajes(puntosMinimos, puntosComputadora) {


    if (puntosComputadora === puntosMinimos) {
      mensaje.innerText = ('EMPATE!!');

    }else if (puntosMinimos > 21) {
      mensaje.innerText = ('PERDISTE :(!!');

    }else if (puntosComputadora > 21 || puntosMinimos === 21){
      mensaje.innerText = ('¡¡GANASTE :)!!');

    }else{
        mensaje.innerText = ('¡¡PERDISTE :(!!');
    }
  }
