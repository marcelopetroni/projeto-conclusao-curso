import DoctorService from '../services/doctor.js';

class DoctorController {
    constructor() {
        this.doctorService = new DoctorService();
    }

    async getAvailableDoctors(req, res) {
        try {
            const doctors = await this.doctorService.getAvailableDoctors();
            res.status(200).json({
                success: true,
                data: doctors
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                error: error.message || 'Erro ao buscar médicos disponíveis'
            });
        }
    }

    async getDoctorAvailableSchedules(req, res) {
        try {
            const { doctor_id } = req.params;
            const { date } = req.query;
            const schedules = await this.doctorService.getDoctorAvailableSchedules(doctor_id, date);
            res.status(200).json({
                success: true,
                data: schedules
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                error: error.message || 'Erro ao buscar horários disponíveis do médico'
            });
        }
    }

    async createDoctor(req, res) {
        try {
            const { name, specialty, email, phone } = req.body;

            if (!name || !specialty) {
                return res.status(400).json({
                    success: false,
                    error: 'Nome e especialidade são obrigatórios'
                });
            }

            const doctor = await this.doctorService.createDoctor({
                name,
                specialty,
                email,
                phone
            });

            res.status(201).json({
                success: true,
                data: doctor,
                message: 'Médico criado com sucesso'
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                error: error.message || 'Erro ao criar médico'
            });
        }
    }
}

export default DoctorController;
