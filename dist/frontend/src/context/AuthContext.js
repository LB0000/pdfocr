"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useAuth = void 0;
exports.AuthProvider = AuthProvider;
const react_1 = require("react");
// デフォルト値
const defaultAuthContext = {
    user: null,
    loading: false,
    error: null,
    login: async () => { },
    register: async () => { },
    logout: () => { },
    updateUser: async () => { },
};
// コンテキスト作成
const AuthContext = (0, react_1.createContext)(defaultAuthContext);
// コンテキストプロバイダー
function AuthProvider({ children }) {
    const [user, setUser] = (0, react_1.useState)(null);
    const [loading, setLoading] = (0, react_1.useState)(true);
    const [error, setError] = (0, react_1.useState)(null);
    // 初期化時にローカルストレージからユーザー情報を取得
    (0, react_1.useEffect)(() => {
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
                    }
                    else {
                        // トークンが無効な場合はログアウト
                        localStorage.removeItem('token');
                    }
                }
            }
            catch (err) {
                console.error('認証初期化エラー:', err);
            }
            finally {
                setLoading(false);
            }
        };
        initAuth();
    }, []);
    // ログイン関数
    const login = async (email, password) => {
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
        }
        catch (err) {
            setError(err.message);
            throw err;
        }
        finally {
            setLoading(false);
        }
    };
    // 登録関数
    const register = async (name, email, password) => {
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
        }
        catch (err) {
            setError(err.message);
            throw err;
        }
        finally {
            setLoading(false);
        }
    };
    // ログアウト関数
    const logout = () => {
        localStorage.removeItem('token');
        setUser(null);
    };
    // ユーザー情報更新関数
    const updateUser = async (userData) => {
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
        }
        catch (err) {
            setError(err.message);
            throw err;
        }
        finally {
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
const useAuth = () => (0, react_1.useContext)(AuthContext);
exports.useAuth = useAuth;
//# sourceMappingURL=AuthContext.js.map