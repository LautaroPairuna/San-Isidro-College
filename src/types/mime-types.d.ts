// src/types/mime-types.d.ts
declare module 'mime-types' {
    /** Devuelve el tipo MIME para una extensión, o false si no lo reconoce */
    export function lookup(path: string): string | false
}