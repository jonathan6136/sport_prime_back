import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

// On définit une interface pour étendre le type Request d'Express
// Cela permet d'ajouter la propriété 'user' à req
export interface AuthRequest extends Request {
  user?: { id: string };
}

export const protect = (req: AuthRequest, res: Response, next: NextFunction) => {
  let token;

  // 1. Vérifier si le token est présent dans le header Authorization
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      // Le format est "Bearer <token>", on récupère juste le token
      token = req.headers.authorization.split(' ')[1];

      // 2. Vérifier et décoder le token
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secret_par_defaut') as { id: string };

      // 3. Ajouter l'ID de l'utilisateur à la requête
      req.user = { id: decoded.id };

      // On passe au contrôleur suivant
      next();
    } catch (error) {
      return res.status(401).json({ message: "Non autorisé, token invalide" });
    }
  }

  if (!token) {
    return res.status(401).json({ message: "Non autorisé, aucun token fourni" });
  }
};