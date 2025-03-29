import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/Button';
import { 
  DocumentMagnifyingGlassIcon, 
  DocumentDuplicateIcon,
  ArrowPathIcon,
  CheckCircleIcon
} from '@heroicons/react/24/outline';

// レイアウト解析モジュールのUIコンポーネント
export default function LayoutAnalysisPage() {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysisComplete, setAnalysisComplete] = useState(false);
  const [matchedTemplate, setMatchedTemplate] = useState<any | null>(null);
  const [confidence, setConfidence] = useState(0);
  const [detectedFields, setDetectedFields] = useState<any[]>([]);
  
  // ファイル選択ハンドラー
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      const file = e.target.files[0];
      setSelectedFile(file);
      
      // プレビュー用のURLを生成
      const fileUrl = URL.createObjectURL(file);
      setPreviewUrl(fileUrl);
      
      // 分析状態をリセット
      setAnalyzing(false);
      setAnalysisComplete(false);
      setMatchedTemplate(null);
      setConfidence(0);
      setDetectedFields([]);
    }
  };
  
  // レイアウト解析を実行
  const analyzeLayout = () => {
    if (!selectedFile) return;
    
    setAnalyzing(true);
    
    // 実際の実装ではAPIにファイルを送信して解析
    // ここではモックの解析結果を表示
    setTimeout(() => {
      // モックのテンプレートマッチング結果
      const mockTemplate = {
        id: 1,
        name: '請求書テンプレート',
        confidence: 87.5
      };
      
      // モックのフィールド検出結果
      const mockFields = [
        { id: 1, name: '請求番号', type: 'text', confidence: 95, value: 'INV-2025-0042', bbox: [100, 120, 250, 145] },
        { id: 2, name: '発行日', type: 'date', confidence: 92, value: '2025/03/15', bbox: [400, 120, 500, 145] },
        { id: 3, name: '支払期限', type: 'date', confidence: 88, value: '2025/04/15', bbox: [400, 160, 500, 185] },
        { id: 4, name: '請求先', type: 'text', confidence: 90, value: '株式会社サンプル', bbox: [100, 200, 350, 225] },
        { id: 5, name: '小計', type: 'currency', confidence: 94, value: '50,000', bbox: [450, 400, 550, 425] },
        { id: 6, name: '消費税', type: 'currency', confidence: 93, value: '5,000', bbox: [450, 440, 550, 465] },
        { id: 7, name: '合計金額', type: 'currency', confidence: 96, value: '55,000', bbox: [450, 480, 550, 505] },
      ];
      
      setMatchedTemplate(mockTemplate);
      setConfidence(mockTemplate.confidence);
      setDetectedFields(mockFields);
      setAnalyzing(false);
      setAnalysisComplete(true);
    }, 3000);
  };
  
  // 信頼度に基づく色を取得
  const getConfidenceColor = (confidence: number) => {
    if (confidence >= 90) return 'text-green-600';
    if (confidence >= 75) return 'text-yellow-600';
    return 'text-red-600';
  };
  
  return (
    <DashboardLayout>
      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          <h1 className="text-2xl font-semibold text-gray-900">レイアウト解析</h1>
          <p className="mt-1 text-sm text-gray-500">
            PDFや画像をアップロードして、自動的にレイアウトを解析し、適切なテンプレートとフィールドを検出します。
          </p>
          
          {/* ファイルアップロード部分 */}
          <div className="mt-6 flex flex-col md:flex-row gap-6">
            <div className="w-full md:w-1/2">
              <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                <div className="px-4 py-5 sm:px-6">
                  <h3 className="text-lg leading-6 font-medium text-gray-900">ドキュメントアップロード</h3>
                </div>
                <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
                  <div className="flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-md border-gray-300">
                    <div className="space-y-1 text-center">
                      <DocumentMagnifyingGlassIcon className="mx-auto h-12 w-12 text-gray-400" />
                      <div className="flex text-sm text-gray-600">
                        <label
                          htmlFor="file-upload"
                          className="relative cursor-pointer bg-white rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
                        >
                          <span>ファイルを選択</span>
                          <input
                            id="file-upload"
                            name="file-upload"
                            type="file"
                            className="sr-only"
                            accept=".pdf,.jpg,.jpeg,.png"
                            onChange={handleFileChange}
                            disabled={analyzing}
                          />
                        </label>
                        <p className="pl-1">またはドラッグ&ドロップ</p>
                      </div>
                      <p className="text-xs text-gray-500">
                        PDF, JPG, PNG (最大10MB)
                      </p>
                    </div>
                  </div>
                  
                  {selectedFile && (
                    <div className="mt-4">
                      <p className="text-sm font-medium text-gray-900">選択されたファイル:</p>
                      <p className="text-sm text-gray-500">{selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)</p>
                      
                      <div className="mt-4">
                        <Button
                          onClick={analyzeLayout}
                          disabled={analyzing}
                          className="w-full flex justify-center items-center"
                        >
                          {analyzing ? (
                            <>
                              <ArrowPathIcon className="h-5 w-5 mr-2 animate-spin" />
                              解析中...
                            </>
                          ) : (
                            <>
                              <DocumentMagnifyingGlassIcon className="h-5 w-5 mr-2" />
                              レイアウト解析を実行
                            </>
                          )}
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              {/* 解析結果 - テンプレートマッチング */}
              {analysisComplete && matchedTemplate && (
                <div className="mt-6 bg-white shadow overflow-hidden sm:rounded-lg">
                  <div className="px-4 py-5 sm:px-6">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">テンプレートマッチング結果</h3>
                  </div>
                  <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
                    <div className="flex items-center">
                      <DocumentDuplicateIcon className="h-10 w-10 text-indigo-600 mr-4" />
                      <div>
                        <p className="text-lg font-medium text-gray-900">{matchedTemplate.name}</p>
                        <div className="flex items-center mt-1">
                          <p className="text-sm text-gray-500 mr-2">信頼度:</p>
                          <p className={`text-sm font-medium ${getConfidenceColor(confidence)}`}>
                            {confidence}%
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-4">
                      <Button
                        variant="outline"
                        className="w-full"
                        onClick={() => window.location.href = `/templates/${matchedTemplate.id}`}
                      >
                        テンプレート詳細を表示
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            {/* プレビューと検出フィールド */}
            <div className="w-full md:w-1/2">
              {previewUrl && (
                <div className="bg-white shadow overflow-hidden sm:rounded-lg">
                  <div className="px-4 py-5 sm:px-6">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">ドキュメントプレビュー</h3>
                  </div>
                  <div className="border-t border-gray-200">
                    <div className="relative">
                      <img
                        src={previewUrl}
                        alt="Document preview"
                        className="w-full h-auto"
                      />
                      
                      {/* 検出されたフィールドの視覚化（実際の実装ではバウンディングボックスを表示） */}
                      {analysisComplete && detectedFields.map(field => (
                        <div
                          key={field.id}
                          className="absolute border-2 border-indigo-500"
                          style={{
                            left: `${field.bbox[0]}px`,
                            top: `${field.bbox[1]}px`,
                            width: `${field.bbox[2] - field.bbox[0]}px`,
                            height: `${field.bbox[3] - field.bbox[1]}px`,
                          }}
                        >
                          <div className="absolute -top-6 left-0 bg-indigo-500 text-white text-xs px-1 py-0.5 rounded">
                            {field.name}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
              
              {/* 検出されたフィールド一覧 */}
              {analysisComplete && detectedFields.length > 0 && (
                <div className="mt-6 bg-white shadow overflow-hidden sm:rounded-lg">
                  <div className="px-4 py-5 sm:px-6">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">検出されたフィールド</h3>
                  </div>
                  <div className="border-t border-gray-200">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            フィールド名
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            タイプ
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            検出値
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            信頼度
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {detectedFields.map(field => (
                          <tr key={field.id}>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                              {field.name}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                              {field.type}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                              {field.value}
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                              <span className={getConfidenceColor(field.confidence)}>
                                {field.confidence}%
                              </span>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>
          </div>
          
          {/* 解析完了後のアクション */}
          {analysisComplete && (
            <div className="mt-6 flex justify-end space-x-4">
              <Button
                variant="outline"
                onClick={() => {
                  setSelectedFile(null);
                  setPreviewUrl(null);
                  setAnalyzing(false);
                  setAnalysisComplete(false);
                  setMatchedTemplate(null);
                  setConfidence(0);
                  setDetectedFields([]);
                }}
              >
                キャンセル
              </Button>
              <Button
                className="flex items-center"
                onClick={() => {
                  // 実際の実装では検出結果を保存
                  alert('解析結果が保存されました');
                }}
              >
                <CheckCircleIcon className="h-5 w-5 mr-2" />
                解析結果を保存
              </Button>
            </div>
          )}
          
          {/* レイアウト解析の説明 */}
          <div className="mt-10">
            <h2 className="text-lg font-medium text-gray-900">レイアウト解析について</h2>
            <div className="mt-4 bg-white shadow overflow-hidden sm:rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-md font-medium text-gray-900 mb-3">レイアウト解析の仕組み</h3>
                <p className="text-sm text-gray-500 mb-4">
                  レイアウト解析モジュールは、アップロードされたドキュメントを分析し、以下の処理を行います：
                </p>
                <ol className="list-decimal pl-5 space-y-2 text-sm text-gray-500">
                  <li>ドキュメントの前処理（傾き補正、ノイズ除去など）</li>
                  <li>テキストブロックと画像領域の検出</li>
                  <li>登録済みテンプレートとのマッチング</li>
                  <li>フィールド位置の特定と値の抽出</li>
                  <li>抽出された値の検証と信頼度スコアの計算</li>
                </ol>
                
                <h3 className="text-md font-medium text-gray-900 mt-6 mb-3">精度向上のヒント</h3>
                <ul className="list-disc pl-5 space-y-2 text-sm text-gray-500">
                  <li>高解像度のスキャンまたは画像を使用する（300 DPI以上推奨）</li>
                  <li>ドキュメントが傾いていないことを確認する</li>
                  <li>十分な明るさとコントラストがあることを確認する</li>
                  <li>同じタイプのドキュメントを複数登録して学習データを増やす</li>
                  <li>フィールドのバリデーションルールを適切に設定する</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
