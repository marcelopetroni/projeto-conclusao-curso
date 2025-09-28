import ScheduleService from '../services/schedule.js';

class ScheduleController {
    constructor() {
        this.scheduleService = new ScheduleService();
    }

    async getAvailableSchedules(req, res) {
        try {
            const { doctor_id, date } = req.query;
            const schedules = await this.scheduleService.getAvailableSchedules(doctor_id, date);
            res.status(200).json({
                success: true,
                data: schedules
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                error: error.message || 'Erro ao buscar horários disponíveis'
            });
        }
    }

    async bookSchedule(req, res) {
        try {
            const { schedule_id } = req.params;
            const { patient_name, patient_phone } = req.body;
            const result = await this.scheduleService.bookSchedule(schedule_id, { patient_name, patient_phone });
            res.status(200).json({
                success: true,
                data: result
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                error: error.message || 'Erro ao agendar horário'
            });
        }
    }

    async cancelSchedule(req, res) {
        try {
            const { schedule_id } = req.params;
            const result = await this.scheduleService.cancelSchedule(schedule_id);
            res.status(200).json({
                success: true,
                data: result
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                error: error.message || 'Erro ao cancelar agendamento'
            });
        }
    }
}

export default ScheduleController;
