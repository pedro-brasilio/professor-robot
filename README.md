# Robô Professor 🤖

Aplicação web interativa que ajuda crianças a aprender matemática de forma divertida. Um "robô professor" cumprimenta o usuário e oferece operações básicas: soma, subtração, multiplicação, divisão e tabuada, com explicações didáticas e animações.

O projeto é dividido em **backend** (API em C# / ASP.NET) e **frontend** (HTML, CSS e JavaScript).

## Estrutura do projeto

```text
professor-robot/
├── backend/                 # API em C# (ASP.NET Minimal API)
│   ├── Program.cs           # Endpoints das operações matemáticas
│   ├── amigo_robot.csproj
│   └── amigo_robot.slnx
├── frontend/                # Interface web (arquivos estáticos)
│   ├── index.html
│   ├── app.js
│   └── styles.css
└── README.md
```

O backend serve os arquivos do `frontend/` e expõe os endpoints de cálculo. Assim o frontend e o backend ficam organizados em pastas separadas, mas rodam juntos com um único comando.

## Funcionalidades

* Solicita o nome do usuário;
* Soma, subtração, multiplicação e divisão entre dois números;
* Exibe a tabuada de um número (de 1 a 10);
* Explicações didáticas de cada operação;
* Interface amigável com mascote animado.

## Tecnologias utilizadas

* C# / .NET 10 (ASP.NET Minimal API)
* HTML, CSS e JavaScript (sem frameworks)

## API

Todos os endpoints recebem `POST` com corpo JSON.

| Endpoint          | Corpo                    | Resposta                                  |
| ----------------- | ------------------------ | ----------------------------------------- |
| `/api/somar`      | `{ "a": 7, "b": 5 }`     | `{ "a": 7, "b": 5, "resultado": 12 }`     |
| `/api/subtrair`   | `{ "a": 7, "b": 5 }`     | `{ "a": 7, "b": 5, "resultado": 2 }`      |
| `/api/multiplicar`| `{ "a": 7, "b": 5 }`     | `{ "a": 7, "b": 5, "resultado": 35 }`     |
| `/api/dividir`    | `{ "a": 10, "b": 2 }`    | `{ "a": 10, "b": 2, "resultado": 5 }`     |
| `/api/tabuada`    | `{ "numero": 7 }`        | `{ "numero": 7, "linhas": [...] }`        |

Divisão por zero retorna `400 Bad Request` com uma mensagem amigável.

## Como executar o projeto

1. Clone este repositório:

   ```bash
   git clone https://github.com/pedro-brasilio/professor-robot.git
   ```

2. Entre na pasta do backend:

   ```bash
   cd professor-robot/backend
   ```

3. Execute a aplicação:

   ```bash
   dotnet run
   ```

4. Abra no navegador o endereço exibido no terminal (por exemplo, `http://localhost:5000`).

## Objetivo

Projeto criado com foco em aprendizado e prática: lógica de programação em C#, criação de uma API web e integração com um frontend, mantendo backend e frontend bem organizados.

## Autor

**Pedro Luciano Brasilio dos Santos**
