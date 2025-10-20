import { randomUUID } from 'node:crypto';

export class DatabaseMemory {
    #postagens = new Map();


    list() {

        return Array.from(this.#postagens.entries()).map(([id, data]) => ({ id, ...data }));
    }

    create(postagem) {
        const postagemId = randomUUID();
        this.#postagens.set(postagemId, postagem);

        return postagemId;
    }

    update(id, postagem) {
        this.#postagens.set(id, postagem)
    }

    delete(id) {
        this.#postagens.delete(id)
    }
}
