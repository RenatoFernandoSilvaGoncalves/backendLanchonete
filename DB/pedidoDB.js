import obterConexao from "./conexao.js";
import Pedido from "../Model/pedido.js";
import ItemPedido from "../Model/itemPedido.js";

export default class PedidoDB {

    async gravar(pedido) {
        const conexao = await obterConexao();
        try {

            //assegurar a atomicidade da transação
            await conexao.beginTransaction();

            const sqlPedido = 'INSERT INTO pedido (data, valorTotal) VALUES (?, ?)';
            const [resultado] = await conexao.query(sqlPedido, [pedido.data, pedido.valorTotal]);
            const pedidoId = resultado.insertId;

            const sqlItem = 'INSERT INTO itemPedido (codigoPedido, codigoProduto, quantidade, valorUnitario) VALUES (?, ?, ?, ?)';
            for (const item of pedido.itens) {
                await conexao.query(sqlItem, [pedidoId, item.produto, item.quantidade, item.valorUnitario]);
            }

            await conexao.commit();
            pedido.codigo = pedidoId;
            return pedido;
        } catch (erro) {
            await conexao.rollback();
            throw erro;
        } finally {
            conexao.release();
        }
    }

    async consultar() {
        const conexao = await obterConexao();
        try {
            const sql = `SELECT p.codigo, p.data, p.valorTotal,
                        i.codigo as itemCodigo, i.codigoProduto, i.quantidade, i.valorUnitario
                        FROM pedido p
                        LEFT JOIN itemPedido i ON p.codigo = i.codigoPedido
                        ORDER BY p.codigo`;
            const [resultados] = await conexao.query(sql);

            const pedidosMap = new Map();
            for (const row of resultados) {
                if (!pedidosMap.has(row.codigo)) {
                    pedidosMap.set(row.codigo, new Pedido(row.codigo, row.data, row.valorTotal, []));
                }
                if (row.itemCodigo) {
                    const item = new ItemPedido(row.itemCodigo, row.codigoProduto, row.quantidade, row.valorUnitario);
                    pedidosMap.get(row.codigo).itens.push(item);
                }
            }
            return [...pedidosMap.values()];
        } finally {
            conexao.release();
        }
    }
}
