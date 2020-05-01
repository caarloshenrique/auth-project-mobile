import React, {createContext, useState, useEffect, useContext} from 'react';
import AsyncStorage from '@react-native-community/async-storage';
import api from '../services/api';
import * as auth from '../services/auth';

interface User {
  name: String;
  email: String;
}

interface AuthContextData {
  signed: boolean;
  user: User | null;
  loading: boolean;
  signIn(): Promise<void>;
  signOut(): void;
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData);

export const AuthProvider: React.FC = ({children}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStoragedData() {
      const storagedUser = await AsyncStorage.getItem('@AuthProject:user');
      const storagedToken = await AsyncStorage.getItem('@AuthProject:token');

      if (storagedUser && storagedToken) {
        api.defaults.headers.Authorization = `Bearer ${storagedToken}`;

        setUser(JSON.parse(storagedUser));
        setLoading(false);
      }
    }

    loadStoragedData();
  }, []);

  async function signIn() {
    const response = await auth.signIn();

    setUser(response.user);

    api.defaults.headers.Authorization = `Bearer ${response.token}`;

    await AsyncStorage.setItem(
      '@AuthProject:user',
      JSON.stringify(response.user),
    );
    await AsyncStorage.setItem('@AuthProject:token', response.token);
  }

  function signOut() {
    AsyncStorage.clear().then(() => {
      setUser(null);
    });
  }

  return (
    <AuthContext.Provider
      value={{signed: !!user, user, loading, signIn, signOut}}>
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);
  return context;
}
