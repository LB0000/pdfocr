"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useDocuments = void 0;
exports.DocumentProvider = DocumentProvider;
const react_1 = require("react");
// デフォルト値
const defaultDocumentContext = {
    documents: [],
    loading: false,
    error: null,
    fetchDocuments: async () => { },
    getDocument: async () => ({}),
    uploadDocument: async () => { },
    updateDocument: async () => { },
    deleteDocument: async () => { },
};
// コンテキスト作成
const DocumentContext = (0, react_1.createContext)(defaultDocumentContext);
// コンテキストプロバイダー
function DocumentProvider({ children }) {
    const [documents, setDocuments] = (0, react_1.useState)([]);
    const [loading, setLoading] = (0, react_1.useState)(false);
    const [error, setError] = (0, react_1.useState)(null);
    // ドキュメント一覧取得
    const fetchDocuments = async () => {
        setLoading(true);
        setError(null);
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('認証されていません');
            }
            const response = await fetch('/api/documents', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.message || 'ドキュメントの取得に失敗しました');
            }
            const data = await response.json();
            setDocuments(data);
        }
        catch (err) {
            setError(err.message);
            console.error('ドキュメント取得エラー:', err);
        }
        finally {
            setLoading(false);
        }
    };
    // ドキュメント詳細取得
    const getDocument = async (id) => {
        setLoading(true);
        setError(null);
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('認証されていません');
            }
            const response = await fetch(`/api/documents/${id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.message || 'ドキュメントの取得に失敗しました');
            }
            const document = await response.json();
            return document;
        }
        catch (err) {
            setError(err.message);
            console.error('ドキュメント詳細取得エラー:', err);
            throw err;
        }
        finally {
            setLoading(false);
        }
    };
    // ドキュメントアップロード
    const uploadDocument = async (file, description, templateId) => {
        setLoading(true);
        setError(null);
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('認証されていません');
            }
            const formData = new FormData();
            formData.append('file', file);
            if (description) {
                formData.append('description', description);
            }
            if (templateId) {
                formData.append('templateId', templateId);
            }
            const response = await fetch('/api/documents', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`
                },
                body: formData
            });
            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.message || 'ドキュメントのアップロードに失敗しました');
            }
            // ドキュメント一覧を更新
            await fetchDocuments();
        }
        catch (err) {
            setError(err.message);
            console.error('ドキュメントアップロードエラー:', err);
            throw err;
        }
        finally {
            setLoading(false);
        }
    };
    // ドキュメント更新
    const updateDocument = async (id, data) => {
        setLoading(true);
        setError(null);
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('認証されていません');
            }
            const response = await fetch(`/api/documents/${id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(data)
            });
            if (!response.ok) {
                const responseData = await response.json();
                throw new Error(responseData.message || 'ドキュメントの更新に失敗しました');
            }
            // ドキュメント一覧を更新
            await fetchDocuments();
        }
        catch (err) {
            setError(err.message);
            console.error('ドキュメント更新エラー:', err);
            throw err;
        }
        finally {
            setLoading(false);
        }
    };
    // ドキュメント削除
    const deleteDocument = async (id) => {
        setLoading(true);
        setError(null);
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                throw new Error('認証されていません');
            }
            const response = await fetch(`/api/documents/${id}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.message || 'ドキュメントの削除に失敗しました');
            }
            // ドキュメント一覧から削除したドキュメントを除外
            setDocuments(prev => prev.filter(doc => doc.id !== id));
        }
        catch (err) {
            setError(err.message);
            console.error('ドキュメント削除エラー:', err);
            throw err;
        }
        finally {
            setLoading(false);
        }
    };
    const value = {
        documents,
        loading,
        error,
        fetchDocuments,
        getDocument,
        uploadDocument,
        updateDocument,
        deleteDocument
    };
    return <DocumentContext.Provider value={value}>{children}</DocumentContext.Provider>;
}
// カスタムフック
const useDocuments = () => (0, react_1.useContext)(DocumentContext);
exports.useDocuments = useDocuments;
//# sourceMappingURL=DocumentContext.js.map