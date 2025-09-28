import express from 'express';
import sequelize from './config/db.js';
import { WebhookRoutes, DoctorRoutes, ScheduleRoutes } from './routes/index.js';
import cors from 'cors';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());
app.use(cors({
    origin: ['https://your-domain.com', 'http://localhost:3000'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true
}));

app.use((req, res, next) => {
    console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
    next();
});

app.get('/health', (req, res) => {
    res.status(200).json({
        success: true,
        status: 'OK',
        timestamp: new Date().toISOString(),
        service: 'Dialogflow Webhook - Medical Appointments'
    });
});

const webhookRoute = new WebhookRoutes();
const doctorRoute = new DoctorRoutes();
const scheduleRoute = new ScheduleRoutes();

app.use('/webhook', webhookRoute.setup());
app.use('/doctors', doctorRoute.setup());
app.use('/schedules', scheduleRoute.setup());

sequelize.authenticate()
.then(() => {
    console.log('Banco de dados conectado com sucesso!');
    return sequelize.sync();
})
.then(() => {
    console.log('Modelos sincronizados com o banco de dados');
})
.catch((err) => {
    console.error('Erro ao conectar ao banco de dados:', err);
});

app.listen(port, () => {
    console.log(`Servidor rodando na porta ${port}`);
    console.log(`Webhook disponível em: http://localhost:${port}/webhook`);
    console.log(`Médicos disponíveis: http://localhost:${port}/doctors/available`);
    console.log(`Horários disponíveis: http://localhost:${port}/schedules/available`);
    console.log(`Health check: http://localhost:${port}/health`);
});
