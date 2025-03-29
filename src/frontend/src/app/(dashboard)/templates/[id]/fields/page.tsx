import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useState } from 'react';
import { 
  PencilIcon,
  TrashIcon,
  ArrowsUpDownIcon,
  CheckCircleIcon,
  XCircleIcon
} from '@heroicons/react/24/outline';

// フィールドの型定義
interface Field {
  id: number;
  name: string;
  type: string;
  required: boolean;
  validationRegex?: string;
  defaultValue?: string;
  order: number;
  description?: string;
}

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

export default function FieldManagementPage({ params }: { params: { id: string } }) {
  // 実際の実装ではAPIからデータを取得します
  const templateId = parseInt(params.id);
  const templateName = '請求書テンプレート';
  
  const [fields, setFields] = useState<Field[]>([
    { id: 1, name: '請求番号', type: 'text', required: true, validationRegex: '^INV-\\d{4}-\\d{4}$', order: 1, description: '請求書の一意の識別番号' },
    { id: 2, name: '発行日', type: 'date', required: true, order: 2, description: '請求書の発行日' },
    { id: 3, name: '支払期限', type: 'date', required: true, order: 3, description: '支払いの期限日' },
    { id: 4, name: '請求先', type: 'text', required: true, order: 4, description: '請求先の会社名または個人名' },
    { id: 5, name: '請求先住所', type: 'address', required: true, order: 5, description: '請求先の住所' },
    { id: 6, name: '小計', type: 'currency', required: true, order: 6, description: '税抜きの合計金額' },
    { id: 7, name: '消費税', type: 'currency', required: true, order: 7, description: '適用される消費税額' },
    { id: 8, name: '合計金額', type: 'currency', required: true, order: 8, description: '税込みの合計金額' },
  ]);
  
  const [editingFieldId, setEditingFieldId] = useState<number | null>(null);
  const [editField, setEditField] = useState<Field | null>(null);
  
  // フィールドの編集モードを開始
  const startEditing = (field: Field) => {
    setEditingFieldId(field.id);
    setEditField({ ...field });
  };
  
  // 編集をキャンセル
  const cancelEditing = () => {
    setEditingFieldId(null);
    setEditField(null);
  };
  
  // 編集内容を保存
  const saveEditing = () => {
    if (!editField) return;
    
    const updatedFields = fields.map(field => {
      if (field.id === editingFieldId) {
        return editField;
      }
      return field;
    });
    
    setFields(updatedFields);
    setEditingFieldId(null);
    setEditField(null);
  };
  
  // フィールドの削除
  const deleteField = (id: number) => {
    if (window.confirm('このフィールドを削除してもよろしいですか？')) {
      const updatedFields = fields.filter(field => field.id !== id);
      // 順序を再設定
      const reorderedFields = updatedFields.map((field, index) => ({
        ...field,
        order: index + 1
      }));
      
      setFields(reorderedFields);
    }
  };
  
  // フィールドの順序を上に移動
  const moveFieldUp = (id: number) => {
    const index = fields.findIndex(field => field.id === id);
    if (index <= 0) return;
    
    const updatedFields = [...fields];
    const temp = updatedFields[index].order;
    updatedFields[index].order = updatedFields[index - 1].order;
    updatedFields[index - 1].order = temp;
    
    // 順序でソート
    updatedFields.sort((a, b) => a.order - b.order);
    
    setFields(updatedFields);
  };
  
  // フィールドの順序を下に移動
  const moveFieldDown = (id: number) => {
    const index = fields.findIndex(field => field.id === id);
    if (index >= fields.length - 1) return;
    
    const updatedFields = [...fields];
    const temp = updatedFields[index].order;
    updatedFields[index].order = updatedFields[index + 1].order;
    updatedFields[index + 1].order = temp;
    
    // 順序でソート
    updatedFields.sort((a, b) => a.order - b.order);
    
    setFields(updatedFields);
  };
  
  // 新しいフィールドの追加
  const addNewField = () => {
    const newField: Field = {
      id: Math.max(...fields.map(f => f.id)) + 1,
      name: '',
      type: 'text',
      required: false,
      order: fields.length + 1,
      description: ''
    };
    
    setFields([...fields, newField]);
    startEditing(newField);
  };
  
  // フィールドタイプの表示名を取得
  const getFieldTypeName = (type: string) => {
    const fieldType = fieldTypes.find(t => t.id === type);
    return fieldType ? fieldType.name : type;
  };
  
  return (
    <DashboardLayout>
      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">フィールド管理</h1>
              <p className="mt-1 text-sm text-gray-500">
                テンプレート: {templateName}
              </p>
            </div>
            <Button
              onClick={addNewField}
              className="flex items-center"
            >
              新規フィールド追加
            </Button>
          </div>
          
          {/* フィールド一覧 */}
          <div className="mt-8 bg-white shadow overflow-hidden sm:rounded-lg">
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
                    説明
                  </th>
                  <th scope="col" className="relative px-6 py-3">
                    <span className="sr-only">アクション</span>
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {fields.map((field) => (
                  <tr key={field.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <div className="flex items-center">
                        <span className="mr-2">{field.order}</span>
                        <div className="flex flex-col">
                          <button
                            onClick={() => moveFieldUp(field.id)}
                            disabled={field.order === 1}
                            className={`text-gray-400 hover:text-gray-500 ${field.order === 1 ? 'opacity-50 cursor-not-allowed' : ''}`}
                          >
                            <ArrowsUpDownIcon className="h-4 w-4 rotate-180" />
                          </button>
                          <button
                            onClick={() => moveFieldDown(field.id)}
                            disabled={field.order === fields.length}
                            className={`text-gray-400 hover:text-gray-500 ${field.order === fields.length ? 'opacity-50 cursor-not-allowed' : ''}`}
                          >
                            <ArrowsUpDownIcon className="h-4 w-4" />
                          </button>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {editingFieldId === field.id ? (
                        <Input
                          type="text"
                          value={editField?.name || ''}
                          onChange={(e) => setEditField({ ...editField!, name: e.target.value })}
                        />
                      ) : (
                        field.name
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {editingFieldId === field.id ? (
                        <select
                          className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                          value={editField?.type || 'text'}
                          onChange={(e) => setEditField({ ...editField!, type: e.target.value })}
                        >
                          {fieldTypes.map(type => (
                            <option key={type.id} value={type.id}>{type.name}</option>
                          ))}
                        </select>
                      ) : (
                        getFieldTypeName(field.type)
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {editingFieldId === field.id ? (
                        <input
                          type="checkbox"
                          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                          checked={editField?.required || false}
                          onChange={(e) => setEditField({ ...editField!, required: e.target.checked })}
                        />
                      ) : (
                        field.required ? (
                          <CheckCircleIcon className="h-5 w-5 text-green-500" />
                        ) : (
                          <XCircleIcon className="h-5 w-5 text-gray-400" />
                        )
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {editingFieldId === field.id ? (
                        <Input
                          type="text"
                          value={editField?.description || ''}
                          onChange={(e) => setEditField({ ...editField!, description: e.target.value })}
                        />
                      ) : (
                        field.description || '-'
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      {editingFieldId === field.id ? (
                        <div className="flex space-x-2 justify-end">
                          <button
                            onClick={cancelEditing}
                            className="text-gray-600 hover:text-gray-900"
                          >
                            キャンセル
                          </button>
                          <button
                            onClick={saveEditing}
                            className="text-indigo-600 hover:text-indigo-900"
                          >
                            保存
                          </button>
                        </div>
                      ) : (
                        <div className="flex space-x-4 justify-end">
                          <button
                            onClick={() => startEditing(field)}
                            className="text-indigo-600 hover:text-indigo-900"
                          >
                            <PencilIcon className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => deleteField(field.id)}
                            className="text-red-600 hover:text-red-900"
                          >
                            <TrashIcon className="h-5 w-5" />
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          
          {/* フィールドが存在しない場合 */}
          {fields.length === 0 && (
            <div className="mt-8 text-center py-12 bg-white shadow rounded-lg">
              <h3 className="mt-2 text-lg font-medium text-gray-900">フィールドが定義されていません</h3>
              <p className="mt-1 text-sm text-gray-500">
                このテンプレートにはまだフィールドが定義されていません。
              </p>
              <div className="mt-6">
                <Button
                  onClick={addNewField}
                  className="flex items-center mx-auto"
                >
                  フィールドを追加
                </Button>
              </div>
            </div>
          )}
          
          {/* 戻るボタン */}
          <div className="mt-8 flex justify-end">
            <Button
              variant="outline"
              onClick={() => window.history.back()}
            >
              テンプレート詳細に戻る
            </Button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
