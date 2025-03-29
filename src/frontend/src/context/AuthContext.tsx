import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

// 認証コンテキストの型定義
interface AuthContextType {
  user: User | null;
  loading: boolean;
  error: string | null;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  updateUser: (userData: Partial<User>) => Promise<void>;
}

// ユーザー型定義
interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

// デフォルト値
const defaultAuthContext: AuthContextType = {
  user: null,
  loading: false,
  error: null,
  login: async () => {},
  register: async () => {},
  logout: () => {},
  updateUser: async () => {},
};

// コンテキスト作成
const AuthContext = createContext<AuthContextType>(defaultAuthContext);

// コンテキストプロバイダー
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  // 初期化時にローカルストレージからユーザー情報を取得
  useEffect(() => {
    const initAuth = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          // トークンがある場合、ユーザー情報を取得
          const response = await fetch('/api/auth/me', {
            headers: {
              'Authorization': `Bearer ${token}`
            }
          });
          
          if (response.ok) {
            const userData = await response.json();
            setUser(userData);
          } else {
            // トークンが無効な場合はログアウト
            localStorage.removeItem('token');
          }
        }
      } catch (err) {
        console.error('認証初期化エラー:', err);
      } finally {
        setLoading(false);
      }
    };

    initAuth();
  }, []);

  // ログイン関数
  const login = async (email: string, password: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/auth/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'ログインに失敗しました');
      }
      
      // トークンをローカルストレージに保存
      localStorage.setItem('token', data.token);
      
      // ユーザー情報を設定
      setUser(data.user);
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // 登録関数
  const register = async (name: string, email: string, password: string) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/auth/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ name, email, password })
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || '登録に失敗しました');
      }
      
      // 登録後に自動ログイン
      await login(email, password);
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  // ログアウト関数
  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  // ユーザー情報更新関数
  const updateUser = async (userData: Partial<User>) => {
    setLoading(true);
    setError(null);
    
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('認証されていません');
      }
      
      const response = await fetch('/api/auth/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(userData)
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'ユーザー情報の更新に失敗しました');
      }
      
      // ユーザー情報を更新
      setUser(prev => prev ? { ...prev, ...data.user } : null);
    } catch (err: any) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const value = {
    user,
    loading,
    error,
    login,
    register,
    logout,
    updateUser
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

// カスタムフック
export const useAuth = () => useContext(AuthContext);
