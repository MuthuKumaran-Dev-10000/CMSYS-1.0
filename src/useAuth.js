import { useContext } from 'react';
import { AuthContext } from './AuthContext'; // Ensure the path is correct

export const useAuth = () => useContext(AuthContext);
