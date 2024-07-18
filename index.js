import express from 'express';
import passport from 'passport';
import dotenv from 'dotenv';
import authRoutes from './routes/authRoutes.js';
import shortletRoutes from './routes/shortletRoutes.js';
import { sequelize } from './database/db.js';

dotenv.config();

const app = express();
app.use(express.json());
app.use(passport.initialize());

// Routes
app.use('/auth', authRoutes);
app.use('/shortlets', shortletRoutes);

// Initialize database and start server
const init = async () => {
    await sequelize.sync({ force: true });
    app.listen(process.env.PORT, () => {
        console.log(`Server is running on port ${process.env.PORT}`);
    });
};

init();
