import { fastify } from 'fastify';
import dotenv from 'dotenv';
import fastifyJwt from 'fastify-jwt';
import fastifyCors from '@fastify/cors';
import { db } from './db.js';
import { DatabasePostgres } from './database-postgres.js';
import publicRoutes from './routes/public/publicRoutes.js';
import privateRoutes from './routes/private/privateRoutes.js';

// Carrega variáveis de ambiente do arquivo .env (se existir)
dotenv.config();

const database = new DatabasePostgres();

const JWT_SECRET = process.env.JWT_SECRET;
if (!JWT_SECRET) {
    console.warn('Warning: JWT_SECRET não definido. Defina em .env para segurança.');
}

const server = fastify({ logger: true });

server.register(fastifyJwt, { secret: JWT_SECRET || 'dev-secret' });


/**CORS**/
const CORS_ORIGIN = process.env.CORS_ORIGIN || '*';
const CORS_ALLOW_METHODS = process.env.CORS_ALLOW_METHODS || 'GET,POST,PUT,DELETE,OPTIONS';
server.register(fastifyCors, {
    origin: CORS_ORIGIN,
    methods: CORS_ALLOW_METHODS.split(',').map(m => m.trim()),
    allowedHeaders: ['Content-Type', 'Authorization']
});


server.decorate('authenticate', async function (req, reply) {
    try {
        await req.jwtVerify();
    } catch (err) {
        return reply.code(401).send({ message: 'Unauthorized' });
    }
});

/*
    Rotas principais (simples e comentadas):
    - POST /auth/login   -> autentica o usuário e retorna JWT
    - GET  /posts        -> lista postagens (público)
    - POST /posts        -> cria postagem (precisa de JWT)
    - PUT  /posts/:id    -> atualiza postagem (precisa de JWT)
    - DELETE /posts/:id -> deleta postagem (precisa de JWT)

    Nota: mantive tudo simples para facilitar entendimento.
*/

// Registrar rotas
server.register(publicRoutes);
server.register(privateRoutes);

// Inicia o servidor
const PORT = process.env.PORT ? Number(process.env.PORT) : 3333;

const start = async () => {
    try {
        await server.listen({ host: '0.0.0.0', port: PORT });
        server.log.info(`Server running on port ${PORT}`);
    } catch (err) {
        server.log.error(err);
        process.exit(1);
    }
};

start();