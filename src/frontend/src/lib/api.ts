import axios from 'axios';

// APIのベースURL
const baseURL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api';

// Axiosインスタンスの作成
const api = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// リクエストインターセプター
api.interceptors.request.use(
  (config) => {
    // ブラウザ環境の場合のみ
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// レスポンスインターセプター
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    
    // トークン期限切れの場合（401エラー）かつ、リフレッシュ処理未実施の場合
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        // リフレッシュトークンを使用して新しいアクセストークンを取得
        const refreshToken = localStorage.getItem('refreshToken');
        if (!refreshToken) {
          // リフレッシュトークンがない場合はログアウト
          window.location.href = '/login';
          return Promise.reject(error);
        }
        
        const response = await axios.post(`${baseURL}/auth/refresh`, {
          refreshToken,
        });
        
        // 新しいトークンを保存
        const { token, refreshToken: newRefreshToken } = response.data;
        localStorage.setItem('token', token);
        localStorage.setItem('refreshToken', newRefreshToken);
        
        // 元のリクエストを再試行
        originalRequest.headers.Authorization = `Bearer ${token}`;
        return api(originalRequest);
      } catch (refreshError) {
        // リフレッシュトークンが無効な場合はログアウト
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

// API関数のエクスポート
export default {
  // 認証関連
  auth: {
    login: (email: string, password: string) => 
      api.post('/auth/login', { email, password }),
    register: (name: string, email: string, password: string) => 
      api.post('/auth/register', { name, email, password }),
    logout: () => 
      api.post('/auth/logout'),
    refreshToken: (refreshToken: string) => 
      api.post('/auth/refresh', { refreshToken }),
    me: () => 
      api.get('/auth/me'),
  },
  
  // ユーザー関連
  users: {
    getAll: () => 
      api.get('/users'),
    getById: (id: number) => 
      api.get(`/users/${id}`),
    create: (userData: any) => 
      api.post('/users', userData),
    update: (id: number, userData: any) => 
      api.put(`/users/${id}`, userData),
    delete: (id: number) => 
      api.delete(`/users/${id}`),
  },
  
  // テンプレート関連
  templates: {
    getAll: () => 
      api.get('/templates'),
    getById: (id: number) => 
      api.get(`/templates/${id}`),
    create: (templateData: any) => 
      api.post('/templates', templateData),
    update: (id: number, templateData: any) => 
      api.put(`/templates/${id}`, templateData),
    delete: (id: number) => 
      api.delete(`/templates/${id}`),
  },
  
  // フィールド関連
  fields: {
    getAllByTemplateId: (templateId: number) => 
      api.get(`/templates/${templateId}/fields`),
    getById: (templateId: number, fieldId: number) => 
      api.get(`/templates/${templateId}/fields/${fieldId}`),
    create: (templateId: number, fieldData: any) => 
      api.post(`/templates/${templateId}/fields`, fieldData),
    update: (templateId: number, fieldId: number, fieldData: any) => 
      api.put(`/templates/${templateId}/fields/${fieldId}`, fieldData),
    delete: (templateId: number, fieldId: number) => 
      api.delete(`/templates/${templateId}/fields/${fieldId}`),
  },
  
  // ドキュメント関連
  documents: {
    getAll: () => 
      api.get('/documents'),
    getById: (id: number) => 
      api.get(`/documents/${id}`),
    upload: (formData: FormData) => 
      api.post('/documents/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }),
    update: (id: number, documentData: any) => 
      api.put(`/documents/${id}`, documentData),
    delete: (id: number) => 
      api.delete(`/documents/${id}`),
    getFields: (id: number) => 
      api.get(`/documents/${id}/fields`),
    updateField: (documentId: number, fieldId: number, value: string) => 
      api.put(`/documents/${documentId}/fields/${fieldId}`, { value }),
  },
  
  // レイアウト解析関連
  layoutAnalysis: {
    analyze: (formData: FormData) => 
      api.post('/layout-analysis/analyze', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }),
    matchTemplate: (documentId: number) => 
      api.post(`/layout-analysis/match-template/${documentId}`),
  },
  
  // OCR関連
  ocr: {
    process: (documentId: number) => 
      api.post(`/ocr/process/${documentId}`),
    getResult: (documentId: number) => 
      api.get(`/ocr/result/${documentId}`),
    correctField: (documentId: number, fieldId: number, value: string) => 
      api.put(`/ocr/correct/${documentId}/fields/${fieldId}`, { value }),
    getMarkdown: (documentId: number) => 
      api.get(`/ocr/markdown/${documentId}`),
  },
  
  // フィードバック関連
  feedback: {
    submit: (feedbackData: any) => 
      api.post('/feedback', feedbackData),
    getAll: () => 
      api.get('/feedback'),
  },
};
