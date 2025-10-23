// Este arquivo foi consolidado em db.js e não é mais necessário.
// Por favor, use os métodos centralizados em db.js para todas as operações de banco de dados.

import { randomUUID } from 'node:crypto';

import { sql } from './db.js';

export class DatabasePostgres {


    async list(search) {
        let postagens;

        if (search) {
            postagens = await sql`select * from posts where title ilike ${'%' + search + '%'} order by id desc`;
        } else {
            postagens = await sql`select * from posts order by id desc`;
        }

        return postagens;
    }

    async create(postagem) {
        const postagemId = randomUUID();
        const { title, description, data_postagem, data_evento, image_url } = postagem;

        await sql` 
            insert into posts (id, user_id, title, description, data_postagem, data_evento, image_url)
            VALUES (${postagemId}, ${postagem.user_id}, ${title}, ${description}, ${data_postagem}, ${data_evento}, ${image_url})
        `;
    }

    async update(id, postagem) {
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
    }

    async delete(id) {

        await sql`DELETE FROM posts WHERE id = ${id}`;
    }
}
