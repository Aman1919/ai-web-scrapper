import express from 'express';
import cors from 'cors';
import { scrapeRouter } from './routes/scrape.js';

const app = express();

app.use(cors());
app.use(express.json());
app.use('/api', scrapeRouter);

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));