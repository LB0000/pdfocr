import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useState } from 'react';
import { 
  DocumentDuplicateIcon, 
  PlusIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';

// フィールドタイプの定義
const fieldTypes = [
  { id: 'text', name: 'テキスト' },
  { id: 'number', name: '数値' },
  { id: 'date', name: '日付' },
  { id: 'currency', name: '金額' },
  { id: 'phone', name: '電話番号' },
  { id: 'email', name: 'メールアドレス' },
  { id: 'address', name: '住所' }
];

export default function CreateTemplatePage() {
  const [templateName, setTemplateName] = useState('');
  const [templateDescription, setTemplateDescription] = useState('');
  const [isDefault, setIsDefault] = useState(false);
  const [fields, setFields] = useState([
    { id: 1, name: '', type: 'text', required: false, validationRegex: '', order: 1 }
  ]);
  
  // フィールドの追加
  const addField = () => {
    const newField = {
      id: fields.length + 1,
      name: '',
      type: 'text',
      required: false,
      validationRegex: '',
      order: fields.length + 1
    };
    setFields([...fields, newField]);
  };
  
  // フィールドの削除
  const removeField = (id: number) => {
    if (fields.length <= 1) return; // 最低1つのフィールドは必要
    
    const updatedFields = fields.filter(field => field.id !== id);
    // 順序を再設定
    const reorderedFields = updatedFields.map((field, index) => ({
      ...field,
      order: index + 1
    }));
    
    setFields(reorderedFields);
  };
  
  // フィールド情報の更新
  const updateField = (id: number, key: string, value: any) => {
    const updatedFields = fields.map(field => {
      if (field.id === id) {
        return { ...field, [key]: value };
      }
      return field;
    });
    setFields(updatedFields);
  };
  
  // テンプレートの保存
  const saveTemplate = () => {
    // バリデーション
    if (!templateName.trim()) {
      alert('テンプレート名を入力してください');
      return;
    }
    
    // フィールド名のバリデーション
    const emptyFieldNames = fields.some(field => !field.name.trim());
    if (emptyFieldNames) {
      alert('すべてのフィールド名を入力してください');
      return;
    }
    
    // 実際の実装ではAPIにデータを送信
    const templateData = {
      name: templateName,
      description: templateDescription,
      isDefault,
      fields
    };
    
    console.log('保存するテンプレート:', templateData);
    
    // 成功したら一覧ページにリダイレクト
    // window.location.href = '/templates';
    
    // デモ用に成功メッセージを表示
    alert('テンプレートが正常に作成されました');
  };
  
  return (
    <DashboardLayout>
      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-semibold text-gray-900">新規テンプレート作成</h1>
          </div>
          
          {/* テンプレート基本情報 */}
          <div className="mt-6 bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">テンプレート情報</h3>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">
                テンプレートの基本情報を入力してください。
              </p>
            </div>
            <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
              <dl className="sm:divide-y sm:divide-gray-200">
                <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">テンプレート名 *</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    <Input
                      type="text"
                      value={templateName}
                      onChange={(e) => setTemplateName(e.target.value)}
                      placeholder="例: 請求書テンプレート"
                      required
                    />
                  </dd>
                </div>
                <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">説明</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    <textarea
                      className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                      rows={3}
                      value={templateDescription}
                      onChange={(e) => setTemplateDescription(e.target.value)}
                      placeholder="テンプレートの説明を入力してください"
                    />
                  </dd>
                </div>
                <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">デフォルト設定</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    <div className="flex items-center">
                      <input
                        id="default-template"
                        type="checkbox"
                        className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                        checked={isDefault}
                        onChange={(e) => setIsDefault(e.target.checked)}
                      />
                      <label htmlFor="default-template" className="ml-2 block text-sm text-gray-900">
                        このテンプレートをデフォルトとして設定する
                      </label>
                    </div>
                  </dd>
                </div>
              </dl>
            </div>
          </div>
          
          {/* フィールド定義 */}
          <div className="mt-8">
            <div className="flex justify-between items-center">
              <h2 className="text-lg font-medium text-gray-900">フィールド定義</h2>
              <Button
                onClick={addField}
                className="flex items-center"
                size="sm"
              >
                <PlusIcon className="h-5 w-5 mr-2" />
                フィールドを追加
              </Button>
            </div>
            
            <div className="mt-4 space-y-6">
              {fields.map((field, index) => (
                <div key={field.id} className="bg-white shadow overflow-hidden sm:rounded-lg">
                  <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      フィールド #{field.order}
                    </h3>
                    <button
                      type="button"
                      onClick={() => removeField(field.id)}
                      className="text-gray-400 hover:text-gray-500"
                      disabled={fields.length <= 1}
                    >
                      <XMarkIcon className="h-5 w-5" />
                    </button>
                  </div>
                  <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
                    <dl className="sm:divide-y sm:divide-gray-200">
                      <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                        <dt className="text-sm font-medium text-gray-500">フィールド名 *</dt>
                        <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                          <Input
                            type="text"
                            value={field.name}
                            onChange={(e) => updateField(field.id, 'name', e.target.value)}
                            placeholder="例: 請求番号"
                            required
                          />
                        </dd>
                      </div>
                      <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                        <dt className="text-sm font-medium text-gray-500">タイプ</dt>
                        <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                          <select
                            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                            value={field.type}
                            onChange={(e) => updateField(field.id, 'type', e.target.value)}
                          >
                            {fieldTypes.map(type => (
                              <option key={type.id} value={type.id}>{type.name}</option>
                            ))}
                          </select>
                        </dd>
                      </div>
                      <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                        <dt className="text-sm font-medium text-gray-500">必須</dt>
                        <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                          <div className="flex items-center">
                            <input
                              id={`required-${field.id}`}
                              type="checkbox"
                              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                              checked={field.required}
                              onChange={(e) => updateField(field.id, 'required', e.target.checked)}
                            />
                            <label htmlFor={`required-${field.id}`} className="ml-2 block text-sm text-gray-900">
                              このフィールドは必須項目です
                            </label>
                          </div>
                        </dd>
                      </div>
                      <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                        <dt className="text-sm font-medium text-gray-500">バリデーション</dt>
                        <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                          <Input
                            type="text"
                            value={field.validationRegex || ''}
                            onChange={(e) => updateField(field.id, 'validationRegex', e.target.value)}
                            placeholder="例: ^[A-Z0-9-]+$"
                          />
                          <p className="mt-1 text-xs text-gray-500">
                            正規表現を使用してバリデーションルールを設定できます（オプション）
                          </p>
                        </dd>
                      </div>
                    </dl>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          {/* 保存ボタン */}
          <div className="mt-8 flex justify-end">
            <Button
              variant="outline"
              className="mr-3"
              onClick={() => window.history.back()}
            >
              キャンセル
            </Button>
            <Button
              onClick={saveTemplate}
            >
              テンプレートを保存
            </Button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
