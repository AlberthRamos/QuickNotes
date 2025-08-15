const rabbitMQService = require('./config/rabbitmq');
const db = require('./config/database');

class NoteProcessor {
  constructor() {
    this.isProcessing = false;
  }

  async start() {
    try {
      console.log('🚀 Iniciando processador de notas...');
      
      await rabbitMQService.consumeNotes(async (noteData) => {
        await this.processNote(noteData);
      });

      console.log('✅ Processador de notas iniciado com sucesso');
    } catch (error) {
      console.error('❌ Erro ao iniciar processador:', error.message);
      process.exit(1);
    }
  }

  async processNote(noteData) {
    try {
      this.isProcessing = true;
      console.log('📝 Processando nota:', noteData);

      // Simular processamento pesado (análise de sentimento, notificações, etc.)
      await this.simulateProcessing();

      // Aqui você pode adicionar:
      // - Análise de sentimento
      // - Envio de notificações
      // - Registro de métricas
      // - Integração com outros sistemas

      console.log('✅ Nota processada com sucesso:', noteData.id);
      
    } catch (error) {
      console.error('❌ Erro ao processar nota:', error.message);
    } finally {
      this.isProcessing = false;
    }
  }

  async simulateProcessing() {
    // Simula processamento assíncrono
    return new Promise(resolve => {
      setTimeout(() => {
        console.log('⏳ Processamento concluído');
        resolve();
      }, 2000); // 2 segundos de processamento
    });
  }

  async getProcessingStatus() {
    return {
      isProcessing: this.isProcessing,
      timestamp: new Date().toISOString()
    };
  }
}

// Iniciar o consumidor se este arquivo for executado diretamente
if (require.main === module) {
  const processor = new NoteProcessor();
  
  // Tratamento de sinais para graceful shutdown
  process.on('SIGTERM', async () => {
    console.log('🛑 Recebido SIGTERM, encerrando...');
    await rabbitMQService.close();
    process.exit(0);
  });

  process.on('SIGINT', async () => {
    console.log('🛑 Recebido SIGINT, encerrando...');
    await rabbitMQService.close();
    process.exit(0);
  });

  processor.start();
}

module.exports = NoteProcessor;