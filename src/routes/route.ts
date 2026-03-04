import { Router } from 'express';
import { protect, AuthRequest } from '@/src/middleware"';

const router = Router();

// Cette route est maintenant protégée !
router.get('/', protect, (req: AuthRequest, res) => {
  // Grâce au middleware, on sait quel utilisateur demande ses séances
  const userId = req.user?.id;
  
  res.json({ 
    message: `Voici les séances de sport de l'utilisateur ${userId}` 
  });
});

// Simulation de contrôleurs
router.get('/', (req, res) => res.json({ message: "Liste des séances" }));
router.post('/', (req, res) => res.json({ message: "Séance ajoutée" }));
router.delete('/:id', (req, res) => res.json({ message: `Séance ${req.params.id} supprimée` }));


export default router;