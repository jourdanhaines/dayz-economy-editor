import { ChakraProvider } from '@chakra-ui/react';
import { Route, MemoryRouter as Router, Routes } from 'react-router-dom';
import theme from 'src/theme';
import MainLayout from './layouts/MainLayout';
import Home from './pages/Home';

export default function App() {
    return (
        <ChakraProvider theme={theme}>
            <Router>
                <Routes>
                    <Route
                        path="/"
                        element={
                            <MainLayout>
                                <Home />
                            </MainLayout>
                        }
                    />
                </Routes>
            </Router>
        </ChakraProvider>
    );
}
