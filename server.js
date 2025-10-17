import { fastify } from 'fastify';
import { DatabaseMemory } from './databasememory.js';


const server = fastify();

const database = new DatabaseMemory();



server.get('/login', (req, res) => {


    const { title, description, dateEvent } = req.body;

    const hoje = new Date();
    const dataBR = hoje.toLocaleDateString('pt-BR');

    database.create({
        title: title || 'Primeira Postagem',
        description: description || 'Conteudo da primeira postagem',
        dateEvent: dateEvent || dataBR,
        dateCreated: dataBR,
    });

    return res ? res.status(201).send({
        message: 'Postagem criada com sucesso',
    }) : res.status(404).send({
        message: 'Erro ao criar postagem'
    });
});


server.post('/login', () => {


    return database.list();
});

server.get('/postagem', () => {
    return 'usuario';
});

server.put(`/postagem/:id`, () => {
    return 'usuario';
});

server.delete(`/postagem/:id`, () => {
    return 'usuario';
});

server.listen({
    port: 3333
})