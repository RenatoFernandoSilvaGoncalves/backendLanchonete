import Produto from "../Model/produto.js";
export default class ProdutoCtrl {
    gravar(req,resp){}
    alterar(req, resp){}
    excluir(req, resp){}
    consultar(req, resp){
        if (req.method == "GET"){
            const produto = new Produto();

            produto.consultar()
            .then((listaProdutos) =>{
                resp.status(200).json({
                    status: "true",
                    produtos: listaProdutos
                });
            })
            .catch((erro) => {
                resp.status(500).json({
                    status:"false",
                    mensagem: erro.message
                });
            });

        }
        else{
            resp.status(405).json({
                status:"false",
                mensagem: "Metodo não permitido"
            });
        }

    }
}