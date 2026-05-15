import ProdutoDB from "../DB/produtoDB.js";
export default class Produto {
    #codigo
    #nome
    #ingredientes
    #preco
    #imagem
    
    constructor(codigo, nome, ingredientes, preco, imagem) {
        this.#codigo = codigo
        this.#nome = nome
        this.#ingredientes = ingredientes
        this.#preco = preco
        this.#imagem = imagem
    }

    get codigo() {
        return this.#codigo
    }

    get nome() {
        return this.#nome
    }

    get ingredientes() {
        return this.#ingredientes
    }

    get preco() {
        return this.#preco
    }

    get imagem() {
        return this.#imagem
    }

    set codigo(codigo) {
        this.#codigo = codigo
    }

    set nome(nome) {
        this.#nome = nome
    }

    set ingredientes(ingredientes) {
        this.#ingredientes = ingredientes
    }

    set preco(preco) {
        this.#preco = preco
    }

    set imagem(imagem) {
        this.#imagem = imagem
    }

    toJSON() {
        return {
            codigo: this.#codigo,
            nome: this.#nome,
            ingredientes: this.#ingredientes,
            preco: this.#preco,
            imagem: this.#imagem
        }
    }

    async gravar(){}
    async alterar(){}
    async excluir(){}
    async consultar(){
        const produtoDB = new ProdutoDB();
        return await produtoDB.consultar();
    }

    async consultarPorNome(termo){
        const produtoDB = new ProdutoDB();
        return await produtoDB.consultarPorNome(termo);
    }
}