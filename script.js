// Funcao que cria elementos e define a classe para o elemento criado
function novoElemento(tagName, className) {
    const elem = document.createElement(tagName);
    elem.className = className;
    return elem;
}

// Funcao construtora que cria as barreiras normais e reversas
function Barreira(reversa = false) {
    // cria o elemento barreira
    this.elemento = novoElemento('div', 'barreira');
    // Cria o corpo e borda do cano
    const borda = novoElemento('div', 'borda');
    const corpo = novoElemento('div', 'corpo');
    // Define o posicionamento do corpo e borda na posicao normal ou reversa e insere na pagina
    this.elemento.appendChild(reversa ? corpo : borda)
    this.elemento.appendChild(reversa ? borda : corpo)
    // Define a altura do corpo
    this.setAltura = altura => corpo.style.height = `${altura}px`
}

// para teste da barreira
// const b = new Barreira(true)
// b.setAltura(200);
// document.querySelector('[wm-flappy]').appendChild(b.elemento);

// Funcao construtora que cria o par de berreiras
function ParDeBarreiras(altura, abertura, x) {
    // cria o elemento par de barreiras para crias as 2 barreiras
    this.elemento = novoElemento('div', 'par-de-barreiras');

    // usamos o this aqui para tornar o elemento visivel externo a funcao
    // Intanciamos a funcao Barreiras para criar a berreira sup. e inf.
    this.superior = new Barreira(true)
    this.inferior = new Barreira(false)

    // Definimos a insercao dos elementos sup. e inf. na pagina html
    this.elemento.appendChild(this.superior.elemento)
    this.elemento.appendChild(this.inferior.elemento)

    // Calculo da abertura das barreiras de forma aleatoria
    this.sortearAbertura = () => {
        const alturaSuperior = Math.random() * (altura - abertura);
        const alturainferior = altura - abertura - alturaSuperior;
        this.superior.setAltura(alturaSuperior);
        this.inferior.setAltura(alturainferior);
    }

    // Pegamos o valor da berreira em px(string) e retiramos o 'px' do valor e pegamos apenas o numeros
    //Precisamos fazer um parseInt para retornar o valor em numero ao inves de string
    this.getX = () => parseInt(this.elemento.style.left.split('px')[0])

    // Setamos a posicao das barreiras no eixo X apartir da linha da esq
    this.setX = x => this.elemento.style.left = `${x}px`

    //Pegamos a largura do elemento
    this.getLargura = () => this.elemento.clientWidth

    // Ja chamamos a funcao para sortear a abertura e definir a posicao de x
    this.sortearAbertura();
    this.setX(x)
}

// para teste do par de barreiras
// const b = new ParDeBarreiras(700, 200, 400);
// document.querySelector('[wm-flappy]').appendChild(b.elemento);

// Funcao contrutora para criar todas as berreiras do jogo
function Barreiras(altura, largura, abertura, espaco, notificarPonto) {
    // Criamos um array para armazenar as 4 barreiras que vamos usar no jogo
    this.pares = [
        new ParDeBarreiras(altura, abertura, largura),
        new ParDeBarreiras(altura, abertura, largura + espaco),
        new ParDeBarreiras(altura, abertura, largura + espaco * 2),
        new ParDeBarreiras(altura, abertura, largura + espaco * 3)
    ]

    // Valor do deslocmaanto em pixel a cada nova atualizacao da tela
    const deslocamento = 3;

    this.animar = () => {
        // Para cada para de barreiras pegamos a posicao atual de x e deslocamos 3px para esq.
        this.pares.forEach(par => {
            par.setX(par.getX() - deslocamento)

            // Para quando o elemento sair do jogo
            // Quando a posicao de x for menor que o corpo do elemento entao sabemos que saiu da area do jogo
            if (par.getX() < -par.getLargura()) {
                // Pegamos o valor atual de de x e somamos os espaco entre as barreiras * o numeros de barreiras
                // Desta forma levamos os elemnto para o final direita da area do jogo
                par.setX(par.getX() + espaco * this.pares.length)
                par.sortearAbertura();
            }

            // Quando identificarmos que a barreira passou do meio do jogo entao sabemos que temos que inrementar 1 ponto para o usuario
            const meio = largura / 2;
            // Quando cruzou o meio a variavel cruzouMeio fica em true
            const cruzouMeio = par.getX() + deslocamento >= meio && par.getX() < meio
            // Se cruzou meio adiciona ponto
            // TRUE && notificarPonto(); (chama funcao callback para incrementar ponto)
            // FALSE && notificarPonto(); (nao faz nada)
            cruzouMeio && notificarPonto();
        })
    }
}

function Passaro(alturaJogo) {
    let voando = false
    // Criamos o elemento passaro
    this.elemento = novoElemento('img', 'passaro');
    // Passamos o caminho da imagem
    this.elemento.src = 'imgs/passaro.png'
    // Pegamos o valor do elemento em px(string) e retiramos o 'px' do valor e pegamos apenas o numeros
    //Precisamos fazer um parseInt para retornar o valor em numero ao inves de string
    this.getY = () => parseInt(this.elemento.style.bottom.split('px')[0])
    // Definimos a altura do passaro
    this.setY = y => this.elemento.style.bottom = `${y}px`

    // Quando alguma tecla pressionada define flag informando que o passaro esta voando(subir)
    window.onkeydown = e => voando = true
    // Quando a tecla pressionada é solta reseta flag informando que o passaro esta voando(descer)
    window.onkeyup = e => voando = false

    // Caso a flag voando seja true sobe 8px, caso seja false desce 5px na tela 
    this.animar = () => {
        const novoY = this.getY() + (voando ? 5 : -3)
        // Definimos a altura maxima que o passaro pode se deslocar
        const alturaMaxima = alturaJogo - this.elemento.clientHeight

        // Seta a altura maxima e minima do passaro
        if (novoY <= 0) {
            this.setY(0)
        } else if (novoY >= alturaMaxima) {
            this.setY(alturaMaxima)
        } else {
            this.setY(novoY)
        }
    }

    this.setY(alturaJogo / 2)

}


function Progresso() {
    this.elemento = novoElemento('span', 'progresso');
    this.atualizaPontos = pontos => {
        this.elemento.innerHTML = pontos
    }
    this.atualizaPontos(0)
}


// PARA TESTAR
// const barreiras = new Barreiras(700, 1100, 200, 400);
// // Instanciamos a funcao passaro passando a altura do jogo sendo 700px
// const passaro = new Passaro(700);
// const progresso = new Progresso();
// const areaDoJogo = document.querySelector('[wm-flappy]')

// // Chama a criacao dos elementos na tela
// barreiras.pares.forEach(par => areaDoJogo.appendChild(par.elemento))
// areaDoJogo.appendChild(passaro.elemento)
// areaDoJogo.appendChild(progresso.elemento)
// // Setamos um intervalo para fazer o delocamento das barreiras
// setInterval(() => {
//     barreiras.animar()
//     passaro.animar()
// }, 20);

function estaoSobrepostos(elementoA, elementoB) {
    // Retorna o tamanho do retangulo do elemento
    const a = elementoA.getBoundingClientRect()
    const b = elementoB.getBoundingClientRect()

    // Verifica se houve colisao
    const horizontal = (a.left + a.width >= b.left) && (b.left + b.width >= a.left)
    const vertical = (a.top + a.height >= b.top) && (b.top + b.height >= a.top)

    // Se retornar true indica que houve colisao
    return horizontal && vertical
}

function colidiu(passaro, barreiras) {
    let colidiu = false;
    barreiras.pares.forEach(parDeBarreiras => {
        if (!colidiu) {
            // Pega a posicao das barreiras
            const superior = parDeBarreiras.superior.elemento
            const inferior = parDeBarreiras.inferior.elemento
            // Verifica se houve colisao entre passaro e barreira sup ou inf
            colidiu = estaoSobrepostos(passaro.elemento, superior) || estaoSobrepostos(passaro.elemento, inferior)
        }
    })
    return colidiu;
}


// funcao que monta todas os elementos do jogo
function flappyBird() {
    let pontos = 0;
    // Definimos a area(div) onde sera o jogo
    const areaDoJogo = document.querySelector('[wm-flappy]')
    // Salvamos a altura do jogo
    const altura = areaDoJogo.clientHeight
    // Salvamos a largura do jogo
    const largura = areaDoJogo.clientWidth


    const progresso = new Progresso();
    // O ponto é adidionado quando a funcao callback notificarPonto() em barreiras é chamada
    const barreiras = new Barreiras(altura, largura, 200, 400, () => progresso.atualizaPontos(++pontos))
    const passaro = new Passaro(altura);

    // Adicionando os elementos ao jogo
    areaDoJogo.appendChild(progresso.elemento);
    areaDoJogo.appendChild(passaro.elemento);
    barreiras.pares.forEach(par => areaDoJogo.appendChild(par.elemento))

    this.start = () => {
        const temporizador = setInterval(() => {
            barreiras.animar();
            passaro.animar();

            // caso tenha ocorrido a colisao, para o temporizador
            if (colidiu(passaro, barreiras)) {
                clearInterval(temporizador)
            }
        }, 20);
    }
}

// chamada da funcao principal do jogo
new flappyBird().start();