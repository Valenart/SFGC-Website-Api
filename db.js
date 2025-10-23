import postgres from 'postgres';
import 'dotenv/config';
import dotenv from 'dotenv';
import { randomUUID } from 'node:crypto';
import { randomUUID } from 'node:crypto';

dotenv.config();

/*
    ESTE ARQUIVO CENTRALIZA TODAS AS OPERAÇÕES RELACIONADAS AO BANCO DE DADOS.
    CADA FUNÇÃO REALIZA UMA QUERY SQL ESPECÍFICA PARA ATENDER ÀS NECESSIDADES DO SISTEMA.

    ROTAS PRINCIPAIS:
    - POST /AUTH/LOGIN   -> AUTENTICA O USUÁRIO E RETORNA JWT (PÚBLICO)
    - GET  /POSTS        -> LISTA POSTAGENS (PÚBLICO)
    - POST /POSTS        -> CRIA POSTAGEM (PRECISA DE JWT)
    - PUT  /POSTS/:ID    -> ATUALIZA POSTAGEM (PRECISA DE JWT)
    - DELETE /POSTS/:ID  -> DELETA POSTAGEM (PRECISA DE JWT)

    NOTA: TENTEI MANTER TUDO SIMPLES PARA FACILITAR O ENTENDIMENTO E A MANUTENÇÃO :)
*/

const { PGHOST, PGDATABASE, PGUSER, PGPASSWORD, ENDPOINT_ID } = process.env;
const URL = `postgresql://${PGUSER}:${PGPASSWORD}@${PGHOST}/${PGDATABASE}?sslmode=require&options=project%3D${ENDPOINT_ID}`;

export const sql = postgres(URL, { ssl: 'require' });

// ADMINISTRAÇÃO
export const getUserByUsername = async (username) => {
    const rows = await sql`select * from users where username = ${username} limit 1`;
    return rows[0];
};

// LISTAR POSTS
export const getPosts = async (search) => {
    if (search) {
        return await sql`select * from posts where title ilike ${'%' + search + '%'} order by id desc`;
    } else {
        return await sql`select * from posts order by id desc`;
    }
};

// Criar post
export const createPost = async (postagem) => {
    const postagemId = randomUUID();
    const { title, description, data_postagem, data_evento, image_url } = postagem;

    await sql`
        insert into posts (id, user_id, title, description, data_postagem, data_evento, image_url)
        VALUES (${postagemId}, ${postagem.user_id}, ${title}, ${description}, ${data_postagem}, ${data_evento}, ${image_url})
    `;
};

// Atualizar post
export const updatePost = async (id, postagem) => {
    const { title, description, data_evento, image_url } = postagem;

    await sql`
        update posts set
            title = coalesce(${title}, title),
            description = coalesce(${description}, description),
            data_evento = coalesce(${data_evento}, data_evento),
            image_url = coalesce(${image_url}, image_url),
            updated_at = now()
        where id = ${id}
    `;
};

// Deletar post
export const deletePost = async (id) => {
    await sql`DELETE FROM posts WHERE id = ${id}`;
};

// BUSCAR POST POR ID
export const getPostById = async (id) => {
    const rows = await sql`select * from posts where id = ${id} limit 1`;
    return rows[0];
};

// ADICIONANDO EXPORTAÇÃO DO OBJETO DB CONSOLIDADO
export const db = {
    getUserByUsername,
    getPosts,
    createPost,
    updatePost,
    deletePost,
    getPostById
};

export default sql;
