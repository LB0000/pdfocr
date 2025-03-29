import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { 
  DocumentTextIcon, 
  PencilIcon,
  CheckIcon,
  ArrowPathIcon,
  DocumentDuplicateIcon
} from '@heroicons/react/24/outline';

// OCRプレビュー・補正UIコンポーネント
export default function OcrCorrectionPage({ params }: { params: { id: string } }) {
  // 実際の実装ではAPIからデータを取得します
  const documentId = parseInt(params.id);
  
  // ドキュメント情報のモックデータ
  const [document, setDocument] = useState({
    id: documentId,
    name: '請求書_2025-03-15.pdf',
    status: 'processed',
    templateId: 1,
    templateName: '請求書テンプレート',
    createdAt: '2025/03/15 14:30',
    updatedAt: '2025/03/15 14:32',
    pageCount: 2
  });
  
  // 現在表示中のページ
  const [currentPage, setCurrentPage] = useState(1);
  
  // OCR結果のモックデータ
  const [fields, setFields] = useState([
    { id: 1, name: '請求番号', type: 'text', value: 'INV-2025-0042', confidence: 95, corrected: false },
    { id: 2, name: '発行日', type: 'date', value: '2025/03/15', confidence: 92, corrected: false },
    { id: 3, name: '支払期限', type: 'date', value: '2025/04/15', confidence: 88, corrected: false },
    { id: 4, name: '請求先', type: 'text', value: '株式会社サンプル', confidence: 90, corrected: false },
    { id: 5, name: '請求先住所', type: 'address', value: '東京都千代田区丸の内1-1-1', confidence: 85, corrected: false },
    { id: 6, name: '小計', type: 'currency', value: '50,000', confidence: 94, corrected: false },
    { id: 7, name: '消費税', type: 'currency', value: '5,000', confidence: 93, corrected: false },
    { id: 8, name: '合計金額', type: 'currency', value: '55,000', confidence: 96, corrected: false },
  ]);
  
  // 編集中のフィールドID
  const [editingFieldId, setEditingFieldId] = useState<number | null>(null);
  
  // 編集中の値
  const [editValue, setEditValue] = useState('');
  
  // マークダウン表示
  const [markdownText, setMarkdownText] = useState(`# 請求書

**請求番号**: INV-2025-0042
**発行日**: 2025/03/15
**支払期限**: 2025/04/15

## 請求先
株式会社サンプル
東京都千代田区丸の内1-1-1

## 請求内容
| 項目 | 数量 | 単価 | 金額 |
|------|------|------|------|
| コンサルティングサービス | 10 | 5,000 | 50,000 |

**小計**: 50,000円
**消費税**: 5,000円
**合計金額**: 55,000円

## 振込先
○○銀行 △△支店
普通口座: 1234567
口座名義: 株式会社PDF2MD
`);
  
  // 編集モードを開始
  const startEditing = (field: any) => {
    setEditingFieldId(field.id);
    setEditValue(field.value);
  };
  
  // 編集をキャンセル
  const cancelEditing = () => {
    setEditingFieldId(null);
    setEditValue('');
  };
  
  // 編集内容を保存
  const saveEditing = (fieldId: number) => {
    const updatedFields = fields.map(field => {
      if (field.id === fieldId) {
        return { ...field, value: editValue, corrected: true };
      }
      return field;
    });
    
    setFields(updatedFields);
    setEditingFieldId(null);
    setEditValue('');
    
    // マークダウンも更新（実際の実装ではより複雑な処理が必要）
    updateMarkdown(updatedFields);
  };
  
  // マークダウンを更新
  const updateMarkdown = (updatedFields: any[]) => {
    // 実際の実装ではフィールド値に基づいてマークダウンを再生成
    // ここでは簡易的な実装
    const field = updatedFields.find(f => f.id === editingFieldId);
    if (field) {
      const newMarkdown = markdownText.replace(
        new RegExp(`${field.name}\\**: .*`, 'g'),
        `${field.name}**: ${editValue}`
      );
      setMarkdownText(newMarkdown);
    }
  };
  
  // 信頼度に基づく色を取得
  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 90) return 'text-green-600';
    if (confidence >= 75) return 'text-yellow-600';
    return 'text-red-600';
  };
  
  // ページ変更ハンドラー
  const handlePageChange = (page: number) => {
    if (page < 1 || page > document.pageCount) return;
    setCurrentPage(page);
  };
  
  // すべての修正を保存
  const saveAllCorrections = () => {
    // 実際の実装ではAPIに変更を送信
    alert('すべての修正が保存されました');
  };
  
  return (
    <DashboardLayout>
      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">OCR結果プレビュー・補正</h1>
              <p className="mt-1 text-sm text-gray-500">
                ドキュメント: {document.name}
              </p>
            </div>
            <div className="flex space-x-4">
              <Button
                variant="outline"
                onClick={() => window.location.href = '/documents'}
              >
                ドキュメント一覧に戻る
              </Button>
              <Button
                className="flex items-center"
                onClick={saveAllCorrections}
              >
                <CheckIcon className="h-5 w-5 mr-2" />
                すべての修正を保存
              </Button>
            </div>
          </div>
          
          {/* メインコンテンツ */}
          <div className="mt-6 flex flex-col lg:flex-row gap-6">
            {/* 左側: ドキュメントプレビュー */}
            <div className="w-full lg:w-1/2">
              <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">ドキュメントプレビュー</h3>
                  <div className="flex items-center space-x-2">
                    <button
                      className="p-1 rounded-md hover:bg-gray-100"
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    </button>
                    <span className="text-sm text-gray-700">
                      ページ {currentPage} / {document.pageCount}
                    </span>
                    <button
                      className="p-1 rounded-md hover:bg-gray-100"
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === document.pageCount}
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                </div>
                <div className="border-t border-gray-200">
                  {/* 実際の実装ではPDFビューアーを使用 */}
                  <div className="relative bg-gray-100 h-[600px] flex items-center justify-center">
                    <div className="bg-white shadow-lg w-[80%] h-[90%] p-8 flex flex-col">
                      <div className="text-center text-xl font-bold mb-6">請求書</div>
                      
                      <div className="flex justify-between mb-8">
                        <div>
                          <div className="text-sm font-semibold">請求番号: INV-2025-0042</div>
                          <div className="text-sm">発行日: 2025/03/15</div>
                          <div className="text-sm">支払期限: 2025/04/15</div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-semibold">株式会社PDF2MD</div>
                          <div className="text-sm">東京都渋谷区渋谷1-1-1</div>
                          <div className="text-sm">TEL: 03-1234-5678</div>
                        </div>
                      </div>
                      
                      <div className="mb-6">
                        <div className="text-sm font-semibold">請求先:</div>
                        <div className="text-sm">株式会社サンプル</div>
                        <div className="text-sm">東京都千代田区丸の内1-1-1</div>
                      </div>
                      
                      <table className="w-full text-sm mb-8">
                        <thead>
                          <tr className="border-b border-gray-300">
                            <th className="text-left py-2">項目</th>
                            <th className="text-right py-2">数量</th>
                            <th className="text-right py-2">単価</th>
                            <th className="text-right py-2">金額</th>
                          </tr>
                        </thead>
                        <tbody>
                          <tr className="border-b border-gray-200">
                            <td className="py-2">コンサルティングサービス</td>
                            <td className="text-right py-2">10</td>
                            <td className="text-right py-2">5,000</td>
                            <td className="text-right py-2">50,000</td>
                          </tr>
                        </tbody>
                      </table>
                      
                      <div className="mt-auto">
                        <div className="flex justify-between text-sm">
                          <div className="font-semibold">小計:</div>
                          <div>50,000円</div>
                        </div>
                        <div className="flex justify-between text-sm">
                          <div className="font-semibold">消費税:</div>
                          <div>5,000円</div>
                        </div>
                        <div className="flex justify-between text-sm font-bold">
                          <div>合計金額:</div>
                          <div>55,000円</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* マークダウン表示 */}
              <div className="mt-6 bg-white shadow overflow-hidden sm:rounded-lg">
                <div className="px-4 py-5 sm:px-6 flex justify-between items-center">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">マークダウン</h3>
                  <Button
                    variant="outline"
                    className="flex items-center"
                    onClick={() => {
                      // クリップボードにコピー
                      navigator.clipboard.writeText(markdownText);
                      alert('マークダウンをクリップボードにコピーしました');
                    }}
                  >
                    <DocumentDuplicateIcon className="h-5 w-5 mr-2" />
                    コピー
                  </Button>
                </div>
                <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
                  <pre className="bg-gray-50 p-4 rounded-md overflow-auto text-sm h-64">
                    {markdownText}
                  </pre>
                </div>
              </div>
            </div>
            
            {/* 右側: フィールド一覧と編集 */}
            <div className="w-full lg:w-1/2">
              <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                <div className="px-4 py-5 sm:px-6">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">検出されたフィールド</h3>
                  <p className="mt-1 text-sm text-gray-500">
                    OCRで検出されたフィールドの一覧です。値を確認し、必要に応じて修正してください。
                  </p>
                </div>
                <div className="border-t border-gray-200">
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
                        <th scope="col" className="relative px-6 py-3">
                          <span className="sr-only">アクション</span>
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {fields.map((field) => (
                        <tr key={field.id} className={field.corrected ? 'bg-green-50' : ''}>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                            {field.name}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {editingFieldId === field.id ? (
                              <Input
                                type="text"
                                value={editValue}
                                onChange={(e) => setEditValue(e.target.value)}
                                autoFocus
                              />
                            ) : (
                              field.value
                            )}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                            <span className={getConfidenceColor(field.confidence)}>
                              {field.confidence}%
                            </span>
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
                                  onClick={() => saveEditing(field.id)}
                                  className="text-indigo-600 hover:text-indigo-900"
                                >
                                  保存
                                </button>
                              </div>
                            ) : (
                              <button
                                onClick={() => startEditing(field)}
                                className="text-indigo-600 hover:text-indigo-900"
                              >
                                <PencilIcon className="h-5 w-5" />
                              </button>
                            )}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
              
              {/* 補正ヒント */}
              <div className="mt-6 bg-white shadow overflow-hidden sm:rounded-lg">
                <div className="px-4 py-5 sm:px-6">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">補正ヒント</h3>
                </div>
                <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
                  <div className="space-y-4">
                    <div className="flex items-start">
                      <div className="flex-shrink-0">
                        <svg className="h-5 w-5 text-yellow-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 01<response clipped><NOTE>To save on context only part of this file has been shown to you. You should retry this tool after you have searched inside the file with `grep -n` in order to find the line numbers of what you are looking for.</NOTE>