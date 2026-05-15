import obterConexao from "./conexao.js";
import Produto from "../Model/produto.js";
export default class ProdutoDB {

    async gravar(produto) {}
    async alterar(produto) {}
    async excluir(produto) {}
    async consultar() {
        const conexao = await obterConexao();
        const sql = 'SELECT * FROM produto;';
        const [resultados, campos] = await conexao.query(sql);
        const listaProdutos = [];
        for (const resultado of resultados) {
            const produto = new Produto(
                resultado.codigo,
                resultado.nome,
                resultado.ingredientes,
                resultado.preco,
                resultado.imagem
            );
            listaProdutos.push(produto);
        }
        return listaProdutos;
    }

    async consultarPorNome(termo) {
        const conexao = await obterConexao();
        const sql = 'SELECT * FROM produto WHERE nome LIKE ?';
        const [resultados] = await conexao.query(sql, [`%${termo}%`]);
        const listaProdutos = [];
        for (const resultado of resultados) {
            const produto = new Produto(
                resultado.codigo,
                resultado.nome,
                resultado.ingredientes,
                resultado.preco,
                resultado.imagem
            );
            listaProdutos.push(produto);
        }
        return listaProdutos;
    }
}