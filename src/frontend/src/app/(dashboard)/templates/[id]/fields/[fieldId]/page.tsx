import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { useState } from 'react';
import { 
  PencilIcon,
  DocumentTextIcon,
  ArrowsUpDownIcon,
  CheckCircleIcon,
  XCircleIcon
} from '@heroicons/react/24/outline';

// フィールド詳細の型定義
interface FieldDetail {
  id: number;
  name: string;
  type: string;
  required: boolean;
  validationRegex?: string;
  defaultValue?: string;
  description?: string;
  order: number;
  templateId: number;
  createdAt: string;
  updatedAt: string;
}

export default function FieldDetailPage({ params }: { params: { id: string, fieldId: string } }) {
  // 実際の実装ではAPIからデータを取得します
  const templateId = parseInt(params.id);
  const fieldId = parseInt(params.fieldId);
  
  const [field, setField] = useState<FieldDetail>({
    id: fieldId,
    name: '請求番号',
    type: 'text',
    required: true,
    validationRegex: '^INV-\\d{4}-\\d{4}$',
    defaultValue: 'INV-',
    description: '請求書の一意の識別番号',
    order: 1,
    templateId: templateId,
    createdAt: '2025/03/01',
    updatedAt: '2025/03/28'
  });
  
  const [editMode, setEditMode] = useState(false);
  const [editedField, setEditedField] = useState<FieldDetail>({ ...field });
  
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
  
  // 編集モードの切り替え
  const toggleEditMode = () => {
    if (editMode) {
      // 編集モードを終了する場合は、変更をキャンセル
      setEditedField({ ...field });
    }
    setEditMode(!editMode);
  };
  
  // 変更を保存
  const saveChanges = () => {
    // バリデーション
    if (!editedField.name.trim()) {
      alert('フィールド名を入力してください');
      return;
    }
    
    // 実際の実装ではAPIに変更を送信
    setField({ ...editedField });
    setEditMode(false);
    
    // デモ用に成功メッセージを表示
    alert('フィールドが正常に更新されました');
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
            <div className="flex items-center">
              <h1 className="text-2xl font-semibold text-gray-900 mr-4">
                フィールド詳細
              </h1>
              {field.required && (
                <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-red-100 text-red-800">
                  必須
                </span>
              )}
            </div>
            <Button
              variant="outline"
              onClick={toggleEditMode}
              className="flex items-center"
            >
              <PencilIcon className="h-5 w-5 mr-2" />
              {editMode ? '編集を終了' : '編集'}
            </Button>
          </div>
          
          {/* フィールド情報 */}
          <div className="mt-6 bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">フィールド情報</h3>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">
                フィールドの詳細情報と設定
              </p>
            </div>
            <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
              <dl className="sm:divide-y sm:divide-gray-200">
                <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">フィールド名</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {editMode ? (
                      <Input
                        type="text"
                        value={editedField.name}
                        onChange={(e) => setEditedField({ ...editedField, name: e.target.value })}
                        placeholder="フィールド名を入力"
                        required
                      />
                    ) : (
                      field.name
                    )}
                  </dd>
                </div>
                <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">タイプ</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {editMode ? (
                      <select
                        className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                        value={editedField.type}
                        onChange={(e) => setEditedField({ ...editedField, type: e.target.value })}
                      >
                        {fieldTypes.map(type => (
                          <option key={type.id} value={type.id}>{type.name}</option>
                        ))}
                      </select>
                    ) : (
                      getFieldTypeName(field.type)
                    )}
                  </dd>
                </div>
                <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">必須</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {editMode ? (
                      <div className="flex items-center">
                        <input
                          type="checkbox"
                          className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                          checked={editedField.required}
                          onChange={(e) => setEditedField({ ...editedField, required: e.target.checked })}
                        />
                        <span className="ml-2">このフィールドは必須項目です</span>
                      </div>
                    ) : (
                      field.required ? 'はい' : 'いいえ'
                    )}
                  </dd>
                </div>
                <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">説明</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {editMode ? (
                      <textarea
                        className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                        rows={3}
                        value={editedField.description || ''}
                        onChange={(e) => setEditedField({ ...editedField, description: e.target.value })}
                        placeholder="フィールドの説明を入力"
                      />
                    ) : (
                      field.description || '-'
                    )}
                  </dd>
                </div>
                <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">デフォルト値</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {editMode ? (
                      <Input
                        type="text"
                        value={editedField.defaultValue || ''}
                        onChange={(e) => setEditedField({ ...editedField, defaultValue: e.target.value })}
                        placeholder="デフォルト値を入力（オプション）"
                      />
                    ) : (
                      field.defaultValue || '-'
                    )}
                  </dd>
                </div>
                <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">バリデーション</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {editMode ? (
                      <>
                        <Input
                          type="text"
                          value={editedField.validationRegex || ''}
                          onChange={(e) => setEditedField({ ...editedField, validationRegex: e.target.value })}
                          placeholder="正規表現を入力（オプション）"
                        />
                        <p className="mt-1 text-xs text-gray-500">
                          例: ^[A-Z0-9-]+$ (大文字、数字、ハイフンのみ許可)
                        </p>
                      </>
                    ) : (
                      field.validationRegex || '-'
                    )}
                  </dd>
                </div>
                <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">順序</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    {editMode ? (
                      <Input
                        type="number"
                        min="1"
                        value={editedField.order}
                        onChange={(e) => setEditedField({ ...editedField, order: parseInt(e.target.value) })}
                      />
                    ) : (
                      field.order
                    )}
                  </dd>
                </div>
                <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">作成日</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{field.createdAt}</dd>
                </div>
                <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">最終更新日</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{field.updatedAt}</dd>
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
                onClick={toggleEditMode}
              >
                キャンセル
              </Button>
              <Button
                className="ml-3"
                onClick={saveChanges}
              >
                変更を保存
              </Button>
            </div>
          )}
          
          {/* バリデーションルールのヘルプ */}
          <div className="mt-8 bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">バリデーションルールのヘルプ</h3>
              <p className="mt-1 max-w-2xl text-sm text-gray-500">
                フィールドタイプごとの一般的なバリデーションルール例
              </p>
            </div>
            <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
              <dl className="sm:divide-y sm:divide-gray-200">
                <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">テキスト</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    <code className="text-xs bg-gray-100 p-1 rounded">^[A-Za-z0-9\s]+$</code> - 英数字とスペースのみ
                  </dd>
                </div>
                <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">数値</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    <code className="text-xs bg-gray-100 p-1 rounded">^\d+$</code> - 整数のみ<br />
                    <code className="text-xs bg-gray-100 p-1 rounded">^\d+(\.\d{1,2})?$</code> - 小数点以下2桁までの数値
                  </dd>
                </div>
                <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">日付</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    <code className="text-xs bg-gray-100 p-1 rounded">^\d{4}[-/]\d{1,2}[-/]\d{1,2}$</code> - YYYY-MM-DD または YYYY/MM/DD 形式
                  </dd>
                </div>
                <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">電話番号</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    <code className="text-xs bg-gray-100 p-1 rounded">^\d{2,4}-\d{2,4}-\d{4}$</code> - 日本の電話番号形式
                  </dd>
                </div>
                <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">メールアドレス</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    <code className="text-xs bg-gray-100 p-1 rounded">^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$</code> - 標準的なメールアドレス形式
                  </dd>
                </div>
              </dl>
            </div>
          </div>
          
          {/* 戻るボタン */}
          <div className="mt-8 flex justify-end">
            <Button
              variant="outline"
              onClick={() => window.history.back()}
            >
              フィールド一覧に戻る
            </Button>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
