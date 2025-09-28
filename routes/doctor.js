import { Router } from 'express';
import { DoctorController } from '../controllers/index.js';

export default class DoctorRoutes {
    constructor() {
        this.router = new Router();
        this.doctorController = new DoctorController();
    }

    setup() {
        this.router.get('/available', this.doctorController.getAvailableDoctors.bind(this.doctorController));
        this.router.get('/:doctor_id/schedules', this.doctorController.getDoctorSchedules.bind(this.doctorController));
        this.router.post('/', this.doctorController.createDoctor.bind(this.doctorController));
        return this.router;
    }
}
