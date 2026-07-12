import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

type AuthUser = {
  id: number;
  nome: string;
  email: string;
  telefone?: string | null;
  role: string;
};

type AuthState = {
  token: string;
  user: AuthUser;
};

type AuthResponse = {
  token?: string;
  user?: AuthUser;
  error?: string;
  message?: string;
};

type AuthContextValue = {
  auth: AuthState | null;
  login: (email: string, password: string) => Promise<void>;
  register: (data: { nome: string; email: string; password: string; telefone?: string }) => Promise<void>;
  logout: () => void;
  loading: boolean;
};

const AUTH_STORAGE_KEY = 'site-estetica-auth';

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [auth, setAuth] = useState<AuthState | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const storedAuth = localStorage.getItem(AUTH_STORAGE_KEY);

    if (storedAuth) {
      setAuth(JSON.parse(storedAuth) as AuthState);
    }
  }, []);

  const persistAuth = (nextAuth: AuthState | null) => {
    setAuth(nextAuth);

    if (nextAuth) {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(nextAuth));
      return;
    }

    localStorage.removeItem(AUTH_STORAGE_KEY);
  };

  const requestAuth = async (endpoint: string, payload: Record<string, unknown>) => {
    setLoading(true);

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      const data = (await response.json()) as AuthResponse;

      if (!response.ok) {
        throw new Error(data.error ?? data.message ?? 'Falha na autenticação');
      }

      if (!data.token || !data.user) {
        throw new Error('Resposta inválida do servidor');
      }

      persistAuth({ token: data.token, user: data.user });
    } finally {
      setLoading(false);
    }
  };

  const value = useMemo<AuthContextValue>(
    () => ({
      auth,
      loading,
      login: async (email, password) => {
        await requestAuth('/api/auth/login', { email, password });
      },
      register: async ({ nome, email, password, telefone }) => {
        await requestAuth('/api/auth/registar', { nome, email, password, telefone: telefone || undefined });
      },
      logout: () => persistAuth(null),
    }),
    [auth, loading]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error('useAuth deve ser usado dentro de AuthProvider');
  }

  return context;
}