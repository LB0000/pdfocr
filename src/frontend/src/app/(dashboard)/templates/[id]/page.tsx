import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/Button';
import { useState } from 'react';
import { 
  DocumentDuplicateIcon, 
  PencilIcon,
  TrashIcon,
  CheckCircleIcon,
  XCircleIcon
} from '@heroicons/react/24/outline';

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

// フィールド定義の型定義
interface FieldDefinition {
  id: number;
  name: string;
  type: 'text' | 'number' | 'date' | 'currency' | 'phone' | 'email' | 'address';
  required: boolean;
  defaultValue?: string;
  validationRegex?: string;
  order: number;
}

export default function TemplateDetailPage({ params }: { params: { id: string } }) {
  // 実際の実装ではAPIからデータを取得します
  const template: Template = {
    id: parseInt(params.id),
    name: '請求書',
    description: '標準的な請求書テンプレート',
    fieldCount: 12,
    isDefault: true,
    createdAt: '2025/03/01',
    updatedAt: '2025/03/28'
  };
  
  const fields: FieldDefinition[] = [
    { id: 1, name: '請求番号', type: 'text', required: true, validationRegex: '^INV-\\d{4}-\\d{4}$', order: 1 },
    { id: 2, name: '発行日', type: 'date', required: true, order: 2 },
    { id: 3, name: '支払期限', type: 'date', required: true, order: 3 },
    { id: 4, name: '請求先', type: 'text', required: true, order: 4 },
    { id: 5, name: '請求先住所', type: 'address', required: true, order: 5 },
    { id: 6, name: '小計', type: 'currency', required: true, order: 6 },
    { id: 7, name: '消費税', type: 'currency', required: true, order: 7 },
    { id: 8, name: '合計金額', type: 'currency', required: true, order: 8 },
    { id: 9, name: '振込先銀行', type: 'text', required: true, order: 9 },
    { id: 10, name: '振込先支店', type: 'text', required: true, order: 10 },
    { id: 11, name: '口座種別', type: 'text', required: true, order: 11 },
    { id: 12, name: '口座番号', type: 'text', required: true, order: 12 },
  ];
  
  const [editMode, setEditMode] = useState(false);
  const [templateName, setTemplateName] = useState(template.name);
  const [templateDescription, setTemplateDescription] = useState(template.description);
  const [isDefault, setIsDefault] = useState(template.isDefault);
  
  const getFieldTypeName = (type: string) => {
    switch (type) {
      case 'text': return 'テキスト';
      case 'number': return '数値';
      case 'date': return '日付';
      case 'currency': return '金額';
      case 'phone': return '電話番号';
      case 'email': return 'メールアドレス';
      case 'address': return '住所';
      default: return type;
    }
  };
  
  return (
    <DashboardLayout>
      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              <h1 className="text-2xl font-semibold text-gray-900 mr-4">
                {editMode ? (
                  <input
                    type="text"
                    className="border border-gray-300 rounded-md p-1"
                    value={templateName}
                    onChange={(e) => setTemplateName(e.target.value)}
                  />
                ) : (
                  template.name
                )}
              </h1>
              {template.isDefault && (
                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                  デフォルト
                </span>
              )}
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
                className="flex items-center text-red-600 border-red-600 hover:bg-red-50"
              >
                <TrashIcon className="h-5 w-5 mr-2" />
                削除
              </Button>
            </div>
          </div>
          
          {/* テンプレート情報 */}
          <div className="mt-6 bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">テンプレート情報</h3>
            </div>
            <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
              <dl className="sm:divide-y sm:divide-gray-200">
                <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">テンプレート名</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {editMode ? (
                      <input
                        type="text"
                        className="border border-gray-300 rounded-md p-1 w-full"
                        value={templateName}
                        onChange={(e) => setTemplateName(e.target.value)}
                      />
                    ) : (
                      template.name
                    )}
                  </dd>
                </div>
                <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">説明</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {editMode ? (
                      <textarea
                        className="border border-gray-300 rounded-md p-1 w-full"
                        value={templateDescription}
                        onChange={(e) => setTemplateDescription(e.target.value)}
                      />
                    ) : (
                      template.description
                    )}
                  </dd>
                </div>
                <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">フィールド数</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{template.fieldCount}</dd>
                </div>
                <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">デフォルト</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {editMode ? (
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                          checked={isDefault}
                          onChange={(e) => setIsDefault(e.target.checked)}
                        />
                        <span className="ml-2">デフォルトテンプレートとして設定</span>
                      </div>
                    ) : (
                      template.isDefault ? 'はい' : 'いいえ'
                    )}
                  </dd>
                </div>
                <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">作成日</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{template.createdAt}</dd>
                </div>
                <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">最終更新日</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{template.updatedAt}</dd>
                </div>
              </dl>
            </div>
          </div>
          
          {/* 編集モード時の保存ボタン */}
          {editMode && (
            <div className="mt-6 flex justify-end">
              <Button
                variant="outline"
                className="mr-3"
                onClick={() => setEditMode(false)}
              >
                キャンセル
              </Button>
              <Button
                className="ml-3"
                onClick={() => setEditMode(false)}
              >
                変更を保存
              </Button>
            </div>
          )}
          
          {/* フィールド一覧 */}
          <div className="mt-8">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-medium text-gray-900">フィールド定義</h2>
              <Button
                className="flex items-center"
                size="sm"
              >
                フィールドを追加
              </Button>
            </div>
            
            <div className="mt-4 bg-white shadow overflow-hidden sm:rounded-lg">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      順序
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      フィールド名
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      タイプ
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      必須
                    </th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      バリデーション
                    </th>
                    <th scope="col" className="relative px-6 py-3">
                      <span className="sr-only">編集</span>
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {fields.map((field) => (
                    <tr key={field.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {field.order}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {field.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {getFieldTypeName(field.type)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {field.required ? (
                          <CheckCircleIcon className="h-5 w-5 text-green-500" />
                        ) : (
                          <XCircleIcon className="h-5 w-5 text-gray-400" />
                        )}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {field.validationRegex || '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                        <a href={`/templates/${template.id}/fields/${field.id}`} className="text-indigo-600 hover:text-indigo-900 mr-4">
                          編集
                        </a>
                        <button className="text-red-600 hover:text-red-900">
                          削除
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
