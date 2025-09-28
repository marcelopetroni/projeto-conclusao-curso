import axios from 'axios';

const WEBHOOK_URL = 'http://localhost:3000/webhook';

const testCases = [
    {
        name: 'Saudação',
        data: {
            queryResult: {
                intent: {
                    displayName: 'Default Welcome Intent'
                },
                parameters: {
                    name: 'João'
                },
                fulfillmentText: 'Olá!'
            },
            session: 'projects/test-project/agent/sessions/123456'
        }
    },
    {
        name: 'Buscar médicos disponíveis',
        data: {
            queryResult: {
                intent: {
                    displayName: 'Get Available Doctors'
                },
                parameters: {
                    date: '2024-01-15'
                },
                fulfillmentText: 'Quero ver médicos disponíveis'
            },
            session: 'projects/test-project/agent/sessions/123456'
        }
    },
    {
        name: 'Ver horários de médico',
        data: {
            queryResult: {
                intent: {
                    displayName: 'Get Doctor Schedules'
                },
                parameters: {
                    doctor_name: 'Dr. João Silva',
                    date: '2024-01-15'
                },
                fulfillmentText: 'Quero ver horários do Dr. João Silva'
            },
            session: 'projects/test-project/agent/sessions/123456'
        }
    },
    {
        name: 'Agendar consulta',
        data: {
            queryResult: {
                intent: {
                    displayName: 'Book Appointment'
                },
                parameters: {
                    doctor_name: 'Dr. João Silva',
                    date: '2024-01-15',
                    time: '09:00',
                    patient_name: 'Maria Santos',
                    patient_phone: '11999999999'
                },
                fulfillmentText: 'Quero agendar com Dr. João Silva'
            },
            session: 'projects/test-project/agent/sessions/123456'
        }
    },
    {
        name: 'Cancelar agendamento',
        data: {
            queryResult: {
                intent: {
                    displayName: 'Cancel Appointment'
                },
                parameters: {
                    appointment_id: '1'
                },
                fulfillmentText: 'Quero cancelar meu agendamento'
            },
            session: 'projects/test-project/agent/sessions/123456'
        }
    },
    {
        name: 'Intent não reconhecido',
        data: {
            queryResult: {
                intent: {
                    displayName: 'Unknown Intent'
                },
                parameters: {},
                fulfillmentText: 'Algo que não entendo'
            },
            session: 'projects/test-project/agent/sessions/123456'
        }
    }
];

async function testWebhook() {
    console.log('Iniciando testes do webhook...\n');

    for (const testCase of testCases) {
        try {
            console.log(`Testando: ${testCase.name}`);
            console.log(`Enviando:`, JSON.stringify(testCase.data, null, 2));
            
            const response = await axios.post(WEBHOOK_URL, testCase.data, {
                headers: {
                    'Content-Type': 'application/json'
                },
                timeout: 5000
            });

            console.log(`Resposta recebida:`, JSON.stringify(response.data, null, 2));
            console.log('─'.repeat(80));
            
        } catch (error) {
            console.error(`Erro no teste "${testCase.name}":`, error.message);
            if (error.response) {
                console.error('Resposta do servidor:', error.response.data);
            }
            console.log('─'.repeat(80));
        }
    }

    console.log('\nTestes concluídos!');
}

async function testHealthCheck() {
    try {
        console.log('Testando health check...');
        const response = await axios.get('http://localhost:3000/health');
        console.log('Health check OK:', response.data);
    } catch (error) {
        console.error('Health check falhou:', error.message);
    }
}

async function testDoctorsEndpoint() {
    try {
        console.log('Testando endpoint de médicos...');
        const response = await axios.get('http://localhost:3000/doctors/available?date=2024-01-15');
        console.log('Médicos disponíveis:', response.data);
    } catch (error) {
        console.error('Erro ao buscar médicos:', error.message);
    }
}

async function testSchedulesEndpoint() {
    try {
        console.log('Testando endpoint de horários...');
        const response = await axios.get('http://localhost:3000/schedules/available?doctor_id=1&date=2024-01-15');
        console.log('Horários disponíveis:', response.data);
    } catch (error) {
        console.error('Erro ao buscar horários:', error.message);
    }
}

async function runTests() {
    await testHealthCheck();
    console.log('\n');
    await testDoctorsEndpoint();
    console.log('\n');
    await testSchedulesEndpoint();
    console.log('\n');
    await testWebhook();
}

runTests().catch(error => {
    console.error('Erro ao executar testes:', error.message);
    console.log('\nCertifique-se de que o servidor está rodando:');
    console.log('   npm start');
    console.log('   ou');
    console.log('   npm run dev');
});