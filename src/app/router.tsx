import { createBrowserRouter } from 'react-router-dom';
import { AppShell } from '../components/layout/AppShell';
import { AdminPage } from '../pages/AdminPage';
import { AstroPage } from '../pages/AstroPage';
import { BioAstroPage } from '../pages/BioAstroPage';
import { BioPage } from '../pages/BioPage';
import { DNATranslatorPage } from '../pages/DNATranslatorPage';
import { HomePage } from '../pages/HomePage';
import { HabitabilityPage } from '../pages/HabitabilityPage';
import { PlaceholderPage } from '../pages/PlaceholderPage';
import { RandomBoxPage } from '../pages/RandomBoxPage';
import { QuizPage } from '../pages/QuizPage';
import { toolEntries } from '../data/toolEntries';

const toolRoutes = toolEntries.map((tool) => ({ path: tool.path, element: <PlaceholderPage /> }));

export const router = createBrowserRouter([
  {
    path: '/',
    element: (
      <AppShell>
        <HomePage />
      </AppShell>
    ),
  },
  { path: '/bio', element: <AppShell><BioPage /></AppShell> },
  { path: '/astro', element: <AppShell><AstroPage /></AppShell> },
  { path: '/bio/random-facts', element: <AppShell><RandomBoxPage /></AppShell> },
  { path: '/astro/random-facts', element: <AppShell><RandomBoxPage /></AppShell> },
  { path: '/bioastro', element: <AppShell><BioAstroPage /></AppShell> },
  { path: '/bioastro/habitability', element: <AppShell><HabitabilityPage /></AppShell> },
  { path: '/bio/organelle-quiz', element: <AppShell><QuizPage /></AppShell> },
  { path: '/bio/dna-translator', element: <AppShell><DNATranslatorPage /></AppShell> },
  { path: '/astro/planet-quiz', element: <AppShell><QuizPage /></AppShell> },
  { path: '/admin', element: <AppShell><AdminPage /></AppShell> },
  ...toolRoutes.map((route) => ({ path: route.path, element: <AppShell>{route.element}</AppShell> })),
]);
