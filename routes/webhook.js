const express = require('express');
const { processWebhook } = require('../services/dialogflowService');
const { validateWebhookRequest } = require('../middleware/validation');

const router = express.Router();

router.post('/', validateWebhookRequest, async (req, res) => {
    try {
        console.log('Webhook recebido:', JSON.stringify(req.body, null, 2));

        const response = await processWebhook(req.body);

        console.log('Resposta enviada:', JSON.stringify(response, null, 2));
        res.json(response);
    } catch (error) {
        console.error('Erro ao processar webhook:', error);
        res.status(500).json({
            fulfillmentText: 'Desculpe, ocorreu um erro interno. Tente novamente.',
            source: 'webhook'
        });
    }
});

router.get('/', (req, res) => {
    res.json({
        message: 'Webhook do Dialogflow está funcionando!',
        timestamp: new Date().toISOString(),
        endpoints: {
            'POST /webhook': 'Receber requisições do Dialogflow',
            'GET /webhook': 'Verificar status do webhook'
        }
    });
});

module.exports = router;