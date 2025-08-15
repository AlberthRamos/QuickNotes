# QuickNotes CRM 📝

## Visão Geral

O **QuickNotes CRM** é um módulo de notas rápidas integrado a sistemas de CRM e gestão de atendimentos. Permite que equipes de vendas, suporte e relacionamento registrem informações rápidas sobre clientes, com histórico organizado, fácil acesso e vinculação direta ao usuário e ao cliente.

### 🎯 Diferencial
- **Rapidez**: Interface simples e direta para criação de notas
- **Simplicidade**: Fluxo intuitivo sem complexidade desnecessária
- **Histórico estruturado**: Todas as notas organizadas por cliente e data
- **Integração pronta**: API RESTful completa para integração com outros sistemas

## 🚀 Funcionalidades

### ✅ Versão 1.0 (MVP)
- [x] Criar notas rápidas vinculadas a clientes
- [x] Visualizar histórico de notas por cliente (ordenado por data)
- [x] Controle de autoria (cada nota identifica o usuário que a criou)
- [x] Validações simples (impedir notas vazias)
- [x] API RESTful pronta para integração

### 🔄 Versão 2.0 (Em desenvolvimento)
- [ ] Filtro de notas por usuário ou data
- [ ] Edição e exclusão de notas
- [ ] Integração com dashboard do CRM
- [ ] Exportação de relatórios

### 🤖 Versão 3.0 (Futuro)
- [ ] Análise de sentimento das notas (IA)
- [ ] Relatórios automáticos de atendimento
- [ ] Insights para vendas baseados em padrões
- [ ] Notificações inteligentes

## 🏗️ Arquitetura do Projeto

```
QuickNotes CRM/
├── 📁 backend/           # API Node.js + Express
├── 📁 frontend/          # Aplicação Angular
├── 📁 database/          # Scripts SQL e migrações
├── 📁 docker/            # Configurações Docker
├── 📁 docs/              # Documentação técnica
├── 📄 docker-compose.yml # Orquestração de containers
└── 📄 README.md          # Este arquivo
```

### Backend (Node.js + Express)
- **Framework**: Express.js
- **Banco de dados**: MySQL 8.0
- **Validação**: express-validator
- **Documentação**: Swagger/OpenAPI 3.0
- **Testes**: Jest (em desenvolvimento)

### Frontend (Angular)
- **Framework**: Angular 17
- **UI**: Angular Material
- **HTTP**: HttpClient
- **Estado**: RxJS Observables

### Banco de Dados (MySQL)
```sql
CREATE TABLE notas (
    id INT AUTO_INCREMENT PRIMARY KEY,
    cliente_id INT NOT NULL,
    usuario_id INT NOT NULL,
    texto TEXT NOT NULL,
    data_criacao TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (cliente_id) REFERENCES clientes(id),
    FOREIGN KEY (usuario_id) REFERENCES usuarios(id)
);
```

## 🐳 Instalação com Docker

### Pré-requisitos
- Docker 20.10+
- Docker Compose 2.0+

### Passos rápidos

1. **Clone o repositório**
```bash
git clone https://github.com/AlberthRamos/QuickNotes.git
cd Quicknotes
```

2. **Configure as variáveis de ambiente**
```bash
cp backend/.env.example backend/.env
# Edite o arquivo .env com suas configurações
```

3. **Inicie os containers**
```bash
docker-compose up -d
```

4. **Acesse a aplicação**
- **Frontend**: http://localhost:4200
- **Backend API**: http://localhost:3000
- **Documentação API**: http://localhost:3000/api-docs
- **MySQL**: localhost:3306

### Comandos úteis do Docker

```bash
# Ver logs
docker-compose logs -f

# Parar containers
docker-compose down

# Reconstruir containers
docker-compose up --build

# Acessar container do backend
docker exec -it crm-backend bash

# Acessar container do MySQL
docker exec -it crm-mysql mysql -u crm_user -p
```

## 🔧 Instalação Manual

### Backend

1. **Instale as dependências**
```bash
cd backend
npm install
```

2. **Configure o banco de dados**
```bash
# Crie o banco de dados no MySQL
mysql -u root -p < ../database/schema.sql
```

3. **Configure as variáveis de ambiente**
```bash
cp .env.example .env
# Edite o arquivo .env
```

4. **Inicie o servidor**
```bash
# Modo desenvolvimento
npm run dev

# Modo produção
npm start
```

### Frontend

1. **Instale as dependências**
```bash
cd frontend
npm install
```

2. **Configure a URL da API**
```bash
# Edite o arquivo src/environments/environment.ts
```

3. **Inicie o servidor de desenvolvimento**
```bash
ng serve
# Acesse http://localhost:4200
```

## 📚 Documentação da API

### Endpoints principais

#### Listar notas de um cliente
```http
GET /clientes/{clienteId}/notas
```

**Exemplo de resposta:**
```json
{
  "success": true,
  "data": [
    {
      "id": 1,
      "texto": "Cliente solicitou orçamento via WhatsApp",
      "data_criacao": "2024-01-15T10:30:00.000Z",
      "cliente_id": 1,
      "usuario_id": 1,
      "usuario_nome": "João Silva"
    }
  ],
  "total": 1
}
```

#### Criar nova nota
```http
POST /clientes/{clienteId}/notas
```

**Corpo da requisição:**
```json
{
  "texto": "Cliente solicitou orçamento via WhatsApp",
  "usuario_id": 1
}
```

**Exemplo de resposta:**
```json
{
  "success": true,
  "data": {
    "id": 1,
    "texto": "Cliente solicitou orçamento via WhatsApp",
    "data_criacao": "2024-01-15T10:30:00.000Z",
    "cliente_id": 1,
    "usuario_id": 1,
    "usuario_nome": "João Silva"
  },
  "message": "Nota criada com sucesso"
}
```

### Documentação completa
Acesse a documentação interativa do Swagger em: `http://localhost:3000/api-docs`

## 🧪 Testes

### Testes de API com cURL

**Listar notas de um cliente:**
```bash
curl -X GET http://localhost:3000/clientes/1/notas
```

**Criar nova nota:**
```bash
curl -X POST http://localhost:3000/clientes/1/notas \
  -H "Content-Type: application/json" \
  -d '{"texto": "Teste de nota", "usuario_id": 1}'
```

## 🚀 Deploy

### Deploy com Docker (Recomendado)
```bash
# Produção
docker-compose -f docker-compose.yml -f docker-compose.prod.yml up -d
```

### Deploy em serviços cloud
- **AWS**: ECS com Fargate
- **Google Cloud**: Cloud Run
- **Azure**: Container Instances

## 🐰 RabbitMQ - Processamento Assíncrono

O QuickNotes CRM agora inclui integração com RabbitMQ para processamento assíncrono de notas, permitindo:

- **Processamento em tempo real**: Análise e processamento de notas sem afetar a resposta da API
- **Escalabilidade**: Sistema distribuído que pode processar múltiplas notas simultaneamente
- **Resiliência**: Fila de mensagens garante que nenhuma nota seja perdida

### Acessar o RabbitMQ Management
- **URL**: http://localhost:15672
- **Usuário**: crm_user
- **Senha**: crm_password
- **Virtual Host**: crm_vhost

### Componentes do Sistema

1. **Publisher**: Publica mensagens no RabbitMQ quando uma nota é criada
2. **Consumer**: Processa as notas assincronamente (análise, notificações, etc.)
3. **Queue**: Fila `notas_queue` para armazenar as notas aguardando processamento

### Monitoramento

```bash
# Ver logs do consumer
docker-compose logs -f consumer

# Ver estatísticas do RabbitMQ
curl -u crm_user:crm_password http://localhost:15672/api/overview
```

### Testar Integração

```bash
# Testar conexão com RabbitMQ
cd backend
npm install
node test-rabbitmq.js
```

## 📊 Monitoramento

### Health Check
- **API**: GET /health
- **MySQL**: Verificar conexão via Docker

### Logs
- **Aplicação**: Configurado para stdout/stderr
- **Docker**: `docker-compose logs -f [serviço]`

## 🤝 Contribuindo

1. Fork o projeto
2. Crie sua feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit suas mudanças (`git commit -m 'Add some AmazingFeature'`)
4. Push para a branch (`git push origin feature/AmazingFeature`)
5. Abra um Pull Request


**Desenvolvido por Alberth Ramos da Silva - Engenheiro de Software**
https://www.linkedin.com/in/alberthdev/
