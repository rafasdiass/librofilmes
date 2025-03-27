

### ✅ `README.md` — LibroFilme (Angular 19)

```markdown
# 🎬 LibroFilme - Catálogo de Filmes

Aplicação desenvolvida com **Angular 19**, com foco em apresentação de filmes e detalhes de forma modular, responsiva e performática. O projeto segue boas práticas de arquitetura, com uso de SSR (Server Side Rendering), componentes reutilizáveis e organização por domínio.

---

## 🚀 Tecnologias Utilizadas

- Angular 19 (Standalone API)
- TypeScript
- SCSS (modular)
- Angular Universal (SSR)
- RxJS
- Estrutura modular e desacoplada

---

## 📂 Estrutura do Projeto

```
src/
├── app/
│   ├── components/
│   │   ├── home/
│   │   ├── movie-catalog/
│   │   ├── movie-detail-view/
│   │   └── navbar/
│   ├── shared/
│   ├── app.component.*
│   ├── app.routes.ts
│   ├── app.config.ts
│   ├── ...
├── environments/
├── index.html
├── main.ts
├── main.server.ts
├── server.ts
```

- `components`: Contém os módulos da interface (catálogo, detalhes, navbar).
- `shared`: Diretório para pipes, serviços, interfaces e helpers.
- `app.routes.ts`: Gerenciamento das rotas standalone.
- `app.config.ts`: Configurações do app com `provideRouter`, `provideHttpClient`, etc.

---

## 💻 Instalação e Execução

### 1. Clonar o repositório

```bash
git clone https://github.com/seu-usuario/libro-filme.git
cd libro-filme
```

### 2. Instalar dependências

```bash
npm install
```

### 3. Rodar localmente

#### ✅ Modo padrão (CSR):
```bash
ng serve
```

#### ⚡ Com SSR (Angular Universal):
```bash
npm run dev:ssr
```

---

## 🧩 Funcionalidades

- [x] Exibição de filmes em catálogo (cards ou lista)
- [x] Visualização de detalhes de um filme (rota dinâmica)
- [x] Navegação com standalone routing
- [x] Requisições para API externa (ex: TMDB)
- [x] Arquitetura escalável
- [x] Estilo com SCSS isolado por componente
- [x] Suporte a SSR com `@angular/ssr`
- [x] Testes com `*.spec.ts` nos componentes

---

## 🔧 Comandos disponíveis

```bash
ng serve               # Roda o projeto em modo desenvolvimento
npm run build          # Build da versão final
npm run build:ssr      # Build para SSR
npm run dev:ssr        # Roda com SSR
ng test                # Executa os testes
```

---

## 🧪 Testes

Os testes dos componentes são feitos com `Jasmine + Karma`.  
Exemplo:

```bash
ng test
```

---

## 📌 Requisitos

- Node.js v18+
- Angular CLI 17 ou 18+ (funciona com 17 e 19)
- Compatível com navegadores modernos

---

## 📃 Licença

Este projeto está licenciado sob a licença MIT.

---

**Desenvolvido por Rafael Dias**  
📧 contato: [https://www.linkedin.com/in/rdrafaeldias/](https://www.linkedin.com/in/rdrafaeldias/)
```

---

