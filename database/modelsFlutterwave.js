import { DataTypes } from 'sequelize';
import { sequelize } from './db.js';

const Payment = sequelize.define('Payment', {
    txRef: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
    amount: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    currency: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    status: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    shortletId: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    paymentLink: {
        type: DataTypes.STRING,
        allowNull: true,
    },
});

sequelize.sync();

export { Payment };
