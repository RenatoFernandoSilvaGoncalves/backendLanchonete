import PedidoDB from "../DB/pedidoDB.js";

export default class Pedido {
    #codigo
    #data
    #valorTotal
    #itens

    constructor(codigo, data, valorTotal, itens = []) {
        this.#codigo = codigo
        this.#data = data
        this.#valorTotal = valorTotal
        this.#itens = itens
    }

    get codigo() { return this.#codigo }
    get data() { return this.#data }
    get valorTotal() { return this.#valorTotal }
    get itens() { return this.#itens }

    set codigo(codigo) { this.#codigo = codigo }
    set data(data) { this.#data = data }
    set valorTotal(valorTotal) { this.#valorTotal = valorTotal }
    set itens(itens) { this.#itens = itens }

    toJSON() {
        return {
            codigo: this.#codigo,
            data: this.#data,
            valorTotal: this.#valorTotal,
            itens: this.#itens
        }
    }

    async gravar() {
        const pedidoDB = new PedidoDB();
        return await pedidoDB.gravar(this);
    }

    async consultar() {
        const pedidoDB = new PedidoDB();
        return await pedidoDB.consultar();
    }
}
