import { randomUUID } from 'node:crypto';

export class DatabaseMemory {
    #postagens = new Map();


    list() {
        return this.#postagens.values()

    }

    create(postagem) {
        const videoId = randomUUID();

        this.#postagens.set(videoId, postagem)
    }

    update(id, postagem) {
        this.#postagens.set(id, postagem)
    }

    delelte(id) {
        this.#postagens.delete(id)
    }
}
