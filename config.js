module.exports = {
    server: {
        port: process.env.PORT || 3000,
        environment: process.env.NODE_ENV || 'development'
    },

    dialogflow: {
        projectId: process.env.DIALOGFLOW_PROJECT_ID || 'your-project-id',
        privateKey: process.env.DIALOGFLOW_PRIVATE_KEY || '',
        clientEmail: process.env.DIALOGFLOW_CLIENT_EMAIL || ''
    },

    logging: {
        level: process.env.LOG_LEVEL || 'info'
    },

    security: {
        webhookSecret: process.env.WEBHOOK_SECRET || ''
    },

    externalApis: {
        baseUrl: process.env.EXTERNAL_API_URL || 'https://api.exemplo.com',
        apiKey: process.env.EXTERNAL_API_KEY || ''
    }
};