import express from 'express';
import sequelize  from './config/database.js';
import cors from 'cors';
const PORT = process.env.PORT || 3003;
import checker from './config/databasecomfirm.js';
import authRoutes from './routes/authrouter.js'
import postRoutes from './routes/postrouter.js';
import userRoutes from './routes/userrouter.js';
import publicRoutes from './routes/publicroute.js';
import adminRoutes from './routes/adminrouter.js';
import path from 'path';
import { fileURLToPath } from 'url';
const app = express();
app.use(cors());
app.use(express.json());

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Serve static files from uploads directory
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.use('/api/auth', authRoutes);      // Authentication endpoints
app.use('/api/posts', postRoutes);     // Post management endpoints
app.use('/api/users', userRoutes);     // User profile endpoints
app.use('/api/admin', adminRoutes);
app.use('/api', publicRoutes);

app.get('/api/check-db', async (req, res) => {
    try{
        await sequelize.authenticate();
        res.json({message: "database is connected",
            sucess: true
        })
    } catch(error){
        res.json({sucess: false,
            message:"database failed o connect"
        })
    }
});
app.get('/', (req, res) => {
    res.json({message:"server is running"})
});


app.listen(PORT, () =>{

    console.log(`Server Is Running On Port http://localhost:${PORT}`);
    checker();
    
  
});