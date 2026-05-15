export default class ItemPedido {
    #codigo
    #produto
    #quantidade
    #valorUnitario

    constructor(codigo, produto, quantidade, valorUnitario) {
        this.#codigo = codigo
        this.#produto = produto
        this.#quantidade = quantidade
        this.#valorUnitario = valorUnitario
    }

    get codigo() { return this.#codigo }
    get produto() { return this.#produto }
    get quantidade() { return this.#quantidade }
    get valorUnitario() { return this.#valorUnitario }
    get subtotal() { return this.#quantidade * this.#valorUnitario }

    set codigo(codigo) { this.#codigo = codigo }
    set produto(produto) { this.#produto = produto }
    set quantidade(quantidade) { this.#quantidade = quantidade }
    set valorUnitario(valorUnitario) { this.#valorUnitario = valorUnitario }

    toJSON() {
        return {
            codigo: this.#codigo,
            produto: this.#produto,
            quantidade: this.#quantidade,
            valorUnitario: this.#valorUnitario,
            subtotal: this.subtotal
        }
    }
}
