const express = require('express');
const cors = require('cors');
const { PrismaClient } = require('@prisma/client');

const app = express();
const prisma = new PrismaClient();

app.use(cors());
app.use(express.json());

app.get('/users', async (req, res) => {
  const users = await prisma.user.findMany();
  res.json(users);
});

app.get('/workouts', authenticateToken, async (req, res) => {
  const workouts = await prisma.workout.findMany({
    where: { userId: req.user.userId } // req.user.userId vient de ton middleware JWT
  });
  res.json(workouts);
});

app.post('/workouts', authenticateToken, async (req, res) => {
  const { title, description } = req.body;
  
  try {
    const newWorkout = await prisma.workout.create({
      data: {
        id  ,   
        title, 
        date ,
        exercises , 
        userId: req.user.userId // Identifiant extrait du token par le middleware
      }
    });
    res.status(201).json(newWorkout);
  } catch (e) {
    res.status(400).json({ error: "Impossible de créer une séance" });
  }
});

app.listen(3000, () => console.log("Serveur sur le port 3000"));