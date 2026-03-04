import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
// Use require for PrismaClient runtime import to avoid TypeScript export mismatch

import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "./generated/prisma/client";
dotenv.config();
const connectionString = `${process.env.DATABASE_URL}`;
const adapter = new PrismaPg({ connectionString });
const prisma = new PrismaClient({ adapter });


const app = express();
const corsOptions = {
  origin: process.env.BASE_URL_FRONT, // Autorise uniquement http://localhost:3000
  optionsSuccessStatus: 200
};
interface RequestWithUser extends Request {
  user?: { userId: number };
}

app.use(cors(corsOptions));
app.get('/api/data', (req, res) => {
  res.json({ message: "Succès ! Seul le port 3000 peut voir ceci." });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`API lancée sur : ${process.env.BASE_URL_API}`);
  console.log(`Accès autorisé pour : ${process.env.BASE_URL_FRONT}`);
});
app.use(express.json());

function authenticateToken(req: RequestWithUser, res: Response, next: NextFunction) {
  // Development placeholder: attach a default userId.
  // Replace with real JWT verification in production.
  req.user = { userId: 1 };
  next();
}

app.get('/users', async (req: Request, res: Response) => {
  try {
    const users = await prisma.user.findMany();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err });
  }
});

app.get('/workouts', authenticateToken, async (req: RequestWithUser, res: Response) => {
  try {
    const userId = req.user?.userId;
    if (!userId) return res.status(401).json({ error: 'Unauthorized' });
    const workouts = await prisma.workout.findMany({ where: { userId } });
    res.json(workouts);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch workouts' });
  }
});

app.post('/workouts', authenticateToken, async (req: RequestWithUser, res: Response) => {
  const { title, date, exercises } = req.body;
  const userId = req.user?.userId;
  if (!userId) return res.status(401).json({ error: 'Unauthorized' });
  if (!title) return res.status(400).json({ error: 'Title is required' });

  try {
    const data: any = {
      title,
      userId,
      exercises: exercises ?? []
    };
    if (date) data.date = new Date(date);

    const newWorkout = await prisma.workout.create({ data });
    res.status(201).json(newWorkout);
  } catch (e) {
    res.status(400).json({ error: 'Impossible de créer une séance' });
  }
});

app.listen(3001, () => console.log('Serveur sur le port 3001'));