const snd_click = './snd/click.mp3';
const snd_inicio = './snd/inicio.mp3';
const snd_risada = './snd/risada.mp3';
const snd_palmas = './snd/palmas.mp3';
let jogo = {
    matriz: [],  // matriz de jogo (contém 0, 1 ou 5)
    jogador: -1,  // jogador: 1 (usuário), 2 (cpu), 0 introdução e -1 pausa
    rodadas: 0,
    posvenc: [[0, 1, 2], [3, 4, 5], [6, 7, 8], [0, 3, 6],  // Posição vencedora na matriz
    [1, 4, 7], [2, 5, 8], [0, 4, 8], [2, 4, 6]],
    nrovenc: -1  // linha, coluna ou diagonal vencedora 0 a 7 (-1 empate ou em jogo)
}
let cron = {  // cronômetro
    min: 0,
    seg: 0,
    tempo: null  // armazena o ID da função cronometro para pausar o tempo
}


const bts = document.getElementById('botoes');
bts.addEventListener('click', eventos);

function eventos(pev) {
    if (!(pev.target.nodeName === 'BUTTON')) {
        return;
    }
    if (pev.target.id === 'iniciar' && jogo.jogador !== 0) {
        clearInterval(cron.tempo);  // remove a função do cronômetro
        som(snd_inicio, 1, 1.2);
        jogo.jogador = 0;
        cron.min = cron.seg = 0;
        document.getElementById('cron').innerHTML = '00:00';
        for (let i = 0; i < 9; i++) {
            document.getElementById('b' + i).style.backgroundColor = 'orange';
        }
        inicio3();
    } else {
        if (jogo.jogador === 1) {
            let bt = pev.target.id[1];  // calcula o nro. do botão pressionado (0 a 8).
            let lin = Math.floor(bt / 3);  // calcula lin (matriz de jogo) do botão press.
            let col = bt % 3;  // calcula col (matriz de jogo) do botão press.
            if (jogo.matriz[lin][col] === 0) {
                som(snd_click, 1, 1.2);
                document.getElementById(pev.target.id).innerHTML = 'X';
                jogo.matriz[lin][col] = 1;  // insere na matriz (lin, col) o valor 1 (usuário)
                jogo.rodadas++;  // uma rodada a mais
                jogo.jogador = 2;  // cpu (2) é a próxima a jogar 
                fimJogo();  // verifica fim do jogo após a jogada do usuário
            }
        }
    }
}

function cpu() {
    let lin, col;
    /*
    // IA

    JogadaIA - Função retorna a soma das jogadas do jogador 1 (Pessoa). Caso retorne 2:
        Caso retorne 2: Chama DefendeIA() - FEITO
        AtacaIA() - jogada inicial evita os botões 2, 4, 6, 8 (round 1 ou 2) - FEITO
                  - pega posições que a soma é igual a 5 ou 10 (10 é prioridade, pois é ataque final)- FEITO
                    * das posições vitoriosas "selecionadas", caso o 5 não esteja no meio (índice 1), jogar no canto oposto. - NÃO FEITO
    */

    if (!jogadaIA()) {
        alert("Jogada aleatória")
        do {   // gera na matriz (lin, col) uma posição vazia (0)
            lin = Math.floor(Math.random() * 3);  // gera uma linha de 0 a 2
            col = Math.floor(Math.random() * 3);  // gera uma coluna de 0 a 2
        } while (jogo.matriz[lin][col] !== 0);  // enquanto diferente de vazio (0)
        som(snd_click, 1, 1.2);
        let bt = lin * 3 + col;  // calcula qual botão foi "escolhido" pela cpu
        document.getElementById('b' + bt).innerHTML = 'O';  // insere círculo (O) na posição 
        jogo.matriz[lin][col] = 5;  // insere na matriz (lin, col) o valor 5 (cpu)
        jogo.jogador = 1;  // usuário (1) é o próximo a jogar
        jogo.rodadas++;  // uma rodada a mais
        fimJogo();  // verifica fim do jogo após a jogada da cpu    
    }
}

function cronometro() {
    cron.seg++;  // incrementa os segundos
    if (cron.seg === 60) {  // verifica se seg chegou a 60
        cron.min++;  // incrementa os minutos
        cron.seg = 0;  // reinicia os segundos (zero)
    }
    m = cron.min < 10 ? '0' + cron.min : '' + cron.min;  // acrescenta um 0 à esq. se < 10
    s = cron.seg < 10 ? '0' + cron.seg : '' + cron.seg;
    document.getElementById('cron').innerHTML = m + ':' + s;
}

function fimJogo() {
    let fim = false;
    // Somas das linhas, colunas e diagonais
    let somas = somatoria();

    for (let i = 0; i < 8; i++) {
        if (somas[i] === 3) {  // soma 3 indica X como ganhador
            som(snd_palmas, 0.8, 1);
            jogo.nrovenc = i;  // armazena a linha, coluna ou diagonal do vencedor (usuário)
            fim = true;
        } else if (somas[i] === 15) {  // soma 15 indica O como ganhador
            som(snd_risada, 1, 1.4);
            jogo.nrovenc = i;  // armazena a linha, coluna ou diagonal do vencedor (cpu)
            fim = true;
        }
    }
    if (jogo.rodadas === 9)  // verifica se foi a última rodada e termina o jogo
        fim = true;
    if (fim) {
        resultado();  // mostra o resultado
        clearInterval(cron.tempo);  // pausa o cronômetro
        jogo.jogador = -1;  // jogo é pausado
    }
    else if (jogo.jogador == 2)  // verifica se o próximo jogador é a cpu
        setTimeout(cpu, 2000);  // agenda a jogada da CPU para 2 segundos a partir desse momento
}

function resultado() {
    for (let i = 0; i < 9; i++) {  // define cinza para todos os botões (matriz de jogo)
        document.getElementById('b' + i).style.backgroundColor = 'gray';
    }
    if (jogo.nrovenc !== -1) {  // verifica se houve vencedor
        for (let bt of jogo.posvenc[jogo.nrovenc]) {  // altera a cor da lin, col ou diag vencedora
            document.getElementById('b' + bt).style.backgroundColor = 'orange';
        }
    }
}

function inicio3() {
    for (let i = 0; i < 9; i++) {
        document.getElementById('b' + i).innerHTML = '3';
    }
    setTimeout(inicio2, 1000);  // agenda a função inicio2 para 1 seg depois
}

function inicio2() {
    for (let i = 0; i < 9; i++) {
        document.getElementById('b' + i).innerHTML = '2';
    }
    setTimeout(inicio1, 1000);  // agenda a função inicio1 para 1 seg depois
}

function inicio1() {
    for (let i = 0; i < 9; i++) {
        document.getElementById('b' + i).innerHTML = '1';
    }
    setTimeout(inicio, 1000);  // agenda a função inicio para 1 seg depois
}

function inicio() {
    cron.tempo = setInterval(cronometro, 1000);  // inicia a função cronometro a cada 1 seg.
    jogo.jogador = Math.floor(Math.random() * 2 + 1);  // sorteia quem inicia o jogo (1 ou 2)
    jogo.matriz = [[0, 0, 0],
    [0, 0, 0],
    [0, 0, 0]];  // 0: vazio, 1: X e 5: O
    jogo.rodadas = 0;
    jogo.nrovenc = -1;  // -1 indica empate ou em jogo
    for (let i = 0; i < 9; i++) {  // apaga o conteúdos dos botôes (matriz de jogo)
        document.getElementById('b' + i).innerHTML = '';
    }
    if (jogo.jogador === 2)  // se a cpu inicia, agenda a joga da cpu para 0,1 seg.
        setTimeout(cpu, 100);
}

function som(psom, pvol, pvel) {
    let snd = new Audio(psom);
    snd.playbackRate = pvel;
    snd.volume = pvol;
    snd.play();
}

function somatoria() {
    let somatoria = [];

    somatoria.push(jogo.matriz[0][0] + jogo.matriz[0][1] + jogo.matriz[0][2]);
    somatoria.push(jogo.matriz[1][0] + jogo.matriz[1][1] + jogo.matriz[1][2]);
    somatoria.push(jogo.matriz[2][0] + jogo.matriz[2][1] + jogo.matriz[2][2]);
    somatoria.push(jogo.matriz[0][0] + jogo.matriz[1][0] + jogo.matriz[2][0]);
    somatoria.push(jogo.matriz[0][1] + jogo.matriz[1][1] + jogo.matriz[2][1]);
    somatoria.push(jogo.matriz[0][2] + jogo.matriz[1][2] + jogo.matriz[2][2]);
    somatoria.push(jogo.matriz[0][0] + jogo.matriz[1][1] + jogo.matriz[2][2]);
    somatoria.push(jogo.matriz[0][2] + jogo.matriz[1][1] + jogo.matriz[2][0]);

    return somatoria;
}

function jogadaIA() {

    let soma = somatoria();

    for (let i = 0; i < 8; i++) {
        if (soma[i] === 2) {

            return defendeIA(); //retorno evita jogada aleatória da CPU


        } else if (i == 7) {

            return atacaIA(); //retorno evita jogada aleatória da CPU

        }
    }

    //return false; //retorno permite jogada aleatória da CPU

}

function defendeIA() {
    alert('entrou defesa');

    let soma = somatoria();

    for (let i = 0; i < 8; i++) {

        if (soma[i] == 10) {
            alert("Possível ataque final");
            return atacaIA();

        }

    }

    for (let i = 0; i < 8; i++) {

        if (soma[i] === 2) {
            alert("Defesa normal");
            for (let j = 0; j < jogo.posvenc[i].length; j++) {

                let botao = jogo.posvenc[i][j];

                let lin = Math.floor(botao / 3);
                let col = botao % 3;

                if (jogo.matriz[lin][col] === 0) {

                    som(snd_click, 1, 1.2);
                    document.getElementById('b' + botao).innerHTML = 'O';  // insere círculo (O) na posição 
                    jogo.matriz[lin][col] = 5;  // insere na matriz (lin, col) o valor 5 (cpu)
                    jogo.jogador = 1;  // usuário (1) é o próximo a jogar
                    jogo.rodadas++;  // uma rodada a mais
                    fimJogo();  // verifica fim do jogo após a jogada da cpu

                    return true;
                }

            }

        }

    }

    return false;
}

function atacaIA() {
    alert("Entrou no ataque");

    let somas = somatoria();

    if (jogo.rodadas === 0 || jogo.rodadas === 1) { //PRIMEIRA JOGADA DA CPU
        alert("Entrou primeira jogada CPU")

        do {   // gera na matriz (lin, col) uma posição vazia (0)
            lin = Math.floor(Math.random() * 3);  // gera uma linha de 0 a 2
            col = Math.floor(Math.random() * 3);  // gera uma coluna de 0 a 2
            btn = lin * 3 + col;  // calcula qual botão foi "escolhido" pela cpu
        } while (jogo.matriz[lin][col] !== 0 ||/*&&*/ (btn === 1 || btn === 3 || btn === 5 || btn === 7));
        alert('Condição while: ' + (jogo.matriz[lin][col] !== 0 ||/*&&*/ (btn === 1 || btn === 3 || btn === 5 || btn === 7)));
        alert((btn === 1 || btn === 3 || btn === 5 || btn === 7));
        som(snd_click, 1, 1.2);
        document.getElementById('b' + btn).innerHTML = 'O';  // insere círculo (O) na posição 
        jogo.matriz[lin][col] = 5;  // insere na matriz (lin, col) o valor 5 (cpu)
        jogo.jogador = 1;  // usuário (1) é o próximo a jogar
        jogo.rodadas++;  // uma rodada a mais
        fimJogo();  // verifica fim do jogo após a jogada da cpu    

        return true;

    } else {

        for (let i = 0; i < 8; i++) {
            if (somas[i] === 10) {
                alert("ATAQUE FINAL")

                for (let j = 0; j < jogo.posvenc[i].length; j++) {

                    let botao = jogo.posvenc[i][j];

                    let lin = Math.floor(botao / 3);
                    let col = botao % 3;

                    if (jogo.matriz[lin][col] === 0) {

                        som(snd_click, 1, 1.2);
                        document.getElementById('b' + botao).innerHTML = 'O';  // insere círculo (O) na posição 
                        jogo.matriz[lin][col] = 5;  // insere na matriz (lin, col) o valor 5 (cpu)
                        jogo.jogador = 1;  // usuário (1) é o próximo a jogar
                        jogo.rodadas++;  // uma rodada a mais
                        fimJogo();  // verifica fim do jogo após a jogada da cpu

                        return true;
                    }

                }

            }
        }

        for (let i = 0; i < 8; i++) {
            if (somas[i] === 5) {
                alert("ataque soma 5")

                for (let j = 0; j < jogo.posvenc[i].length; j++) {

                    let botao = undefined

                    if (jogo.posvenc[i][0] === 0 && jogo.posvenc[i][1] === 0) {
                        botao = jogo.posvenc[i][0];
                        alert("primeira indice")

                    } else if (jogo.posvenc[i][2] === 0 && jogo.posvenc[i][1] === 0) {
                        botao = jogo.posvenc[i][2];
                        alert("segundo indice")

                    } else {
                        botao = jogo.posvenc[i][j];
                        alert("nem ligou indice    " + j);
                    }
                    alert(jogo.posvenc[i][0] + ' ' + jogo.posvenc[i][1] + ' ' + jogo.posvenc[i][2]);

                    let lin = Math.floor(botao / 3);
                    let col = botao % 3;

                    if (jogo.matriz[lin][col] === 0) {

                        jogo.matriz[lin][col] = 5;

                        som(snd_click, 1, 1.2);
                        document.getElementById('b' + botao).innerHTML = 'O';  // insere círculo (O) na posição 
                        jogo.matriz[lin][col] = 5;  // insere na matriz (lin, col) o valor 5 (cpu)
                        jogo.jogador = 1;  // usuário (1) é o próximo a jogar
                        jogo.rodadas++;  // uma rodada a mais
                        fimJogo();  // verifica fim do jogo após a jogada da cpu

                        return true;
                    }

                }

            }
        }

    }

    return false;
}