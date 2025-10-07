import DoctorService from './doctor.js'
import ScheduleService from './schedule.js'
import moment from 'moment'

class WebhookService {
	constructor() {
		this.doctorService = new DoctorService()
		this.scheduleService = new ScheduleService()
	}

	getContextParams(requestBody, contextName) {
		const outputContexts = requestBody.queryResult?.outputContexts || [];

		const context = outputContexts.find(ctx =>
			ctx.name.includes(contextName) ||
			ctx.name.includes(contextName.replace('-', '_'))
		);

		return context?.parameters || {};
	}

	async processWebhook(requestBody) {
		try {
			const { queryResult, session } = requestBody
			if (!queryResult) {
				throw new Error('queryResult ausente')
			}

			const intent = queryResult.intent?.displayName || 'Default Fallback Intent'
			const parameters = queryResult.parameters || {}

			const response = await this.handleIntent(intent, parameters, requestBody, session)

			return response
		} catch (error) {
			console.error('Erro no processamento do webhook:', error);
			return { fulfillmentText: `Desculpe, houve um erro ao processar sua solicitação. (${error.message})` }
		}
	}

	async handleIntent(intentName, parameters, requestBody, session) {
		return intentName === 'Listar medicos' ? this.handleListAllDoctors()
			: intentName === 'Listar horarios' ? this.handleGetSchedules(parameters, requestBody, session)
			: intentName === 'Informar nome' ? this.handleInformName(requestBody, session)
			: intentName === 'Informar celular' ? this.handleInformPhone(requestBody, session)
			: intentName === 'Confirmar agendamento' ? this.handleConfirmAttendance(requestBody, session)
			: intentName === 'Book Appointment' ? this.handleBookAppointment(parameters)
			: intentName === 'Cancel Appointment' ? this.handleCancelAppointment(parameters)
			: { fulfillmentText: 'Não entendi sua solicitação.' }
	}

	async handleListAllDoctors() {
		const doctors = await this.doctorService.getAllAvailableDoctors()

		if (!doctors.length) {
			return { fulfillmentText: 'Nenhum médico cadastrado.' }
		}

		return {
			fulfillmentText: `Perfeito! Aqui estão os médicos disponíveis. Digite o número correspondente para escolher:\n\n` +
  			doctors.map((d, index) => `${index + 1}. ${d.name} - ${d.specialty}`).join('\n')
		}
	}

	async handleGetSchedules(parameters, requestBody, session) {
		const previous = this.getContextParams(requestBody, "awaiting-schedule");

		if (previous.doctorId) {
			return await this.handleChooseSchedule(parameters, requestBody, session);
		}

		const doctorId = parameters?.number;

		if (!doctorId) {
			return { fulfillmentText: 'Informe o ID do médico.' }
		}

		try {
			const today = moment().format('YYYY-MM-DD');
			const schedules = await this.scheduleService.getAvailableSchedulesByDoctor(doctorId, today)

			if (!schedules.length) {
				return { fulfillmentText: 'Nenhum horário disponível para hoje.' }
			}

			const scheduleList = schedules.map((s, index) => `${index + 1} - ${moment(s.time, 'HH:mm:ss').format('HH:mm')}`).join('\n');

			return {
				fulfillmentText: `Aqui estão os horários disponíveis para hoje, escolha um número para agendar:\n\n${scheduleList}`,
				outputContexts: [
					{
						name: `${session}/contexts/awaiting-schedule`,
						lifespanCount: 3,
						parameters: {
							doctorId,
							scheduleCount: schedules.length
						}
					}
				]
			}
		} catch (error) {
			console.error('Erro ao buscar horários:', error);
			return { fulfillmentText: 'Erro ao buscar os horários disponíveis. Tente novamente.' }
		}
	}

	async handleChooseSchedule(parameters, requestBody, session) {
		const scheduleIndex = parameters?.number - 1;
		const previous = this.getContextParams(requestBody, "awaiting-schedule");

		if (!previous.doctorId) {
			return { fulfillmentText: 'Não foi possível encontrar os dados do médico. Por favor, liste os médicos novamente.' };
		}

		try {
			const today = moment().format('YYYY-MM-DD');
			const schedules = await this.scheduleService.getAvailableSchedulesByDoctor(previous.doctorId, today);
			const selectedSchedule = schedules[scheduleIndex];

			if (!selectedSchedule) {
				return { fulfillmentText: 'Horário inválido. Por favor, escolha um número da lista.' };
			}

			return {
				fulfillmentText: `Perfeito! Você escolheu o horário ${moment(selectedSchedule.time, 'HH:mm:ss').format('HH:mm')}.\n\nAgora, por favor, me informe seu nome completo:`,
				outputContexts: [
					{
						name: `${session}/contexts/awaiting-name`,
						lifespanCount: 3,
						parameters: {
							doctorId: previous.doctorId,
							scheduleId: selectedSchedule.id,
							scheduleTime: selectedSchedule.time
						}
					}
				]
			}
		} catch (error) {
			console.error('Erro ao processar escolha do horário:', error);
			return { fulfillmentText: 'Erro ao processar sua escolha. Tente novamente.' }
		}
	}

	async handleInformName(requestBody, session) {
		const parameters = requestBody.queryResult.parameters;
		const previous = this.getContextParams(requestBody, "awaiting-name");

		const patientName = parameters?.any || parameters?.patient_name || parameters?.person?.name;

		if (!patientName) {
			return { fulfillmentText: 'Por favor, informe seu nome completo.' };
		}

		return {
			fulfillmentText: `Obrigado, ${patientName}! Agora, por favor, me informe seu telefone para contato:`,
			outputContexts: [
				{
					name: `${session}/contexts/awaiting-phone`,
					lifespanCount: 3,
					parameters: {
						doctorId: previous.doctorId,
						scheduleId: previous.scheduleId,
						scheduleTime: previous.scheduleTime,
						patientName
					}
				}
			]
		};
	}

	async handleInformPhone(requestBody, session) {
		const parameters = requestBody.queryResult.parameters;
		const previous = this.getContextParams(requestBody, "awaiting-phone");

		const patientPhone = parameters?.['phone-number'] || parameters?.phone_number || parameters?.any;

		if (!patientPhone) {
			return { fulfillmentText: 'Por favor, informe seu telefone.' };
		}

		return {
			fulfillmentText: `Perfeito! Vamos confirmar seu agendamento:\n\n📅 Data: ${moment().format('DD/MM/YYYY')}\n⏰ Horário: ${moment(previous.scheduleTime, 'HH:mm:ss').format('HH:mm')}\n👤 Nome: ${previous.patientName}\n📞 Telefone: ${patientPhone}\n\nConfirma o agendamento? (Digite "sim" para confirmar)`,
			outputContexts: [
				{
					name: `${session}/contexts/awaiting-confirmation`,
					lifespanCount: 2,
					parameters: {
						doctorId: previous.doctorId,
						scheduleId: previous.scheduleId,
						scheduleTime: previous.scheduleTime,
						patientName: previous.patientName,
						patientPhone
					}
				}
			]
		};
	}

	async handleConfirmAttendance(requestBody) {
		const data = this.getContextParams(requestBody, "awaiting-confirmation");

		if (!data.scheduleId || !data.patientName || !data.patientPhone) {
			return { fulfillmentText: 'Dados incompletos para confirmar o agendamento. Por favor, comece novamente.' };
		}

		try {
			const doctor = await this.doctorService.getDoctorById(data.doctorId);
			const doctorName = doctor ? doctor.name : 'Médico não encontrado';

			const result = await this.scheduleService.confirmAppointment(data.scheduleId, {
				patient_name: data.patientName,
				patient_phone: data.patientPhone
			});

			return {
				fulfillmentText: `🎉 Agendamento confirmado com sucesso!\n\n📋 Detalhes:\n• ID do agendamento: ${result.id}\n• Data: ${moment(result.date).format('DD/MM/YYYY')}\n• Horário: ${moment(result.time, 'HH:mm:ss').format('HH:mm')}\n• Médico: ${doctorName}\n• Paciente: ${result.patient_name}\n• Telefone: ${result.patient_phone}\n\nObrigado por usar nosso sistema! 🙏`
			};
		} catch (error) {
			console.error('Erro ao confirmar agendamento:', error);
			return { fulfillmentText: 'Erro ao confirmar o agendamento. Tente novamente mais tarde.' };
		}
	}

	async handleBookAppointment(parameters) {
		const { schedule_id, patient_name, patient_phone } = parameters

		if (!schedule_id || !patient_name) {
			return { fulfillmentText: 'Informe o horário e o nome do paciente.' }
		}

		try {
			const result = await this.scheduleService.confirmAppointment(schedule_id, {
				patient_name,
				patient_phone
			})

			return { fulfillmentText: `Agendamento confirmado. ID: ${result.id} Data: ${result.date} Hora: ${result.time}` }
		} catch (error) {
			console.error('Erro ao confirmar agendamento:', error);
			return { fulfillmentText: 'Erro ao confirmar o agendamento.' }
		}
	}

	async handleCancelAppointment(parameters) {
		const appointmentId = parameters?.appointment_id

		if (!appointmentId) {
			return { fulfillmentText: 'Informe o ID do agendamento.' }
		}

		try {
			await this.scheduleService.cancelSchedule(appointmentId)
			return { fulfillmentText: 'Agendamento cancelado com sucesso.' }
		} catch (error) {
			console.error('Erro ao cancelar agendamento:', error);
			return { fulfillmentText: 'Erro ao cancelar o agendamento.' }
		}
	}
}

export default WebhookService
