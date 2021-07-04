const fs = require('fs');

var No = require('./no');

var grafo;

var nomeNoInicio = '1';
var nomeNoDestino = '100';

var iteracoes = 0;
var resultado;

var dados;

iniciar();

async function iniciar() {
    grafo = [];
    iteracoes = 0;
    resultado = [];
    
    lerDados('src/dados.txt');

    noInicio = new No(nomeNoInicio, 'P')
    noInicio.addRotulo(0, '-');
    noInicio = preencherAdjacentes(noInicio);
    updateOrAddNo(noInicio);

    await executar(nomeNoInicio);
    preencherCaminho(nomeNoDestino);
    imprimirResultado();
}

function lerDados(path) {
    dados = [];
    const data = fs.readFileSync(path, 'UTF-8');
    
    // split the contents by new line
    const lines = data.split(/\r?\n/);
    lines.forEach(l => {
        dados.push(l.split(","));
    })
}

async function executar(nomeNo, nomeNoAnterior = null) {
    let no = getNo(nomeNo);
    if (no.isFinalizado() || nomeNoAnterior == nomeNo) return;
    
    if (iteracoes % 1000 == 0) {
        await wait(50);
    }

    iteracoes++;

    var noAnterior = nomeNoAnterior ? getNo(nomeNoAnterior) : null;

    no = preencherAdjacentes(no);
    if (no.isTemp()) {
        no = preencherRotulo(no, noAnterior);
    } 
    updateOrAddNo(no);
    
    for await (const adj of no.getAdjacentes()) {
        await executar(adj[1], no.getNome());
    }

    if (no.isPerm()) {
        var adjMaisProximo = no.getAdjacenteMaisProximo(grafo);

        if (adjMaisProximo == undefined) return;
        
        var adj = getNo(adjMaisProximo[1]);
        if (adj.isPerm()) return;

        print(`Vertice ${no.getNome()}: adjascente mais próximo = ${adj.getNome()} (${adjMaisProximo[0]})`);
        adj.setPerm();
        updateOrAddNo(adj);

        no.setFinalizado();
        updateOrAddNo(no);

        await executar(adj.getNome(), no.getNome());
    }
}

function wait(milli) {
    return new Promise((resolve) => {
        setTimeout(resolve, milli)
    })
}

function preencherAdjacentes(no) {
    if (!no.possuiAdjacentes() && no.isPerm()) {
        print(`Vértice ${no.getNome()}: preenchendo adjacentes`);
        dados
            .filter(dado => dado[0] == no.getNome())
            .forEach(dado => no.addAdjascente(dado[2], dado[1]));
        dados
            .filter(dado => dado[1] == no.getNome())
            .forEach(dado => no.addAdjascente(dado[2], dado[0]));
    }
    return no;
}

function preencherRotulo(no, noAnterior = null) {
    if (noAnterior && no.getNome() != noAnterior.getNome()) {
        // print(`Vértice ${no.getNome()}: preenchendo ou atualizando rótulo e ordenando crescente`);
        let distanciaNoAnterior = noAnterior.getRotulos()[0][0];
        let distanciaNoAnteriorAteNo = noAnterior.getDistanciaAte(no.getNome());
        no.addRotulo(distanciaNoAnterior + distanciaNoAnteriorAteNo, noAnterior.getNome());
    }
    return no;
}

function getNo(nome) {
    if (grafo[nome] == undefined) {
        var no = grafo[nome] = new No(nome, 'T');
        return no;
    } else {
        return grafo[nome];
    }
}

function updateOrAddNo(no) {
    grafo[no.getNome()] = no;
}

function preencherCaminho(nomeNo) {
    let no = getNo(nomeNo);
    let menorCaminho = no.getRotulos()[0];
    
    resultado.unshift([menorCaminho[1], no.getNome(), menorCaminho[0]]);
    
    if (no.getNome() != nomeNoInicio) {
        preencherCaminho(menorCaminho[1])
    }
}

function imprimirResultado() {
    console.log('\n\nIterações', iteracoes);
    print("\nCaminho mais curto:");
    resultado.forEach(r => {
        if (r[1] != nomeNoInicio) {
            print(`${r[0]} => ${r[1]}: ${r[2]}`);
        }
    })
}

function print(msg) {
    console.log(msg);
}