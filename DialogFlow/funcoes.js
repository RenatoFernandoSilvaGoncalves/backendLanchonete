import { title } from "node:process";
import Produto from "../Model/produto.js";
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