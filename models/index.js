import sequelize from '../config/db.js';
import Doctor from './Doctor.js';
import Schedule from './Schedule.js';

Doctor.hasMany(Schedule, { foreignKey: 'doctor_id', as: 'schedules' });
Schedule.belongsTo(Doctor, { foreignKey: 'doctor_id', as: 'doctor' });

const db = {
    sequelize,
    Doctor,
    Schedule
};

export default db;
