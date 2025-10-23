import postgres from 'postgres';
import 'dotenv/config';
import dotenv from 'dotenv';
import { randomUUID } from 'node:crypto';

dotenv.config();

/*
    Rotas principais (simples e comentadas):
    - POST /auth/login   -> autentica o usuário e retorna JWT
    - GET  /posts        -> lista postagens (público)
    - POST /posts        -> cria postagem (precisa de JWT)
    - PUT  /posts/:id    -> atualiza postagem (precisa de JWT)
    - DELETE /posts/:id -> deleta postagem (precisa de JWT)

    Nota: mantive tudo simples para facilitar entendimento.
*/

const { PGHOST, PGDATABASE, PGUSER, PGPASSWORD, ENDPOINT_ID } = process.env;
const URL = `postgresql://${PGUSER}:${PGPASSWORD}@${PGHOST}/${PGDATABASE}?sslmode=require&options=project%3D${ENDPOINT_ID}`;

export const sql = postgres(URL, { ssl: 'require' });

// ADMINISTRAÇÃO
export const getUserByUsername = async (username) => {
    const rows = await sql`select * from users where username = ${username} limit 1`;
    return rows[0];
};

// Listar posts
export const listPosts = async (search) => {
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

export default sql;
