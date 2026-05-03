# Draft 2K - Roleta

Este é um projeto web estático (HTML, CSS e JavaScript) desenvolvido para realizar um draft divertido entre amigos usando um sistema interativo de roletas.

## 🚀 Como executar o projeto localmente

Se você baixou o código-fonte deste projeto e deseja rodá-lo localmente na porta **8080**, você precisará de um servidor web simples. Como não há backend complexo, você pode usar ferramentas nativas se tiver Python ou Node.js instalados.

Escolha uma das opções abaixo:

### Opção 1: Usando Python (Método mais rápido se já o tiver instalado)
O Python possui um servidor HTTP embutido perfeito para arquivos estáticos.

1. Abra o terminal (ou Prompt de Comando / PowerShell) dentro da pasta raiz do projeto (`Roleta`).
2. Digite o seguinte comando e aperte Enter:
   ```bash
   python -m http.server 8080
   ```
   *(Dica: Se estiver no Mac ou Linux, talvez seja necessário usar `python3` no lugar de `python`)*

### Opção 2: Usando Node.js (http-server)
Se você é da área da programação web e já usa Node/npm, essa opção é excelente.

1. Abra o terminal na pasta raiz do projeto.
2. Execute o comando:
   ```bash
   npx http-server -p 8080
   ```

### Opção 3: PHP Embutido
Caso você desenvolva em PHP e o tenha na sua máquina:
```bash
php -S localhost:8080
```

## 🌐 Acessando o site

Assim que o servidor estiver rodando por um dos métodos acima, abra o seu navegador favorito e acesse o endereço: **http://localhost:8080**