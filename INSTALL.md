# 🚀 Guia de Instalação - QuickNotes CRM

## 📋 Pré-requisitos

Antes de começar, certifique-se de ter instalado:

- **Node.js** (versão 16 ou superior)
- **npm** ou **yarn**
- **Docker** e **Docker Compose** (para instalação via Docker)
- **MySQL** (para instalação manual)

## 🔧 Opção 1: Instalação com Docker (Recomendado)

### 1. Clone ou baixe o projeto
```bash
cd QuickNotes-CRM
```

### 2. Execute o script de setup automático
```bash
chmod +x setup.sh
./setup.sh
```

### 3. Acesse a aplicação
- **Frontend**: http://localhost:4200
- **Backend API**: http://localhost:3000
- **Documentação Swagger**: http://localhost:3000/api-docs
- **MySQL**: localhost:3306

## ⚙️ Opção 2: Instalação Manual

### 1. Configuração do Banco de Dados
```bash
# Instale e configure o MySQL
create database crm_db;

# Execute o schema
mysql -u root -p crm_db < database/schema.sql
```

### 2. Configuração do Backend
```bash
cd backend
npm install

# Configure as variáveis de ambiente
cp .env.example .env  # ou crie manualmente

# Inicie o servidor
npm start
```

### 3. Configuração do Frontend
```bash
cd frontend
npm install

# Inicie o servidor de desenvolvimento
ng serve
```

## 📝 Configuração de Variáveis de Ambiente

### Backend (.env)
```
# Database Configuration
DB_HOST=localhost
DB_PORT=3306
DB_USER=root
DB_PASSWORD=sua_senha
DB_NAME=crm_db

# Server Configuration
PORT=3000
NODE_ENV=development
```

### Frontend (src/environments/environment.ts)
```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000/api'
};
```

## 🧪 Testando a Instalação

### 1. Verificar Backend
```bash
curl http://localhost:3000/api/health
```

### 2. Verificar Frontend
Abra http://localhost:4200 no navegador

### 3. Verificar Documentação
Acesse http://localhost:3000/api-docs

## 🐛 Solução de Problemas

### Erros Comuns

#### Angular dependencies não encontrados
```bash
cd frontend
npm install
```

#### Portas já em uso
```bash
# Docker
docker-compose down
docker-compose up -d

# Manual
# Backend: altere a porta no .env
# Frontend: ng serve --port 4201
```

#### MySQL connection refused
```bash
# Verifique se o MySQL está rodando
sudo systemctl start mysql

# Verifique as credenciais no arquivo .env
```

#### CORS errors no frontend
```bash
# Verifique se o backend está rodando na porta correta
# Verifique se a URL no environment.ts está correta
```

## 🎯 Comandos Úteis

### Docker
```bash
# Ver logs
docker-compose logs

# Reiniciar serviços
docker-compose restart

# Acessar containers
docker-compose exec backend sh
docker-compose exec mysql mysql -u root -p
```

### Desenvolvimento
```bash
# Backend com hot reload
npm run dev

# Frontend com hot reload
ng serve

# Testes
npm test
```

## 📊 Verificação Final

Após a instalação, você deve ver:

1. **Frontend**: Interface Angular com formulário de criação de notas
2. **Backend**: API respondendo em http://localhost:3000/api
3. **Swagger**: Documentação interativa em /api-docs
4. **MySQL**: Tabelas criadas com dados de exemplo

## 🆘 Suporte

Se encontrar problemas:
1. Verifique os logs com `docker-compose logs`
2. Confirme que todas as portas estão disponíveis
3. Verifique as credenciais do banco de dados
4. Consulte a documentação Swagger para testar endpoints

## 📞 Contato

Para suporte adicional, abra uma issue no repositório ou consulte a documentação em `/docs`.