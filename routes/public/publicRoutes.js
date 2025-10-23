import { db } from '../../db.js';

export async function publicRoutes(server, options) {
    // Login
    server.post('/auth/login', async (req, reply) => {
        const { username, password } = req.body ?? {};
        if (!username || !password) return reply.code(400).send({ message: 'usuário e senha são obrigatórios' });

        const user = await db.getUserByUsername(username);
        if (!user) return reply.code(401).send({ message: 'Credenciais inválidas' });

        const bcrypt = await import('bcryptjs');
        const senha = bcrypt.compareSync(password, user.password_hash);

        if (!senha) return reply.code(401).send({ message: 'Credenciais inválidas' });

        const token = server.jwt.sign({ userId: user.id, username: user.username }, { expiresIn: '8h' });
        return reply.send({ token });
    });

    // Listar posts (público)
    server.get('/posts', async (req, reply) => {
        try {
            const posts = await db.getPosts(); // Envolvido no try para capturar erros
            return reply.status(200).send({ message: 'Listando Posts', posts });
        } catch (error) {
            server.log.error(error);
            return reply.status(500).send({ message: 'Erro ao listar posts', error: error.message });
        }
    });
}

export default publicRoutes;
