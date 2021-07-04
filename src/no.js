class No {

    tipo;
    nome;
    adjacentes;
    rotulos;
    finalizado;

    constructor(nome, tipo = 'T') {
        this.nome = nome;
        this.tipo = tipo;
        this.rotulos = [];
        this.adjacentes = null;
        this.finalizado = false;
    }

    getNome = () => this.nome;
    isTemp = () => this.tipo == 'T';
    isPerm = () => this.tipo == 'P';

    setPerm() { 
        this.tipo = 'P' 
    };

    possuiAdjacentes = () => this.adjacentes != null;

    addAdjascente(distancia, nome) {
        if (nome == this.getNome()) return;

        this.adjacentes = !this.adjacentes ? [] : this.adjacentes;  
        //não adiciona caso já tenha sido adicionado
        if (this.adjacentes.filter(adj => adj[1] == nome).length) return;

        this.adjacentes.push([distancia, nome]);
    }

    getAdjacentes = () => this.adjacentes || [];
    getAdjacente = (nomeNo) => this.adjacentes.filter(adj => adj[1] == nomeNo)[0];
    
    addRotulo(distancia, nome) {
        if (nome == this.getNome()) return; 

        if (this.rotulos.filter(r => r[1] == nome).length) return;

        this.rotulos.push([distancia, nome]);
        this.rotulos.sort((a, b) => a[0] - b[0]);
    }

    getRotulos = () => this.rotulos;

    getDistanciaAte(nomeNo) {
        return this.getAdjacente(nomeNo)[0];
    }

    getAdjacenteMaisProximo(grafo) {
        this.adjascentes = this.adjacentes.sort((a, b) => a[0] - b[0]);
        let adjascente;
        for (const adj of this.adjacentes.sort((a, b) => a[0] - b[0])) {
            if (grafo[adj[1]] == undefined || !grafo[adj[1]].isFinalizado()) {
                adjascente = adj;
                break;
            }
        }
        return adjascente;
    }

    setFinalizado() {
        this.finalizado = true;
    }

    isFinalizado = () => this.finalizado;
}

module.exports = No;