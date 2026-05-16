import { title } from "node:process";
import Produto from "../Model/produto.js";
import Pedido from "../Model/pedido.js";
import ItemPedido from "../Model/itemPedido.js";
export function criarMessengerCard(){
    return {
        type:"info",
        title:"",
        subtitle:"",
        image: {
            src : {
                rawUrl:""
            }
        },
        actionLink:""
    }
} //fim da função criarMessengerCard

export function criarCustomCard(){
    //exibir nos ambientes padrões, tais como: ambiente de teste do DialogFlow, slack, etc
    return {
        card: {
            title:"",
            subtitle:"",
            imageUri:"",
            buttons: [
                {
                    text:"botão",
                    postback:""
                }
            ]
        }
    }
    
} 

export default async function obterCardsProdutos(tipoCard="custom"){
    const cards = [];
    const produto = new Produto();
    const listaProdutos = await produto.consultar();
    for(const produto of listaProdutos){
        if(tipoCard == "custom"){
            const cardCustom = criarCustomCard();
            cardCustom.card.title = produto.nome;
            cardCustom.card.subtitle = produto.ingredientes;
            cardCustom.card.imageUri = produto.imagem;
            cardCustom.card.buttons[0].text = "Mais informações";
            cardCustom.card.buttons[0].postback = `https://www.lanchonetealtashoras.com.br/`;
            cards.push(cardCustom);
        }
        else
        {
            const cardMessenger = criarMessengerCard();
            cardMessenger.type = "info";
            cardMessenger.title = produto.nome;
            cardMessenger.subtitle = produto.ingredientes;
            cardMessenger.image.src.rawUrl = produto.imagem;
            cardMessenger.actionLink = `https://www.lanchonetealtashoras.com.br/`;
            cards.push(cardMessenger);

        }
    }
    return cards;

}

export async function apresentarMenu(origem){
    const resposta = {
        "fulfillmentMessages": []
    };

    if (origem == "custom"){
        try{
            const cards = await obterCardsProdutos("custom");
            resposta.fulfillmentMessages.push({
                "text": {
                    "text": ["Apresentação do Menu.\n",
                             "Escolha um dos nossos deliciosos lanches.\n"
                            ]
                }
            });
            resposta.fulfillmentMessages.push(...cards);
            resposta.fulfillmentMessages.push({
                "text": {
                    "text": ["E aí? Qual vai ser a pedida?"]
                }
            });
        }
        catch(erro){
          resposta.fulfillmentMessages.push({
            "text": {
              "text": ["Não foi possível acessar o menu", 
                       "Erro: " + erro.message,
                       "Faça o pedido por meio do telefone: (18) 99999-9999"]
              
            }
          });

        }
    }
    else if (origem == "messenger"){
        resposta.fulfillmentMessages.push({
            "payload": {
                "richContent":[[{
                    type:"description",
                    title:"Apresentação do Menu.\n",
                    text:["Escolha um dos nossos deliciosos lanches.\n"],
                }]]
            }
        });
        try{
            const cards = await obterCardsProdutos("messenger");
            resposta.fulfillmentMessages[0].payload.richContent[0].push(...cards);
            resposta.fulfillmentMessages[0].payload.richContent[0].push({
                type:"description",
                text:["E aí? Qual vai ser a pedida?"]
            });

        }
        catch(erro){
            resposta.fulfillmentMessages[0].payload.richContent[0].push({
                type:"description",
                text:["Não foi possível acessar o menu.", 
                       "Erro: " + erro.message,
                       "Faça o pedido por meio do telefone: (18) 99999-9999."]
            });

        }
    }
    return resposta;
}

export async function processarEscolhaItem(dados, origem){
    const resposta = {
        "fulfillmentMessages": []
    };
    let itemEncontrado = false;
    const sessao = dados?.session.split("/").pop();

    //assegurar que a escolha do cliente seja armazenada temporariamente
    if (!global.dados){
        global.dados = {};
        global.dados[sessao] = {"items":[],"qtds":[]};
    }

    let items = [...dados?.queryResult?.parameters?.lanche, 
                 ...dados?.queryResult?.parameters?.bebida];
    let qtds = [...dados?.queryResult?.parameters?.number];
    const produto = new Produto();
    const listaProdutos = await produto.consultarPorNome(items[0]);
    if (listaProdutos?.length > 0){
        itemEncontrado = true;
    }

    if (itemEncontrado){
        global.dados[sessao]["items"] =  [...global.dados[sessao]?.items || [],...items];
        global.dados[sessao]["qtds"]  =  [...global.dados[sessao]?.qtds || [],...qtds];    
    }

    if (origem == "custom"){
        resposta.fulfillmentMessages.push({
                "text": {
                    "text": [itemEncontrado ? "Excelente escolha!" : "Desculpe, o produto escolhido não está disponível.",
                        "Gostaria de pedir mais alguma coisa?"
                    ]
                }
            });
    }
    else{
        resposta.fulfillmentMessages.push({
                "payload": {
                    "richContent": [[{
                        type:"description",
                        title:[itemEncontrado ? "Excelente escolha!" : "Desculpe, o produto escolhido não está disponível."],
                        text:["Gostaria de pedir mais alguma coisa?"]
                    }]]
                }
            });
    }
    return resposta;
}

export async function confirmarPedido(dados,origem) {
    //gravar o pedido no banco de dados caso o usuário tenha confirmado o pedido
    const sessao = dados?.session.split("/").pop();
    const items = global.dados[sessao]["items"];
    const qtds = global.dados[sessao]["qtds"];
    let itemsNaoConfirmados = [];

    const resposta = {
        "fulfillmentMessages": []
    };

    try{
        let valorTotal = 0;
        let itemsPedido = [];
        
        for (let i = 0; i < items.length; i++) {
         
            const produto = new Produto();
            const listaProdutos = await produto.consultarPorNome(items[i]);
            const item = listaProdutos[0];
            if (item) {
                itemsPedido.push(new ItemPedido(null, item.codigo, qtds[i], item.preco));
                valorTotal += item.preco * qtds[i];
            }
            else{
                itemsNaoConfirmados.push(items[i]);
            }
        }

        const pedido = new Pedido(null, new Date(), valorTotal, itemsPedido);
        await pedido.gravar();

        if (origem == "custom"){
            resposta.fulfillmentMessages.push({
                "text": {
                    "text": ["Seu pedido foi registrado com sucesso!",
                             "Pedido registrado sob número: " + pedido.codigo,
                             itemsNaoConfirmados.length > 0 ? "Itens indisponíveis: " + itemsNaoConfirmados.join(", ") : "",
                             "Valor total: R$ " + valorTotal?.toFixed(2),
                             "Seu pedido será entregue em até 30 minutos."
                    ]
                }
            });
        }
        else{
            resposta.fulfillmentMessages.push({
                "payload": {
                    "richContent": [[{
                        type:"description",
                        title:"Seu pedido foi registrado com sucesso!",
                        text:["Pedido registrado sob número: " + pedido.codigo,
                            itemsNaoConfirmados.length > 0 ? "Itens indisponíveis: " + itemsNaoConfirmados.join(", ") : "",
                             "Valor total: R$ " + valorTotal?.toFixed(2),
                             "Seu pedido será entregue em até 30 minutos."]
                    }]]
                }
            });
        }

    }
    catch(erro){
        if (origem == "custom"){
            resposta.fulfillmentMessages.push({
            "text": {
              "text": ["Não foi possível registrar seu pedido.", 
                       "Erro: " + erro.message,
                       "Faça o pedido por meio do telefone: (18) 99999-9999"]
              
            }
          });
        }
        else{
            resposta.fulfillmentMessages[0].payload.richContent[0].push({
                type:"description",
                text:["Não foi possível registrar seu pedido.", 
                       "Erro: " + erro.message,
                       "Faça o pedido por meio do telefone: (18) 99999-9999."]
            });
        }
    }
    
    global.dados[sessao] ={"items":[],"qtds":[]};
    return resposta;    
}