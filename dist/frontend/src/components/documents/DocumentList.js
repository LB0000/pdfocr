"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = DocumentList;
const DocumentContext_1 = require("@/context/DocumentContext");
const react_1 = require("react");
const link_1 = __importDefault(require("next/link"));
function DocumentList() {
    const { documents, loading, error, fetchDocuments } = (0, DocumentContext_1.useDocuments)();
    const [searchTerm, setSearchTerm] = (0, react_1.useState)('');
    const [statusFilter, setStatusFilter] = (0, react_1.useState)('all');
    (0, react_1.useEffect)(() => {
        fetchDocuments();
    }, [fetchDocuments]);
    // 検索とフィルタリング
    const filteredDocuments = documents.filter(doc => {
        const matchesSearch = doc.fileName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (doc.description && doc.description.toLowerCase().includes(searchTerm.toLowerCase()));
        const matchesStatus = statusFilter === 'all' || doc.status === statusFilter;
        return matchesSearch && matchesStatus;
    });
    // ステータスに応じたバッジの色を取得
    const getStatusBadgeColor = (status) => {
        switch (status) {
            case 'pending': return 'bg-yellow-100 text-yellow-800';
            case 'processing': return 'bg-blue-100 text-blue-800';
            case 'completed': return 'bg-green-100 text-green-800';
            case 'error': return 'bg-red-100 text-red-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };
    // ステータスの日本語表示
    const getStatusLabel = (status) => {
        switch (status) {
            case 'pending': return '待機中';
            case 'processing': return '処理中';
            case 'completed': return '完了';
            case 'error': return 'エラー';
            default: return status;
        }
    };
    return (<div className="w-full bg-white rounded-lg shadow-md">
      <div className="p-6 border-b">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-semibold">ドキュメント一覧</h2>
          <link_1.default href="/documents/upload" className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
            新規アップロード
          </link_1.default>
        </div>
        
        <div className="flex flex-col gap-4 md:flex-row md:items-center">
          <div className="flex-1">
            <input type="text" placeholder="ファイル名または説明で検索..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"/>
          </div>
          
          <div>
            <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500">
              <option value="all">すべてのステータス</option>
              <option value="pending">待機中</option>
              <option value="processing">処理中</option>
              <option value="completed">完了</option>
              <option value="error">エラー</option>
            </select>
          </div>
        </div>
      </div>
      
      {loading ? (<div className="flex items-center justify-center p-8">
          <div className="text-gray-500">読み込み中...</div>
        </div>) : error ? (<div className="p-6 text-red-700 bg-red-100">
          エラーが発生しました: {error}
        </div>) : filteredDocuments.length === 0 ? (<div className="flex flex-col items-center justify-center p-8 text-gray-500">
          <p className="mb-4">ドキュメントがありません</p>
          <link_1.default href="/documents/upload" className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
            新規アップロード
          </link_1.default>
        </div>) : (<div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                  ファイル名
                </th>
                <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                  ステータス
                </th>
                <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                  テンプレート
                </th>
                <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                  アップロード日時
                </th>
                <th scope="col" className="px-6 py-3 text-xs font-medium tracking-wider text-left text-gray-500 uppercase">
                  アクション
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredDocuments.map((document) => (<tr key={document.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">{document.fileName}</div>
                    {document.description && (<div className="text-sm text-gray-500">{document.description}</div>)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusBadgeColor(document.status)}`}>
                      {getStatusLabel(document.status)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {document.template ? document.template.name : '未設定'}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">
                      {new Date(document.createdAt).toLocaleString('ja-JP')}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium whitespace-nowrap">
                    <link_1.default href={`/documents/${document.id}`} className="text-indigo-600 hover:text-indigo-900">
                      詳細
                    </link_1.default>
                  </td>
                </tr>))}
            </tbody>
          </table>
        </div>)}
    </div>);
}
//# sourceMappingURL=DocumentList.js.map