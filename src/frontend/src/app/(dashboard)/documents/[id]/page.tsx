import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/Button';
import { useState } from 'react';
import { 
  DocumentTextIcon, 
  PencilIcon,
  ArrowDownTrayIcon,
  CheckCircleIcon,
  ClockIcon,
  ExclamationCircleIcon
} from '@heroicons/react/24/outline';

// ドキュメントの型定義
interface Document {
  id: number;
  name: string;
  status: 'completed' | 'processing' | 'error';
  date: string;
  template?: string;
  pages: number;
  content: string;
  fields: Field[];
  originalImage: string;
}

interface Field {
  id: number;
  name: string;
  value: string;
  confidence: number;
  corrected: boolean;
}

export default function DocumentDetailPage({ params }: { params: { id: string } }) {
  // 実際の実装ではAPIからデータを取得します
  const document: Document = {
    id: parseInt(params.id),
    name: '請求書_2025-03-01.pdf',
    status: 'completed',
    date: '2025/03/28',
    template: '請求書',
    pages: 2,
    content: `# 請求書\n\n**請求番号**: INV-2025-0301\n**発行日**: 2025年3月1日\n**支払期限**: 2025年3月31日\n\n## 請求先\n株式会社サンプル\n〒100-0001\n東京都千代田区千代田1-1-1\n\n## 請求内容\n| 項目 | 数量 | 単価 | 金額 |\n|------|------|------|------|\n| コンサルティングサービス | 10 | ¥50,000 | ¥500,000 |\n| システム開発 | 1 | ¥1,000,000 | ¥1,000,000 |\n| 保守サポート（年間） | 1 | ¥300,000 | ¥300,000 |\n\n## 合計\n**小計**: ¥1,800,000\n**消費税(10%)**: ¥180,000\n**合計金額**: ¥1,980,000\n\n## 振込先\nサンプル銀行 本店営業部\n普通預金 1234567\n株式会社サンプルテック`,
    fields: [
      { id: 1, name: '請求番号', value: 'INV-2025-0301', confidence: 0.98, corrected: false },
      { id: 2, name: '発行日', value: '2025年3月1日', confidence: 0.95, corrected: false },
      { id: 3, name: '支払期限', value: '2025年3月31日', confidence: 0.97, corrected: false },
      { id: 4, name: '請求先', value: '株式会社サンプル', confidence: 0.92, corrected: false },
      { id: 5, name: '小計', value: '¥1,800,000', confidence: 0.89, corrected: true },
      { id: 6, name: '消費税', value: '¥180,000', confidence: 0.94, corrected: false },
      { id: 7, name: '合計金額', value: '¥1,980,000', confidence: 0.96, corrected: false },
    ],
    originalImage: '/sample-invoice.png', // 実際の実装ではAPIから取得した画像パスを使用
  };
  
  const [activeTab, setActiveTab] = useState<'preview' | 'fields' | 'markdown'>('preview');
  const [editMode, setEditMode] = useState(false);
  const [documentContent, setDocumentContent] = useState(document.content);
  
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircleIcon className="h-5 w-5 text-green-500" />;
      case 'processing':
        return <ClockIcon className="h-5 w-5 text-yellow-500" />;
      case 'error':
        return <ExclamationCircleIcon className="h-5 w-5 text-red-500" />;
      default:
        return null;
    }
  };
  
  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return '完了';
      case 'processing':
        return '処理中';
      case 'error':
        return 'エラー';
      default:
        return status;
    }
  };
  
  const getStatusClass = (status: string) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'processing':
        return 'bg-yellow-100 text-yellow-800';
      case 'error':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };
  
  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 0.9) return 'text-green-500';
    if (confidence >= 0.7) return 'text-yellow-500';
    return 'text-red-500';
  };
  
  return (
    <DashboardLayout>
      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <h1 className="text-2xl font-semibold text-gray-900 mr-4">{document.name}</h1>
              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClass(document.status)}`}>
                {getStatusText(document.status)}
              </span>
            </div>
            <div className="flex space-x-3">
              <Button
                variant="outline"
                onClick={() => setEditMode(!editMode)}
                className="flex items-center"
              >
                <PencilIcon className="h-5 w-5 mr-2" />
                {editMode ? '編集を終了' : '編集'}
              </Button>
              <Button
                variant="outline"
                className="flex items-center"
              >
                <ArrowDownTrayIcon className="h-5 w-5 mr-2" />
                ダウンロード
              </Button>
            </div>
          </div>
          
          {/* ドキュメント情報 */}
          <div className="mt-6 bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">ドキュメント情報</h3>
            </div>
            <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
              <dl className="sm:divide-y sm:divide-gray-200">
                <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">ファイル名</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{document.name}</dd>
                </div>
                <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">テンプレート</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{document.template || '-'}</dd>
                </div>
                <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">処理日</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{document.date}</dd>
                </div>
                <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">ページ数</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{document.pages}</dd>
                </div>
                <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">ステータス</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2 flex items-center">
                    {getStatusIcon(document.status)}
                    <span className="ml-1">{getStatusText(document.status)}</span>
                  </dd>
                </div>
              </dl>
            </div>
          </div>
          
          {/* タブナビゲーション */}
          <div className="mt-6 border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              <button
                className={`${
                  activeTab === 'preview'
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                onClick={() => setActiveTab('preview')}
              >
                プレビュー
              </button>
              <button
                className={`${
                  activeTab === 'fields'
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                onClick={() => setActiveTab('fields')}
              >
                フィールド
              </button>
              <button
                className={`${
                  activeTab === 'markdown'
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}
                onClick={() => setActiveTab('markdown')}
              >
                マークダウン
              </button>
            </nav>
          </div>
          
          {/* タブコンテンツ */}
          <div className="mt-6">
            {activeTab === 'preview' && (
              <div className="bg-white shadow overflow-hidden sm:rounded-lg p-6">
                <div className="flex justify-center">
                  <div className="w-full max-w-3xl">
                    <img
                      src={document.originalImage}
                      alt={document.name}
                      className="w-full h-auto border border-gray-200 rounded-lg"
                    />
                  </div>
                </div>
              </div>
            )}
            
            {activeTab === 'fields' && (
              <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        フィールド名
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        値
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        信頼度
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        修正済み
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {document.fields.map((field) => (
                      <tr key={field.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          {field.name}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {editMode ? (
                            <input
                              type="text"
                              className="border border-gray-300 rounded-md p-1 text-sm"
                              defaultValue={field.value}
                            />
                          ) : (
                            field.value
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          <span className={getConfidenceColor(field.confidence)}>
                            {Math.round(field.confidence * 100)}%
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {field.corrected ? (
                            <CheckCircleIcon className="h-5 w-5 text-green-500" />
                          ) : (
                            '-'
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
            
            {activeTab === 'markdown' && (
              <div className="bg-white shadow overflow-hidden sm:rounded-lg p-6">
                {editMode ? (
                  <textarea
                    className="w-full h-96 p-4 border border-gray-300 rounded-md font-mono text-sm"
                    value={documentContent}
                    onChange={(e) => setDocumentContent(e.target.value)}
                  />
                ) : (
                  <div className="prose max-w-none">
                    <pre className="bg-gray-50 p-4 rounded-md overflow-auto">
                      {documentContent}
                    </pre>
                  </div>
                )}
              </div>
            )}
          </div>
          
          {/* 編集モード時の保存ボタン */}
          {editMode && (
            <div className="mt-6 flex justify-end">
              <Button
                className="ml-3"
                onClick={() => setEditMode(false)}
              >
                変更を保存
              </Button>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
