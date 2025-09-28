import { Router } from 'express';
import { ScheduleController } from '../controllers/index.js';

export default class ScheduleRoutes {
    constructor() {
        this.router = new Router();
        this.scheduleController = new ScheduleController();
    }

    setup() {
        this.router.get('/available', this.scheduleController.getAvailableSchedules.bind(this.scheduleController));
        this.router.post('/:schedule_id/book', this.scheduleController.bookSchedule.bind(this.scheduleController));
        this.router.put('/:schedule_id/cancel', this.scheduleController.cancelSchedule.bind(this.scheduleController));
        return this.router;
    }
}
