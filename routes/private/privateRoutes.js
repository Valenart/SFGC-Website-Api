import { db } from '../../db.js';

export async function privateRoutes(server, options) {


    // CRIAR POST (PRIVADO)
    server.post('/posts', { preHandler: server.authenticate }, async (req, reply) => {
        const payload = req.user;
        const { title, description, data_evento, image_url } = req.body ?? {};
        if (!title) return reply.code(400).send({ message: 'TITLE IS REQUIRED' });

        const postId = await db.createPost({
            user_id: payload.userId,
            title,
            description,
            data_evento,
            image_url
        });

        return reply.code(201).send({ message: 'POST CRIADO', id: postId });
    });




    // ATUALIZAR POST (PRIVADO, SOMENTE ADMINISTRADOR)
    server.put('/posts/:id', { preHandler: server.authenticate }, async (req, reply) => {
        const payload = req.user;
        const { id } = req.params;
        const existing = await db.getPostById(id);
        if (!existing) return reply.code(404).send({ message: 'POST NÃO ENCONTRADO' });
        if (existing.user_id !== payload.userId) return reply.code(403).send({ message: 'FORBIDDEN' });

        const { title, description, data_evento, image_url } = req.body ?? {};
        await db.updatePost(id, { title, description, data_evento, image_url });
        return reply.send({ message: 'POST ATUALIZADO' });
    });

    // DELETAR POST (PRIVADO, SOMENTE ADMINISTRADOR)
    server.delete('/posts/:id', { preHandler: server.authenticate }, async (req, reply) => {
        const payload = req.user;
        const { id } = req.params;
        const existing = await db.getPostById(id);
        if (!existing) return reply.code(404).send({ message: 'POST NÃO ENCONTRADO' });
        if (existing.user_id !== payload.userId) return reply.code(403).send({ message: 'FORBIDDEN' });

        await db.deletePost(id);
        return reply.code(202).send({ message: 'POST DELETADO' });
    });
}

export default privateRoutes;
