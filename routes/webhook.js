import { Router } from 'express';
import { WebhookController } from '../controllers/index.js';

export default class WebhookRoutes {
	constructor() {
		this.router = new Router();
		this.webhookController = new WebhookController();
	}

	setup() {
		this.router.post('/', this.webhookController.processWebhook.bind(this.webhookController));
		this.router.get('/', this.webhookController.getStatus.bind(this.webhookController));
		return this.router;
	}
}
