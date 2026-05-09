import mysql from 'mysql2/promise';
export default async function obterConexao(){

    if(global.poolConexoes){
        return await global.poolConexoes.getConnection();
    }
    else
    {
        const poolConexoes = await mysql.createPool({
            host: process.env.DB_HOST,
            user: process.env.DB_USUARIO,
            password: process.env.DB_SENHA,
            database: process.env.DB_BASE,
            waitForConnections: true,
            connectionLimit: 10,
            queueLimit: 0
        });
        global.poolConexoes = poolConexoes;
        return await poolConexoes.getConnection();
    }


}