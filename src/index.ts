import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import analyzeRouter from './routes/analyze';

dotenv.config({ path: '.env.local' });

const app = express();
const port = process.env.PORT || 8321;

app.use(cors());
app.use(express.json());

app.get('/health', (req: Request, res: Response) => {
  res.json({ status: 'ok', service: 'forge-backend' });
});

app.use('/analyze', analyzeRouter);

app.listen(port, () => {
  console.log(`Forge backend running on port ${port}`);
});
