export interface payload {
    id: string
}


export interface anuncio {
    titulo: string;
    descricao: string;
    preco: string
    servico: string;
    latitude: string;
    longitude: string;  
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
    foto: string;
    cnpj: string;
    horarioDisponibilidade: string;
}

export interface usuarioPrestadorAtualizaDadosSensiveis {
    email: string;
    senha: string;
}

export interface usuarioCliente {
    nome: string;
    email: string;
    senha: string;
    telefone: string;
    cpf: string;
    endereco: string;
}

export interface usuarioClienteAtualizacao {
    nome: string;
    telefone: string;
    foto: string;
    cpf: string;
    endereco: string;
}

export interface usuarioClienteAtualizacaoDadosSensiveis {
    email: string;
    senha: string;
}