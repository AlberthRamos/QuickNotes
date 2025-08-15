const amqp = require('amqplib');
require('dotenv').config();

class RabbitMQService {
  constructor() {
    this.connection = null;
    this.channel = null;
    this.queueName = 'notas_queue';
    this.exchangeName = 'notas_exchange';
    this.routingKey = 'notas.created';
  }

  async connect() {
    try {
      const connectionString = `amqp://${process.env.RABBITMQ_USER || 'crm_user'}:${process.env.RABBITMQ_PASSWORD || 'crm_password'}@${process.env.RABBITMQ_HOST || 'localhost'}:${process.env.RABBITMQ_PORT || 5672}/${process.env.RABBITMQ_VHOST || 'crm_vhost'}`;
      
      this.connection = await amqp.connect(connectionString);
      this.channel = await this.connection.createChannel();
      
      // Declarar exchange
      await this.channel.assertExchange(this.exchangeName, 'direct', {
        durable: true
      });
      
      // Declarar fila
      await this.channel.assertQueue(this.queueName, {
        durable: true
      });
      
      // Bind fila ao exchange
      await this.channel.bindQueue(this.queueName, this.exchangeName, this.routingKey);
      
      console.log('✅ RabbitMQ conectado com sucesso');
    } catch (error) {
      console.error('❌ Erro ao conectar ao RabbitMQ:', error.message);
      throw error;
    }
  }

  async publishNote(noteData) {
    try {
      if (!this.channel) {
        await this.connect();
      }

      const message = JSON.stringify({
        ...noteData,
        timestamp: new Date().toISOString()
      });

      this.channel.publish(
        this.exchangeName,
        this.routingKey,
        Buffer.from(message),
        { persistent: true }
      );

      console.log('📤 Mensagem publicada no RabbitMQ:', noteData);
    } catch (error) {
      console.error('❌ Erro ao publicar mensagem:', error.message);
      throw error;
    }
  }

  async consumeNotes(callback) {
    try {
      if (!this.channel) {
        await this.connect();
      }

      await this.channel.consume(this.queueName, async (msg) => {
        if (msg) {
          try {
            const noteData = JSON.parse(msg.content.toString());
            console.log('📥 Mensagem recebida do RabbitMQ:', noteData);
            
            await callback(noteData);
            
            this.channel.ack(msg);
          } catch (error) {
            console.error('❌ Erro ao processar mensagem:', error.message);
            this.channel.nack(msg, false, false);
          }
        }
      });

      console.log('👂 Consumidor iniciado para fila:', this.queueName);
    } catch (error) {
      console.error('❌ Erro ao iniciar consumidor:', error.message);
      throw error;
    }
  }

  async close() {
    try {
      if (this.connection) {
        await this.connection.close();
        console.log('🔌 Conexão RabbitMQ fechada');
      }
    } catch (error) {
      console.error('❌ Erro ao fechar conexão:', error.message);
    }
  }
}

module.exports = new RabbitMQService();