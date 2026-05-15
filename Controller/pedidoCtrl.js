import Pedido from "../Model/pedido.js";
import ItemPedido from "../Model/itemPedido.js";

export default class PedidoCtrl {
    gravar(req, resp) {
        if (req.method == "POST") {
            const { data, valorTotal, itens } = req.body;
            const listaItens = itens.map(i => new ItemPedido(null, i.produto, i.quantidade, i.valorUnitario));
            const pedido = new Pedido(null, data, valorTotal, listaItens);

            pedido.gravar()
                .then((pedidoGravado) => {
                    resp.status(201).json({
                        status: "true",
                        pedido: pedidoGravado
                    });
                })
                .catch((erro) => {
                    resp.status(500).json({
                        status: "false",
                        mensagem: erro.message
                    });
                });
        } else {
            resp.status(405).json({
                status: "false",
                mensagem: "Metodo não permitido"
            });
        }
    }

    consultar(req, resp) {
        if (req.method == "GET") {
            const pedido = new Pedido();
            pedido.consultar()
                .then((listaPedidos) => {
                    resp.status(200).json({
                        status: "true",
                        pedidos: listaPedidos
                    });
                })
                .catch((erro) => {
                    resp.status(500).json({
                        status: "false",
                        mensagem: erro.message
                    });
                });
        } else {
            resp.status(405).json({
                status: "false",
                mensagem: "Metodo não permitido"
            });
        }
    }
}
