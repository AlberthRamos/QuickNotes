const swaggerJsdoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'QuickNotes CRM API',
      version: '1.0.0',
      description: 'API para sistema de notas rápidas integrado ao CRM',
      contact: {
        name: 'Suporte QuickNotes',
        email: 'suporte@quicknotes.com'
      },
      license: {
        name: 'MIT',
        url: 'https://opensource.org/licenses/MIT'
      }
    },
    servers: [
      {
        url: 'http://localhost:3000',
        description: 'Servidor de Desenvolvimento'
      },
      {
        url: 'https://api.quicknotes.com',
        description: 'Servidor de Produção'
      }
    ],
    components: {
      schemas: {
        Nota: {
          type: 'object',
          required: ['texto', 'usuario_id'],
          properties: {
            id: {
              type: 'integer',
              description: 'ID único da nota'
            },
            texto: {
              type: 'string',
              description: 'Conteúdo da nota',
              minLength: 1,
              maxLength: 1000
            },
            data_criacao: {
              type: 'string',
              format: 'date-time',
              description: 'Data e hora da criação da nota'
            },
            cliente_id: {
              type: 'integer',
              description: 'ID do cliente vinculado'
            },
            usuario_id: {
              type: 'integer',
              description: 'ID do usuário que criou a nota'
            },
            usuario_nome: {
              type: 'string',
              description: 'Nome do usuário que criou a nota'
            }
          }
        },
        Error: {
          type: 'object',
          properties: {
            success: {
              type: 'boolean',
              example: false
            },
            error: {
              type: 'string',
              description: 'Mensagem de erro'
            },
            errors: {
              type: 'array',
              items: {
                type: 'object',
                properties: {
                  msg: {
                    type: 'string'
                  },
                  param: {
                    type: 'string'
                  },
                  location: {
                    type: 'string'
                  }
                }
              }
            }
          }
        }
      }
    }
  },
  apis: ['./server.js', './routes/*.js']
};

const specs = swaggerJsdoc(options);

module.exports = { specs, swaggerUi };