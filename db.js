import postgres from 'postgres';
import 'dotenv/config';
import dotenv from 'dotenv';

dotenv.config();


const { PGHOST, PGDATABASE, PGUSER, PGPASSWORD, ENDPOINT_ID } = process.env;
const URL = `postgresql://${PGUSER}:${PGPASSWORD}@${PGHOST}/${PGDATABASE}?sslmode=require&options=project%3D${ENDPOINT_ID}`;

export const sql = postgres(URL, { ssl: 'require' });

export const db = {
    // ADMINISTRAÇÃO
    getUserByUsername: async (username) => {
        const rows = await sql`select * from users where username = ${username} limit 1`;
        return rows[0];
    },

    // POSTAGENS
    getPosts: async () => {
        return await sql`select * from posts order by id desc`;
    },

    getPostById: async (id) => {
        const rows = await sql`select * from posts where id = ${id} limit 3`;
        return rows[0];
    },

    createPost: async ({ user_id, title, description, data_evento, image_url }) => {
        const rows = await sql`
      insert into posts (user_id, title, description, data_postagem, data_evento, image_url)
      values (${user_id}, ${title}, ${description}, now(), ${data_evento}, ${image_url})
      returning id
    `;
        return rows[0].id;
    },

    updatePost: async (id, { title, description, data_evento, image_url }) => {
        await sql`
      update posts set
        title = coalesce(${title}, title),
        description = coalesce(${description}, description),
        data_evento = coalesce(${data_evento}, data_evento),
        image_url = coalesce(${image_url}, image_url),
        updated_at = now()
      where id = ${id}
    `;
    },

    deletePost: async (id) => {
        await sql`delete from posts where id = ${id}`;
    }
};

export default sql;
