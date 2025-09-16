const intentHandlers = require('./intentHandlers');

async function processWebhook(requestBody) {
    try {
        const { queryResult, session } = requestBody;

        if (!queryResult) {
            throw new Error('queryResult não encontrado na requisição');
        }

        const { intent, parameters, fulfillmentText } = queryResult;
        const intentName = intent?.displayName || 'Default Fallback Intent';

        console.log(`Intent detectado: ${intentName}`);
        console.log(`Parâmetros:`, parameters);

        const response = await handleIntent(intentName, parameters, session);

        return {
            fulfillmentText: response.text,
            fulfillmentMessages: response.messages || [],
            source: 'webhook',
            payload: response.payload || {}
        };

    } catch (error) {
        console.error('Erro ao processar webhook:', error);
        return {
            fulfillmentText: 'Desculpe, não consegui processar sua solicitação. Tente novamente.',
            source: 'webhook'
        };
    }
}

async function handleIntent(intentName, parameters, session) {
    const handler = intentHandlers[intentName];

    if (handler) {
        return await handler(parameters, session);
    } else {
        console.warn(`Handler não encontrado para intent: ${intentName}`);
        return intentHandlers['Default Fallback Intent'](parameters, session);
    }
}

module.exports = {
    processWebhook,
    handleIntent
};