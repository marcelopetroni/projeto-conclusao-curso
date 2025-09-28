import Doctor from '../models/Doctor.js';
import Schedule from '../models/Schedule.js';

class DoctorService {
    constructor() {
        this.Doctor = Doctor;
        this.Schedule = Schedule;
    }

    async getAvailableDoctors(date) {
        const doctors = await this.Doctor.findAll({
            where: { active: true },
            include: [{
                model: this.Schedule,
                as: 'schedules',
                where: {
                    date: date,
                    status: 'available'
                },
                required: true
            }]
        });

        return doctors.map(doctor => ({
            id: doctor.id,
            name: doctor.name,
            specialty: doctor.specialty,
            email: doctor.email,
            phone: doctor.phone
        }));
    }

    async getAllAvailableDoctors() {
        const doctors = await this.Doctor.findAll({
            where: {
				active: true
			},
            order: [['name', 'ASC']]
        });

        return doctors.map(doctor => ({
            id: doctor.id,
            name: doctor.name,
            specialty: doctor.specialty,
            email: doctor.email,
            phone: doctor.phone
        }));
    }

    async getDoctorById(id) {
        const doctor = await this.Doctor.findByPk(id);
        if (!doctor) {
            throw new Error('Médico não encontrado');
        }
        return doctor;
    }

    async getDoctorByName(name) {
        const doctor = await this.Doctor.findOne({
            where: {
                name: {
                    [this.Doctor.sequelize.Sequelize.Op.like]: `%${name}%`
                },
                active: true
            }
        });
        return doctor;
    }

    async getDoctorSchedules(doctorId, date) {
        const doctor = await this.getDoctorById(doctorId);

        const schedules = await this.Schedule.findAll({
            where: {
                doctor_id: doctorId,
                date: date
            },
            order: [['time', 'ASC']]
        });

        return schedules.map(schedule => ({
            id: schedule.id,
            time: schedule.time,
            status: schedule.status,
            patient_name: schedule.patient_name,
            patient_phone: schedule.patient_phone,
            available: schedule.status === 'available'
        }));
    }

    async checkDoctorAvailability(doctorId, date) {
        const availableSchedules = await this.Schedule.count({
            where: {
                doctor_id: doctorId,
                date: date,
                status: 'available'
            }
        });

        return availableSchedules > 0;
    }

    async getAllDoctors() {
        const doctors = await this.Doctor.findAll({
            where: { active: true },
            order: [['name', 'ASC']]
        });

        return doctors;
    }

    async createDoctor(doctorData) {
        const doctor = await this.Doctor.create(doctorData);
        return doctor;
    }

    async updateDoctor(id, doctorData) {
        const doctor = await this.getDoctorById(id);
        await doctor.update(doctorData);
        return doctor;
    }

    async deleteDoctor(id) {
        const doctor = await this.getDoctorById(id);
        await doctor.update({ active: false });
        return { message: 'Médico desativado com sucesso' };
    }
}

export default DoctorService;