import WebhookService from '../services/webhook.js';

class WebhookController {
    constructor() {
        this.webhookService = new WebhookService();
    }

    async processWebhook(req, res) {
        try {
            const response = await this.webhookService.processWebhook(req.body);
            res.status(200).json(response);
        } catch (error) {
            res.status(500).json({
                success: false,
                error: error.message || 'Erro interno do servidor',
                fulfillmentText: 'Desculpe, ocorreu um erro interno. Tente novamente.'
            });
        }
    }

    async getStatus(req, res) {
        try {
            res.status(200).json({
                success: true,
                message: 'Webhook do Dialogflow está funcionando!',
                timestamp: new Date().toISOString(),
                endpoints: {
                    'POST /webhook': 'Receber requisições do Dialogflow',
                    'GET /webhook': 'Verificar status do webhook'
                }
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                error: error.message || 'Erro interno do servidor'
            });
        }
    }
}

export default WebhookController;
