const express = require('express');
const cors = require('cors');
const pool = require('./config/database');
const { body, validationResult, param } = require('express-validator');
const { specs, swaggerUi } = require('./swagger');
const rabbitMQService = require('./config/rabbitmq');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(express.json());

// Swagger documentation
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs, {
  explorer: true,
  customCss: '.swagger-ui .topbar { display: none }',
  customSiteTitle: "QuickNotes CRM API"
}));

// Rotas da API

/**
 * @swagger
 * /clientes/{clienteId}/notas:
 *   get:
 *     summary: Lista todas as notas de um cliente
 *     description: Retorna todas as notas vinculadas a um cliente específico, ordenadas por data de criação (mais recente primeiro)
 *     tags: [Notas]
 *     parameters:
 *       - in: path
 *         name: clienteId
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: ID do cliente
 *     responses:
 *       200:
 *         description: Lista de notas recuperada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Nota'
 *                 total:
 *                   type: integer
 *                   description: Total de notas encontradas
 *       400:
 *         description: ID do cliente inválido
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Erro interno do servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
// GET /clientes/:clienteId/notas - Lista todas as notas de um cliente
app.get('/clientes/:clienteId/notas', [
    param('clienteId').isInt({ min: 1 }).withMessage('ID do cliente deve ser um número válido')
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }

    const { clienteId } = req.params;

    try {
        const [rows] = await pool.execute(`
            SELECT n.id, n.texto, n.data_criacao, n.cliente_id, n.usuario_id, u.nome as usuario_nome
            FROM notas n
            JOIN usuarios u ON n.usuario_id = u.id
            WHERE n.cliente_id = ?
            ORDER BY n.data_criacao DESC
        `, [clienteId]);

        res.json({
            success: true,
            data: rows,
            total: rows.length
        });
    } catch (error) {
        console.error('Erro ao buscar notas:', error);
        res.status(500).json({ 
            success: false,
            error: 'Erro ao buscar notas do cliente' 
        });
    }
});

/**
 * @swagger
 * /clientes/{clienteId}/notas:
 *   post:
 *     summary: Cria uma nova nota para um cliente
 *     description: Cria uma nova nota vinculada a um cliente específico
 *     tags: [Notas]
 *     parameters:
 *       - in: path
 *         name: clienteId
 *         required: true
 *         schema:
 *           type: integer
 *           minimum: 1
 *         description: ID do cliente
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - texto
 *               - usuario_id
 *             properties:
 *               texto:
 *                 type: string
 *                 description: Conteúdo da nota
 *                 minLength: 1
 *                 maxLength: 1000
 *                 example: "Cliente solicitou orçamento via WhatsApp"
 *               usuario_id:
 *                 type: integer
 *                 description: ID do usuário que está criando a nota
 *                 minimum: 1
 *                 example: 1
 *     responses:
 *       201:
 *         description: Nota criada com sucesso
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 success:
 *                   type: boolean
 *                   example: true
 *                 data:
 *                   $ref: '#/components/schemas/Nota'
 *                 message:
 *                   type: string
 *                   example: "Nota criada com sucesso"
 *       400:
 *         description: Dados inválidos fornecidos
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Erro interno do servidor
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
// POST /clientes/:clienteId/notas - Cria uma nova nota para um cliente
app.post('/clientes/:clienteId/notas', [
    param('clienteId').isInt({ min: 1 }).withMessage('ID do cliente deve ser um número válido'),
    body('texto').notEmpty().withMessage('O texto da nota não pode ser vazio'),
    body('usuario_id').isInt({ min: 1 }).withMessage('ID do usuário deve ser um número válido')
], async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        return res.status(400).json({ 
            success: false,
            errors: errors.array() 
        });
    }

    const { clienteId } = req.params;
    const { texto, usuario_id } = req.body;

    try {
        const [result] = await pool.execute(
            'INSERT INTO notas (texto, cliente_id, usuario_id) VALUES (?, ?, ?)',
            [texto, clienteId, usuario_id]
        );

        const [newNote] = await pool.execute(`
            SELECT n.id, n.texto, n.data_criacao, n.cliente_id, n.usuario_id, u.nome as usuario_nome
            FROM notas n
            JOIN usuarios u ON n.usuario_id = u.id
            WHERE n.id = ?
        `, [result.insertId]);

        // Publicar mensagem no RabbitMQ para processamento assíncrono
        try {
            await rabbitMQService.publishNote(newNote[0]);
            console.log('📤 Mensagem enviada para fila de processamento');
        } catch (rabbitError) {
            console.error('❌ Erro ao enviar para RabbitMQ:', rabbitError.message);
            // Não falhar a criação da nota se o RabbitMQ estiver indisponível
        }

        res.status(201).json({
            success: true,
            data: newNote[0],
            message: 'Nota criada com sucesso'
        });
    } catch (error) {
        console.error('Erro ao criar nota:', error);
        res.status(500).json({ 
            success: false,
            error: 'Erro ao criar nota no banco de dados' 
        });
    }
});

// GET /clientes - Lista todos os clientes (para facilitar testes)
app.get('/clientes', async (req, res) => {
    try {
        const [rows] = await pool.execute('SELECT * FROM clientes ORDER BY nome');
        res.json({
            success: true,
            data: rows
        });
    } catch (error) {
        console.error('Erro ao buscar clientes:', error);
        res.status(500).json({ 
            success: false,
            error: 'Erro ao buscar clientes' 
        });
    }
});

// GET /usuarios - Lista todos os usuários (para facilitar testes)
app.get('/usuarios', async (req, res) => {
    try {
        const [rows] = await pool.execute('SELECT id, nome, email FROM usuarios ORDER BY nome');
        res.json({
            success: true,
            data: rows
        });
    } catch (error) {
        console.error('Erro ao buscar usuários:', error);
        res.status(500).json({ 
            success: false,
            error: 'Erro ao buscar usuários' 
        });
    }
});

// Rota de health check
app.get('/health', (req, res) => {
    res.json({ 
        success: true, 
        message: 'API de Notas CRM está funcionando',
        timestamp: new Date().toISOString() 
    });
});

// Tratamento de rotas não encontradas
app.use('*', (req, res) => {
    res.status(404).json({ 
        success: false,
        error: 'Rota não encontrada' 
    });
});

// Inicialização do servidor
app.listen(PORT, () => {
    console.log(`🚀 Servidor rodando na porta ${PORT}`);
    console.log(`📊 Health check: http://localhost:${PORT}/health`);
    console.log(`📝 Documentação da API disponível em: http://localhost:${PORT}`);
});