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
    endereco: string;
}

export interface usuarioClienteAtualizacaoDadosSensiveis {
    email: string;
    senha: string;
}