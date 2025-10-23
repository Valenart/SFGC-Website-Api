// IMPORTAÇÕES
import { fastify } from 'fastify';
import dotenv from 'dotenv';
import fastifyJwt from 'fastify-jwt';
import fastifyCors from '@fastify/cors';
import publicRoutes from './routes/public/publicRoutes.js';
import privateRoutes from './routes/private/privateRoutes.js';

// CARREGA VARIÁVEIS DE AMBIENTE DO ARQUIVO .ENV
dotenv.config();

const JWT_SECRET = process.env.JWT_SECRET;
const CORS_ORIGIN = process.env.CORS_ORIGIN || '*';
const CORS_ALLOW_METHODS = process.env.CORS_ALLOW_METHODS || 'GET,POST,PUT,DELETE,OPTIONS';
const PORT = process.env.PORT ? Number(process.env.PORT) : 3333;

// JWT
if (!JWT_SECRET) {
    console.warn('WARNING: JWT_SECRET NÃO DEFINIDO. DEFINA EM .ENV PARA SEGURANÇA.');
}

const server = fastify({ logger: true });

// PLUGINS
server.register(fastifyJwt, { secret: JWT_SECRET });
server.register(fastifyCors, {
    origin: CORS_ORIGIN,
    methods: CORS_ALLOW_METHODS.split(',').map(m => m.trim()),
    allowedHeaders: ['Content-Type', 'Authorization']
});

// DECORATORS
server.decorate('authenticate', async function (req, reply) {
    try {
        await req.jwtVerify();
    } catch (err) {
        return reply.code(401).send({ message: 'Unauthorized' });
    }
});

// ROTAS
server.register(publicRoutes);
server.register(privateRoutes);

// INICIALIZAÇÃO DO SERVIDOR
const start = async () => {
    try {
        await server.listen({ host: '0.0.0.0', port: PORT });
        server.log.info(`SERVER RUNNING ON PORT ${PORT}`);
    } catch (err) {
        server.log.error(err);
        process.exit(1);
    }
};

start();