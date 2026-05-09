import express from 'express';
import dotenv from 'dotenv';
import rotaProduto from './routes/rotaProduto.js';

//carrega as variaveis de ambiente especificadas no arquivo .env
dotenv.config();

const porta = 3000;
const host = '0.0.0.0';
const app = express();
app.use(express.json());

app.use('/produto', rotaProduto);

app.listen(porta, host, () => {
    console.log(`Servidor rodando em http://${host}:${porta}`);
});