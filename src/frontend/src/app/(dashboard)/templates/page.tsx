import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/Button';
import { 
  DocumentDuplicateIcon, 
  PlusIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline';
import { useState } from 'react';

// テンプレートの型定義
interface Template {
  id: number;
  name: string;
  description: string;
  fieldCount: number;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

export default function TemplatesPage() {
  // 実際の実装ではAPIからデータを取得します
  const templates: Template[] = [
    { id: 1, name: '請求書', description: '標準的な請求書テンプレート', fieldCount: 12, isDefault: true, createdAt: '2025/03/01', updatedAt: '2025/03/28' },
    { id: 2, name: '契約書', description: '契約書用テンプレート', fieldCount: 18, isDefault: false, createdAt: '2025/03/05', updatedAt: '2025/03/20' },
    { id: 3, name: '見積書', description: '見積書用テンプレート', fieldCount: 10, isDefault: false, createdAt: '2025/03/10', updatedAt: '2025/03/15' },
    { id: 4, name: '納品書', description: '納品書用テンプレート', fieldCount: 8, isDefault: false, createdAt: '2025/03/15', updatedAt: '2025/03/15' },
    { id: 5, name: '申請書', description: '一般的な申請書テンプレート', fieldCount: 15, isDefault: false, createdAt: '2025/03/20', updatedAt: '2025/03/20' },
  ];
  
  const [searchTerm, setSearchTerm] = useState('');
  
  // 検索を適用
  const filteredTemplates = templates.filter(template => 
    template.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    template.description.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  return (
    <DashboardLayout>
      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-semibold text-gray-900">テンプレート</h1>
            <Button className="flex items-center">
              <PlusIcon className="h-5 w-5 mr-2" />
              新規テンプレート
            </Button>
          </div>
          
          {/* 検索 */}
          <div className="mt-6">
            <div className="relative flex-grow">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                placeholder="テンプレート名で検索..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          
          {/* テンプレート一覧 */}
          <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredTemplates.map((template) => (
              <div
                key={template.id}
                className="bg-white overflow-hidden shadow rounded-lg border border-gray-200 hover:shadow-md transition-shadow duration-200"
              >
                <div className="px-4 py-5 sm:p-6">
                  <div className="flex items-center">
                    <div className="flex-shrink-0 bg-indigo-100 rounded-md p-3">
                      <DocumentDuplicateIcon className="h-6 w-6 text-indigo-600" />
                    </div>
                    <div className="ml-5 w-0 flex-1">
                      <a href={`/templates/${template.id}`} className="text-lg font-medium text-gray-900 hover:text-indigo-600">
                        {template.name}
                      </a>
                      <p className="mt-1 text-sm text-gray-500 truncate">
                        {template.description}
                      </p>
                    </div>
                  </div>
                  
                  <div className="mt-6">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">フィールド数</span>
                      <span className="font-medium text-gray-900">{template.fieldCount}</span>
                    </div>
                    <div className="mt-2 flex justify-between text-sm">
                      <span className="text-gray-500">デフォルト</span>
                      <span className="font-medium text-gray-900">{template.isDefault ? 'はい' : 'いいえ'}</span>
                    </div>
                    <div className="mt-2 flex justify-between text-sm">
                      <span className="text-gray-500">最終更新</span>
                      <span className="font-medium text-gray-900">{template.updatedAt}</span>
                    </div>
                  </div>
                  
                  <div className="mt-6 flex justify-between">
                    <a
                      href={`/templates/${template.id}`}
                      className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
                    >
                      詳細を表示
                    </a>
                    <a
                      href={`/templates/${template.id}/fields`}
                      className="text-sm font-medium text-indigo-600 hover:text-indigo-500"
                    >
                      フィールド管理
                    </a>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          {/* テンプレートが見つからない場合 */}
          {filteredTemplates.length === 0 && (
            <div className="mt-8 text-center py-12 bg-white shadow rounded-lg">
              <DocumentDuplicateIcon className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-2 text-lg font-medium text-gray-900">テンプレートが見つかりません</h3>
              <p className="mt-1 text-sm text-gray-500">
                検索条件に一致するテンプレートがありません。
              </p>
              <div className="mt-6">
                <Button
                  className="flex items-center mx-auto"
                  onClick={() => setSearchTerm('')}
                >
                  すべて表示
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  );
}
