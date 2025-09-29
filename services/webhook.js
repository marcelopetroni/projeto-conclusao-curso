import DoctorService from './doctor.js'
import ScheduleService from './schedule.js'

class WebhookService {
	constructor() {
		this.doctorService = new DoctorService()
		this.scheduleService = new ScheduleService()
	}

	async processWebhook(requestBody) {
		try {
			const { queryResult } = requestBody
			if (!queryResult) {
				throw new Error('queryResult ausente')
			}

			const intent = queryResult.intent?.displayName || 'Default Fallback Intent'
			const parameters = queryResult.parameters || {}

			const response = await this.handleIntent(intent, parameters)

			return { fulfillmentText: response }
		} catch (error) {
		return { fulfillmentText: 'Erro ao processar sua solicitação.' }
		}
	}

	async handleIntent(intentName, parameters) {
		return intentName === 'Agendamento' ? this.handleListAllDoctors()
			: intentName === 'List All Doctors' ? this.handleListAllDoctors()
			: intentName === 'Get Doctor Schedules' ? this.handleGetSchedules(parameters)
			: intentName === 'Book Appointment' ? this.handleBookAppointment(parameters)
			: intentName === 'Cancel Appointment' ? this.handleCancelAppointment(parameters)
			: 'Não entendi sua solicitação.'
	}

	async handleListAllDoctors() {
		const doctors = await this.doctorService.getAllAvailableDoctors()

		if (!doctors.length) {
			return 'Nenhum médico cadastrado.'
		}

		return `Perfeito! Aqui estão os médicos disponíveis. Digite o número correspondente para escolher:\n\n` +
  		doctors.map((d, index) => `${index + 1}. ${d.name} - ${d.specialty}`).join('\n')
	}

	async handleGetSchedules(parameters) {
		const doctorId = parameters?.doctor_id

		if (!doctorId) {
			return 'Informe o ID do médico.'
		}

		const schedules = await this.scheduleService.getAvailableSchedulesByDoctor(doctorId)

		if (!schedules.length) {
			return 'Nenhum horário disponível.'
		}

		return schedules.map(s => `• ${s.time} (ID: ${s.id})`).join('\n')
	}

	async handleBookAppointment(parameters) {
		const { schedule_id, patient_name, patient_phone } = parameters

		if (!schedule_id || !patient_name) {
			return 'Informe o horário e o nome do paciente.'
		}

		const result = await this.scheduleService.confirmAppointment(schedule_id, {
			patient_name,
			patient_phone
		})

		return `Agendamento confirmado. ID: ${result.id} Data: ${result.date} Hora: ${result.time}`
	}

	async handleCancelAppointment(parameters) {
		const appointmentId = parameters?.appointment_id

		if (!appointmentId) {
			return 'Informe o ID do agendamento.'
		}

		await this.scheduleService.cancelSchedule(appointmentId)

		return 'Agendamento cancelado com sucesso.'
	}
}

export default WebhookService
