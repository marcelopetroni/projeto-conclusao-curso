const axios = require('axios');

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
        name: 'Informações sobre produto',
        data: {
            queryResult: {
                intent: {
                    displayName: 'Product Information'
                },
                parameters: {
                    product: 'smartphone'
                },
                fulfillmentText: 'Quero saber sobre smartphones'
            },
            session: 'projects/test-project/agent/sessions/123456'
        }
    },
    {
        name: 'Consulta de preço',
        data: {
            queryResult: {
                intent: {
                    displayName: 'Price Query'
                },
                parameters: {
                    product: 'laptop'
                },
                fulfillmentText: 'Qual o preço do laptop?'
            },
            session: 'projects/test-project/agent/sessions/123456'
        }
    },
    {
        name: 'Suporte técnico',
        data: {
            queryResult: {
                intent: {
                    displayName: 'Technical Support'
                },
                parameters: {
                    issue: 'problema com a tela'
                },
                fulfillmentText: 'Preciso de ajuda com problema na tela'
            },
            session: 'projects/test-project/agent/sessions/123456'
        }
    },
    {
        name: 'Agendamento',
        data: {
            queryResult: {
                intent: {
                    displayName: 'Schedule Appointment'
                },
                parameters: {
                    date: '2024-01-15',
                    time: '14:30'
                },
                fulfillmentText: 'Quero agendar para 15 de janeiro às 14:30'
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

async function runTests() {
    await testHealthCheck();
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