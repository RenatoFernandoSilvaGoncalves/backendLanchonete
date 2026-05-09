import mysql from 'mysql2/promise';
export default async function obterConexao(){

    if(global.poolConexoes){
        return await global.poolConexoes.getConnection();
    }
    else
    {
        const poolConexoes = await mysql.createPool({
            host: 'localhost',
            user: 'root',
            password: 'mysql@159753',
            database: 'lanchonete'
        });
        global.poolConexoes = poolConexoes;
        return await poolConexoes.getConnection();
    }


}