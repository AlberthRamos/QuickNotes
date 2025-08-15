const rabbitMQService = require('./config/rabbitmq');

async function testRabbitMQ() {
  try {
    console.log('🧪 Iniciando teste do RabbitMQ...');
    
    // Testar conexão
    await rabbitMQService.connect();
    
    // Testar publicação
    const testNote = {
      id: 999,
      texto: 'Teste de integração RabbitMQ',
      cliente_id: 1,
      usuario_id: 1,
      data_criacao: new Date().toISOString(),
      usuario_nome: 'Test User'
    };
    
    await rabbitMQService.publishNote(testNote);
    console.log('✅ Mensagem de teste publicada com sucesso');
    
    // Aguardar um pouco antes de fechar
    setTimeout(async () => {
      await rabbitMQService.close();
      console.log('✅ Teste concluído');
      process.exit(0);
    }, 2000);
    
  } catch (error) {
    console.error('❌ Erro no teste:', error.message);
    process.exit(1);
  }
}

// Executar teste se o arquivo for executado diretamente
if (require.main === module) {
  testRabbitMQ();
}

module.exports = testRabbitMQ;