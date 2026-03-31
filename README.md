# Ad Creative Generator

Application web locale pour générer des créas publicitaires statiques à partir d'une image produit, via l'API Google Gemini.

## Installation

```bash
npm install
```

## Configuration

Créez un fichier `.env.local` à la racine du projet :

```
GOOGLE_AI_API_KEY=votre_clé_api_google_ai_studio
```

Pour obtenir une clé : https://aistudio.google.com/apikey

## Lancement

```bash
npm run dev
```

Ouvrir http://localhost:3000

## Utilisation

1. Importez une image produit (drag & drop ou clic)
2. Réglez les paramètres (nombre de créas, format, style, instructions)
3. Cliquez sur "Générer les créas"
4. Prévisualisez, téléchargez ou regénérez

## Stack

- Next.js 15 + App Router + TypeScript
- Tailwind CSS v4
- Google Generative AI SDK (`gemini-2.0-flash-exp`)

## Limites connues

- **1 image par appel API** : Gemini `2.0-flash-exp` génère 1 image par requête. L'app boucle séquentiellement pour N variantes, ce qui prend ~5-15s par créa.
- **Ratios via prompt** : Le modèle ne supporte pas de paramètre `aspectRatio` natif. Le ratio est demandé dans le prompt textuel — le résultat peut varier.
- **Negative prompt dans le texte** : Pas de champ `negativePrompt` natif dans l'API. Il est intégré dans le prompt sous forme d'instruction "AVOID".
- **Rate limiting** : L'API gratuite peut limiter le nombre de requêtes. Un délai de 1s est ajouté entre chaque appel.
- **Qualité variable** : Les résultats dépendent du modèle Gemini et peuvent varier en qualité et en fidélité au produit.
- **Taille max image** : 20 MB en entrée.
- **Pas de persistance** : L'historique est en mémoire de session uniquement (perdu au rechargement).
