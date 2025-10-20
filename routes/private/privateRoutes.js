import { db } from '../../db.js';

export async function privateRoutes(server, options) {
    // Criar post (privado)
    server.post('/posts', { preHandler: server.authenticate }, async (req, reply) => {
        const payload = req.user;
        const { title, description, data_evento, image_url } = req.body ?? {};
        if (!title) return reply.code(400).send({ message: 'title is required' });

        const postId = await db.createPost({
            user_id: payload.userId,
            title,
            description,
            data_evento,
            image_url
        });

        return reply.code(201).send({ message: 'Post criado', id: postId });
    });

    // Atualizar post (privado, somente autor)
    server.put('/posts/:id', { preHandler: server.authenticate }, async (req, reply) => {
        const payload = req.user;
        const { id } = req.params;
        const existing = await db.getPostById(id);
        if (!existing) return reply.code(404).send({ message: 'Post não encontrado' });
        if (existing.user_id !== payload.userId) return reply.code(403).send({ message: 'Forbidden' });

        const { title, description, data_evento, image_url } = req.body ?? {};
        await db.updatePost(id, { title, description, data_evento, image_url });
        return reply.send({ message: 'Post atualizado' });
    });

    // Deletar post (privado, somente autor)
    server.delete('/posts/:id', { preHandler: server.authenticate }, async (req, reply) => {
        const payload = req.user;
        const { id } = req.params;
        const existing = await db.getPostById(id);
        if (!existing) return reply.code(404).send({ message: 'Post não encontrado' });
        if (existing.user_id !== payload.userId) return reply.code(403).send({ message: 'Forbidden' });

        await db.deletePost(id);
        return reply.code(202).send({ message: 'Post deletado' });
    });
}

export default privateRoutes;
