"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useTemplates = void 0;
exports.TemplateProvider = TemplateProvider;
const react_1 = require("react");
// デフォルト値
const defaultTemplateContext = {
    templates: [],
    loading: false,
    error: null,
    fetchTemplates: async () => { },
    getTemplate: async () => ({}),
    createTemplate: async () => { },
    updateTemplate: async () => { },
    deleteTemplate: async () => { },
};
// コンテキスト作成
const TemplateContext = (0, react_1.createContext)(defaultTemplateContext);
// コンテキストプロバイダー
function TemplateProvider({ children }) {
    const [templates, setTemplates] = (0, react_1.useState)([]);
    const [loading, setLoading] = (0, react_1.useState)(false);
    const [error, setError] = (0, react_1.useState)(null);
    // テンプレート一覧取得
    const fetchTemplates = async (activeOnly) => {
        setLoading(true);
        setError(null);
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('認証されていません');
            }
            let url = '/api/templates';
            if (activeOnly) {
                url += '?isActive=true';
            }
            const response = await fetch(url, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.message || 'テンプレートの取得に失敗しました');
            }
            const data = await response.json();
            setTemplates(data);
        }
        catch (err) {
            setError(err.message);
            console.error('テンプレート取得エラー:', err);
        }
        finally {
            setLoading(false);
        }
    };
    // テンプレート詳細取得
    const getTemplate = async (id) => {
        setLoading(true);
        setError(null);
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('認証されていません');
            }
            const response = await fetch(`/api/templates/${id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.message || 'テンプレートの取得に失敗しました');
            }
            const template = await response.json();
            return template;
        }
        catch (err) {
            setError(err.message);
            console.error('テンプレート詳細取得エラー:', err);
            throw err;
        }
        finally {
            setLoading(false);
        }
    };
    // テンプレート作成
    const createTemplate = async (data) => {
        setLoading(true);
        setError(null);
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('認証されていません');
            }
            const response = await fetch('/api/templates', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(data)
            });
            if (!response.ok) {
                const responseData = await response.json();
                throw new Error(responseData.message || 'テンプレートの作成に失敗しました');
            }
            // テンプレート一覧を更新
            await fetchTemplates();
        }
        catch (err) {
            setError(err.message);
            console.error('テンプレート作成エラー:', err);
            throw err;
        }
        finally {
            setLoading(false);
        }
    };
    // テンプレート更新
    const updateTemplate = async (id, data) => {
        setLoading(true);
        setError(null);
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('認証されていません');
            }
            const response = await fetch(`/api/templates/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(data)
            });
            if (!response.ok) {
                const responseData = await response.json();
                throw new Error(responseData.message || 'テンプレートの更新に失敗しました');
            }
            // テンプレート一覧を更新
            await fetchTemplates();
        }
        catch (err) {
            setError(err.message);
            console.error('テンプレート更新エラー:', err);
            throw err;
        }
        finally {
            setLoading(false);
        }
    };
    // テンプレート削除
    const deleteTemplate = async (id) => {
        setLoading(true);
        setError(null);
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('認証されていません');
            }
            const response = await fetch(`/api/templates/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.message || 'テンプレートの削除に失敗しました');
            }
            // テンプレート一覧から削除したテンプレートを除外
            setTemplates(prev => prev.filter(template => template.id !== id));
        }
        catch (err) {
            setError(err.message);
            console.error('テンプレート削除エラー:', err);
            throw err;
        }
        finally {
            setLoading(false);
        }
    };
    const value = {
        templates,
        loading,
        error,
        fetchTemplates,
        getTemplate,
        createTemplate,
        updateTemplate,
        deleteTemplate
    };
    return <TemplateContext.Provider value={value}>{children}</TemplateContext.Provider>;
}
// カスタムフック
const useTemplates = () => (0, react_1.useContext)(TemplateContext);
exports.useTemplates = useTemplates;
//# sourceMappingURL=TemplateContext.js.map