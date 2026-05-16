import express from 'express';
import dotenv from 'dotenv';
import rotaProduto from './routes/rotaProduto.js';
import rotaDF from './routes/rotaDF.js';
import rotaPedido from './routes/rotaPedido.js';

//carrega as variaveis de ambiente especificadas no arquivo .env
dotenv.config();

const porta = 3000;
const host = '0.0.0.0';
const app = express();
app.use(express.json());
app.use(express.static('public'));
app.use('/produto', rotaProduto);
app.use("/webhook", rotaDF);
app.use('/pedido', rotaPedido);

app.listen(porta, host, () => {
    console.log(`Servidor rodando em http://${host}:${porta}`);
});