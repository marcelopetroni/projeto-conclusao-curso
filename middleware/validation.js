function validateWebhookRequest(req, res, next) {
try {
	if (!req.body) {
		return res.status(400).json({
			error: 'Corpo da requisição não encontrado',
			fulfillmentText: 'Erro na requisição. Tente novamente.'
		});
	}

	if (!req.body.queryResult) {
		return res.status(400).json({
			error: 'queryResult não encontrado na requisição',
			fulfillmentText: 'Erro na requisição. Tente novamente.'
		});
	}

	const { queryResult } = req.body;

	if (!queryResult.intent) {
		console.warn('Intent não encontrado na requisição');
	}

	if (!queryResult.parameters) {
		console.warn('Parâmetros não encontrados na requisição');
	}

	next();

} catch (error) {
	console.error('Erro na validação da requisição:', error);
	res.status(500).json({
		error: 'Erro interno na validação',
		fulfillmentText: 'Desculpe, ocorreu um erro interno. Tente novamente.'
	});
}
}

function validateDialogflowSource(req, res, next) {
const userAgent = req.get('User-Agent') || '';

	if (userAgent.includes('Google-Dialogflow') || userAgent.includes('Dialogflow')) {
		next();
	} else {
		console.warn('Requisição pode não ser do Dialogflow:', userAgent);
		next();
	}
}

module.exports = {
	validateWebhookRequest,
	validateDialogflowSource
};