function errorHandler(err, req, res, next) {
	console.error('Erro capturado pelo middleware:', {
		error: err.message,
		stack: err.stack,
		url: req.url,
		method: req.method,
		timestamp: new Date().toISOString()
	});

	if (res.headersSent) {
		return next(err);
	}

	let statusCode = 500;
	let message = 'Erro interno do servidor';

	if (err.name === 'ValidationError') {
		statusCode = 400;
		message = 'Dados inválidos na requisição';
	} else if (err.name === 'UnauthorizedError') {
		statusCode = 401;
		message = 'Não autorizado';
	} else if (err.name === 'ForbiddenError') {
		statusCode = 403;
		message = 'Acesso negado';
	} else if (err.name === 'NotFoundError') {
		statusCode = 404;
		message = 'Recurso não encontrado';
	}

	const response = {
		fulfillmentText: message,
		source: 'webhook',
		error: {
			type: err.name || 'UnknownError',
			message: err.message,
			timestamp: new Date().toISOString()
		}
	};

	if (process.env.NODE_ENV === 'development') {
		response.error.stack = err.stack;
	}

	res.status(statusCode).json(response);
}

function notFoundHandler(req, res, next) {
	const error = new Error(`Rota não encontrada: ${req.method} ${req.originalUrl}`);
	error.name = 'NotFoundError';
	error.statusCode = 404;
	next(error);
}

module.exports = {
	errorHandler,
	notFoundHandler
};