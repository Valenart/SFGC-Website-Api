import { randomUUID } from 'node:crypto';

export class DatabaseMemory {
    #postagens = new Map();


    list() {
        // Retorna um array de postagens com o formato { id, ...data }
        // Usamos Array.from para transformar as entradas do Map em array
        return Array.from(this.#postagens.entries()).map(([id, data]) => ({ id, ...data }));
    }

    create(postagem) {
        const videoId = randomUUID();
        this.#postagens.set(videoId, postagem);
        // Retornamos o id gerado para facilitar o uso pelo caller
        return videoId;
    }

    update(id, postagem) {
        this.#postagens.set(id, postagem)
    }

    delete(id) {
        this.#postagens.delete(id)
    }
}
