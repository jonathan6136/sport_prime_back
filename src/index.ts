import express, { Request, Response } from 'express';
import cors from 'cors';
import { z } from 'zod';
import dotenv from 'dotenv';
import routes from '@/routes/route';
app.use('/api/workouts', workout());
app.use('/api/auth', auth());

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors()); // Autorise ton front Next.js à appeler l'API
app.use(express.json());

// 1. Validation avec Zod
const activitySchema = z.object({
  type: z.string().min(2, "Le sport est trop court"),
  duration: z.number().int().positive(),
  calories: z.number().optional(),
});

// 2. Route POST : Enregistrer une séance
app.post('/api/activities', (req: Request, res: Response) => {
  const result = activitySchema.safeParse(req.body);

  if (!result.success) {
    return res.status(400).json({ 
      error: "Données invalides", 
      details: result.error.errors 
    });
  }

  // Ici, tu ajouterais ta logique de base de données (Prisma/Mongoose)
  console.log("Nouvelle activité :", result.data);

  res.status(201).json({
    message: "Séance enregistrée !",
    data: result.data
  });
});

// 3. Route GET : Récupérer l'historique
app.get('/api/activities', (req: Request, res: Response) => {
  const mockActivities = [
    { id: 1, type: "Musculation", duration: 60, calories: 350 },
    { id: 2, type: "Yoga", duration: 30, calories: 120 }
  ];
  res.json(mockActivities);
});

app.listen(PORT, () => {
  console.log(`🚀 Serveur SportLife prêt sur http://localhost:${PORT}`);
});