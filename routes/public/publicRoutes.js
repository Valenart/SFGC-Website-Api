import { db } from '../../db.js';

export async function publicRoutes(server, options) {


    // LOGIN
    server.post('/auth/login', async (req, reply) => {
        const { username, password } = req.body ?? {};
        if (!username || !password) return reply.code(400).send({ message: 'USUÁRIO E SENHA SÃO OBRIGATÓRIOS' });

        const user = await db.getUserByUsername(username);
        if (!user) return reply.code(401).send({ message: 'CREDENCIAIS INVÁLIDAS' });

        const bcrypt = await import('bcryptjs');
        const senha = bcrypt.compareSync(password, user.password_hash);

        if (!senha) return reply.code(401).send({ message: 'CREDENCIAIS INVÁLIDAS' });

        const token = server.jwt.sign({ userId: user.id, username: user.username }, { expiresIn: '8h' });
        return reply.send({ token });
    });

    // LISTAR POSTS (PÚBLICO)
    server.get('/posts', async (req, reply) => {
        const posts = await db.getPosts();
        try {
            return reply.status(200).send({ message: 'Listando Posts', posts });
        } catch (error) {
            return reply.status(500).send({ message: 'Erro ao listar posts', error: error.message });
        }
    });

    // LISTAR FOTOS (PÚBLICO)
    server.get('/photos', async (req, reply) => {
        const photos = await db.getPhotos();
        try {
            return reply.status(200).send({ message: 'Listando Fotos', photos });
        } catch (error) {
            return reply.status(500).send({ message: 'Erro ao listar Fotos', error: error.message });
        }
    })
}

export default publicRoutes;
