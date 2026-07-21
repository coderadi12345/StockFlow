import { BrowserRouter } from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import { ThemeProvider } from './contexts/ThemeContext';
import ToastWrapper from './components/ui/ToastWrapper';
import AppRoutes from './routes/AppRoutes';

function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
        <BrowserRouter>
          <AppRoutes />
          <ToastWrapper />
        </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;
