import { DataTypes } from 'sequelize';
import { sequelize } from './db.js';

const User = sequelize.define('User', {
    email: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false,
    },
    role: {
        type: DataTypes.ENUM('ROLE_USER', 'ROLE_ADMIN'),
        allowNull: false,
        defaultValue: 'ROLE_USER',
    },
});

const Shortlet = sequelize.define('Shortlet', {
    apartmentName: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    state: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    numberOfRooms: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    address: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    amountPerNight: {
        type: DataTypes.FLOAT,
        allowNull: false,
    },
    numberOfNights: {
        type: DataTypes.INTEGER,
        allowNull: false,
    },
    imageUrls: {
        type: DataTypes.ARRAY(DataTypes.STRING), // Use JSON or a custom getter/setter if ARRAY is not supported
        allowNull: false,
    },
});

sequelize.sync();

export { User, Shortlet };
