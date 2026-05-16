import obterCardsProdutos, { processarEscolhaItem } from "../DialogFlow/funcoes.js";
import { apresentarMenu, confirmarPedido } from "../DialogFlow/funcoes.js";
export default class DFCtrl{
    obterCardsProdutos(req, resp){
        if (req.method=="GET"){
            obterCardsProdutos("messenger")
            .then((cards) => {
                resp.status(200).json(cards);
            }).
            catch((erro) => {
                resp.status(500).json({
                    status:"false",
                    mensagem: erro.message
                });
            });
        }
    }

    async processarIntents(req, resp){
        if (req.method == "POST" && req.is("application/json")){
            let resposta = {};
            const dados = req.body;
            let origem = dados?.originalDetectIntentRequest?.source;
            if (origem){
                origem = "custom";
            }
            else{
                origem = "messenger";
            }
            const intencao = dados?.queryResult?.intent?.displayName;
            switch(intencao){
                case "verMenu-Sim":
                    resposta = await apresentarMenu(origem);
                    break;
                case "RegistrarPedido":
                    resposta = await processarEscolhaItem(dados,origem);
                    break;
                case "Confirmar-pedido-sim":
                    resposta = await confirmarPedido(dados,origem);
                    break;
            }

            resp.json(resposta);
        }
        else{
            resp.status(405).json({
                status:"false",
                mensagem:"Método não permitido"
            });
        }
    }

}