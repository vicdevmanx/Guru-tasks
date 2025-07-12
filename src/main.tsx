import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { ThemeProvider } from './hooks/useTheme.tsx';
import { Toaster } from 'sonner';

createRoot(document.getElementById("root")!).render(<ThemeProvider><Toaster position='top-center'/><App /></ThemeProvider>);
