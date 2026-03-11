import React from 'react';
import {
  ChakraProvider,
  extendTheme,
  ThemeConfig,
  ColorModeProvider,
  useColorMode,
  Button,
  useColorModeValue,
} from '@chakra-ui/react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { AuthPage, DashboardPage } from './pages';
import { useAuthStore } from './store';

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

// Custom theme configuration
const config: ThemeConfig = {
  initialColorMode: 'light',
  useSystemColorMode: false,
};

const theme = extendTheme({
  config,
  colors: {
    brand: {
      50: '#f0f9ff',
      100: '#e0f2fe',
      200: '#bae6fd',
      300: '#7dd3fc',
      400: '#38bdf8',
      500: '#0ea5e9',
      600: '#0284c7',
      700: '#0369a1',
      800: '#075985',
      900: '#0c4a6e',
    },
    primary: {
      50: '#ebf8ff',
      100: '#bee3f8',
      200: '#90cdf4',
      300: '#63b3ed',
      400: '#4299e1',
      500: '#3182ce',
      600: '#2c5282',
      700: '#2a4e7c',
      800: '#2c5282',
      900: '#2a4e7c',
    },
  },
  fonts: {
    heading: 'Inter, system-ui, sans-serif',
    body: 'Inter, system-ui, sans-serif',
  },
  components: {
    Button: {
      defaultProps: {
        colorScheme: 'primary',
      },
    },
    Card: {
      baseStyle: {
        container: {
          boxShadow: 'md',
          borderRadius: 'lg',
        },
      },
    },
  },
});

// Color mode toggle component
const ColorModeToggle = () => {
  const { colorMode, toggleColorMode } = useColorMode();
  const bg = useColorModeValue('gray.100', 'gray.700');

  return (
    <Button
      onClick={toggleColorMode}
      bg={bg}
      position="fixed"
      top="4"
      right="4"
      zIndex="tooltip"
      size="sm"
    >
      {colorMode === 'light' ? '🌙' : '☀️'}
    </Button>
  );
};

// Protected route component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated } = useAuthStore();
  
  return isAuthenticated ? <>{children}</> : <Navigate to="/auth" replace />;
};

// Main App component
function App() {
  return (
    <ChakraProvider theme={theme}>
      <ColorModeProvider>
        <QueryClientProvider client={queryClient}>
          <Router>
            <ColorModeToggle />
            <Routes>
              <Route path="/auth" element={<AuthPage />} />
              <Route
                path="/dashboard"
                element={
                  <ProtectedRoute>
                    <DashboardPage />
                  </ProtectedRoute>
                }
              />
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </Router>
        </QueryClientProvider>
      </ColorModeProvider>
    </ChakraProvider>
  );
}

export default App;
