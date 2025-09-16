async function handleWelcome(parameters, session) {
    const name = parameters?.name || 'usuário';

    return {
        text: `Olá ${name}! Como posso ajudá-lo hoje?`,
        messages: [
            {
                text: {
                    text: [`Olá ${name}! Como posso ajudá-lo hoje?`]
                }
            }
        ]
    };
}

async function handleProductInfo(parameters, session) {
    const product = parameters?.product || 'produto';

    const productInfo = {
        'smartphone': 'Nosso smartphone mais recente possui tela de 6.1", câmera de 48MP e bateria de 4000mAh.',
        'laptop': 'Laptop com processador Intel i7, 16GB RAM, SSD 512GB e tela Full HD de 15.6".',
        'tablet': 'Tablet com tela de 10.1", 64GB de armazenamento e bateria de 8 horas de duração.'
    };

    const info = productInfo[product.toLowerCase()] || `Informações sobre ${product} não disponíveis no momento.`;

    return {
        text: info,
        messages: [
            {
                text: {
                    text: [info]
                }
            }
        ]
    };
}

async function handlePriceQuery(parameters, session) {
    const product = parameters?.product || 'produto';
    
    const prices = {
        'smartphone': 'R$ 1.299,00',
        'laptop': 'R$ 2.499,00',
        'tablet': 'R$ 899,00'
    };

    const price = prices[product.toLowerCase()] || 'Preço não disponível';

    return {
        text: `O preço do ${product} é ${price}. Gostaria de saber mais informações?`,
        messages: [
            {
                text: {
                    text: [`O preço do ${product} é ${price}. Gostaria de saber mais informações?`]
                }
            }
        ]
    };
}

async function handleTechnicalSupport(parameters, session) {
    const issue = parameters?.issue || 'problema';
    
    return {
        text: `Entendo que você está enfrentando problemas com: ${issue}. Nossa equipe de suporte entrará em contato em breve.`,
        messages: [
            {
                text: {
                    text: [`Entendo que você está enfrentando problemas com: ${issue}. Nossa equipe de suporte entrará em contato em breve.`]
                }
            }
        ],
        payload: {
            action: 'create_support_ticket',
            issue: issue,
            session: session
        }
    };
}

async function handleScheduleAppointment(parameters, session) {
    const date = parameters?.date || 'data não especificada';
    const time = parameters?.time || 'horário não especificado';
    
    return {
        text: `Perfeito! Agendei um compromisso para ${date} às ${time}. Você receberá uma confirmação por email.`,
        messages: [
            {
                text: {
                    text: [`Perfeito! Agendei um compromisso para ${date} às ${time}. Você receberá uma confirmação por email.`]
                }
            }
        ],
        payload: {
            action: 'schedule_appointment',
            date: date,
            time: time,
            session: session
        }
    };
}

async function handleDefaultFallback(parameters, session) {
    return {
        text: 'Desculpe, não entendi sua solicitação. Pode reformular a pergunta? Posso ajudá-lo com informações sobre produtos, preços, suporte técnico ou agendamentos.',
        messages: [
            {
                text: {
                    text: ['Desculpe, não entendi sua solicitação. Pode reformular a pergunta? Posso ajudá-lo com informações sobre produtos, preços, suporte técnico ou agendamentos.']
                }
            }
        ]
    };
}

module.exports = {
    'Default Welcome Intent': handleWelcome,
    'Product Information': handleProductInfo,
    'Price Query': handlePriceQuery,
    'Technical Support': handleTechnicalSupport,
    'Schedule Appointment': handleScheduleAppointment,
    'Default Fallback Intent': handleDefaultFallback
};