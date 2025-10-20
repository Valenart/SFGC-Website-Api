import { fastify } from 'fastify';
import dotenv from 'dotenv';
import fastifyJwt from 'fastify-jwt';
import { db } from './db.js';

// Carrega variáveis de ambiente do arquivo .env (se existir)
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
    console.warn('Warning: JWT_SECRET não definido. Defina em .env para segurança.');
}

const server = fastify({ logger: true });

server.register(fastifyJwt, { secret: JWT_SECRET || 'dev-secret' });

async function authenticate(req, reply) {
    try {
        await req.jwtVerify();
    } catch (err) {
        return reply.code(401).send({ message: 'Unauthorized' });
    }
}

/*
    Rotas principais (simples e comentadas):
    - POST /auth/login   -> autentica o usuário e retorna JWT
    - GET  /posts        -> lista postagens (público)
    - POST /posts        -> cria postagem (precisa de JWT)
    - PUT  /posts/:id    -> atualiza postagem (precisa de JWT)
    - DELETE /posts/:id -> deleta postagem (precisa de JWT)

    Nota: mantive tudo simples para facilitar entendimento.
*/

server.post('/auth/login', async (req, reply) => {

    const { username, password } = req.body ?? {};
    if (!username || !password) return reply.code(400).send({ message: 'usuário e senha são obrigatórios' });

    const user = await db.getUserByUsername(username);
    if (!user) return reply.code(401).send({ message: 'Credenciais inválidas' });

    const bcrypt = await import('bcryptjs');
    const senha = bcrypt.compareSync(password, user.password_hash);

    if (!senha) return reply.code(401).send({ message: 'Credenciais inválidas' });

    const token = server.jwt.sign({ userId: user.id, username: user.username });
    return reply.send({ token });
});

// Listar posts (público)
server.get('/posts', async (req, reply) => {
    const posts = await db.getPosts();
    return reply.status(200).send({ message: 'Listando Posts' }, posts);
});

// Criar post (privado)
server.post('/posts', { preHandler: authenticate }, async (req, reply) => {
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
server.put('/posts/:id', { preHandler: authenticate }, async (req, reply) => {
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
server.delete('/posts/:id', { preHandler: authenticate }, async (req, reply) => {
    const payload = req.user;
    const { id } = req.params;
    const existing = await db.getPostById(id);
    if (!existing) return reply.code(404).send({ message: 'Post não encontrado' });
    if (existing.user_id !== payload.userId) return reply.code(403).send({ message: 'Forbidden' });

    await db.deletePost(id);
    return reply.code(202).send({ message: 'Post deletado' });
});

// Inicia o servidor
const start = async () => {
    try {
        await server.listen({ port: 3333 });
    } catch (err) {
        server.log.error(err);
        process.exit(1);
    }
};

start();