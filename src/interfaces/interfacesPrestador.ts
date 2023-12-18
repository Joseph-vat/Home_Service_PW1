export interface payload {
    id: string
}


export interface usuarioPrestador {
    nome: string;
    email: string;
    senha: string;
    telefone: string;
    cnpj: string;
    horarioDisponibilidade: string;
}

export interface usuarioPrestadorAtualizacao {
    nome: string;
    telefone: string;
    cnpj: string;
    horarioDisponibilidade: string;
}

export interface usuarioPrestadorAtualizaDadosSensiveis {
    email: string;
    senha: string;
}