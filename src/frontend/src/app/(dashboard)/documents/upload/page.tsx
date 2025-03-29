import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/Button';
import { useState } from 'react';
import { 
  ArrowUpTrayIcon,
  DocumentTextIcon,
  XMarkIcon
} from '@heroicons/react/24/outline';

export default function DocumentUploadPage() {
  const [files, setFiles] = useState<File[]>([]);
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<{[key: string]: number}>({});
  
  // ドラッグ&ドロップハンドラー
  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };
  
  // ドロップハンドラー
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFiles(e.dataTransfer.files);
    }
  };
  
  // ファイル選択ハンドラー
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    
    if (e.target.files && e.target.files.length > 0) {
      handleFiles(e.target.files);
    }
  };
  
  // ファイル処理
  const handleFiles = (fileList: FileList) => {
    const newFiles = Array.from(fileList).filter(file => 
      file.type === 'application/pdf' || 
      file.type === 'image/jpeg' || 
      file.type === 'image/png'
    );
    
    setFiles(prevFiles => [...prevFiles, ...newFiles]);
  };
  
  // ファイル削除
  const removeFile = (index: number) => {
    setFiles(prevFiles => prevFiles.filter((_, i) => i !== index));
  };
  
  // アップロード処理
  const handleUpload = async () => {
    if (files.length === 0) return;
    
    setUploading(true);
    
    // 各ファイルの初期進捗状態を設定
    const initialProgress = files.reduce((acc, file) => {
      acc[file.name] = 0;
      return acc;
    }, {} as {[key: string]: number});
    
    setUploadProgress(initialProgress);
    
    // 実際の実装ではAPIにファイルをアップロード
    // ここではモックの進捗表示のみ実装
    for (let i = 0; i <= 100; i += 10) {
      await new Promise(resolve => setTimeout(resolve, 300));
      
      // すべてのファイルの進捗を更新
      setUploadProgress(prev => {
        const updated = { ...prev };
        files.forEach(file => {
          updated[file.name] = i;
        });
        return updated;
      });
    }
    
    // アップロード完了後、ファイルリストをクリア
    setTimeout(() => {
      setFiles([]);
      setUploading(false);
      setUploadProgress({});
      
      // 実際の実装ではドキュメント一覧ページにリダイレクト
      // window.location.href = '/documents';
    }, 1000);
  };
  
  return (
    <DashboardLayout>
      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          <h1 className="text-2xl font-semibold text-gray-900">ドキュメントアップロード</h1>
          
          {/* ドラッグ&ドロップエリア */}
          <div 
            className={`mt-6 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-md ${
              dragActive ? 'border-indigo-500 bg-indigo-50' : 'border-gray-300'
            }`}
            onDragEnter={handleDrag}
            onDragOver={handleDrag}
            onDragLeave={handleDrag}
            onDrop={handleDrop}
          >
            <div className="space-y-1 text-center">
              <ArrowUpTrayIcon className="mx-auto h-12 w-12 text-gray-400" />
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
                    multiple
                    onChange={handleChange}
                    disabled={uploading}
                  />
                </label>
                <p className="pl-1">またはドラッグ&ドロップ</p>
              </div>
              <p className="text-xs text-gray-500">
                PDF, JPG, PNG (最大10MB)
              </p>
            </div>
          </div>
          
          {/* 選択されたファイル一覧 */}
          {files.length > 0 && (
            <div className="mt-6">
              <h2 className="text-lg font-medium text-gray-900">選択されたファイル</h2>
              <ul className="mt-3 divide-y divide-gray-200 border-t border-b border-gray-200">
                {files.map((file, index) => (
                  <li key={`${file.name}-${index}`} className="py-3 flex justify-between items-center">
                    <div className="flex items-center">
                      <DocumentTextIcon className="h-5 w-5 text-gray-400 mr-3" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">{file.name}</p>
                        <p className="text-sm text-gray-500">{(file.size / 1024 / 1024).toFixed(2)} MB</p>
                      </div>
                    </div>
                    
                    {uploading ? (
                      <div className="w-1/3">
                        <div className="bg-gray-200 rounded-full h-2.5">
                          <div 
                            className="bg-indigo-600 h-2.5 rounded-full" 
                            style={{ width: `${uploadProgress[file.name] || 0}%` }}
                          ></div>
                        </div>
                        <p className="text-xs text-gray-500 text-right mt-1">
                          {uploadProgress[file.name] || 0}%
                        </p>
                      </div>
                    ) : (
                      <button
                        type="button"
                        className="text-gray-400 hover:text-gray-500"
                        onClick={() => removeFile(index)}
                      >
                        <XMarkIcon className="h-5 w-5" />
                      </button>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          {/* アップロードボタン */}
          {files.length > 0 && (
            <div className="mt-6 flex justify-end">
              <Button
                onClick={handleUpload}
                disabled={uploading}
                className="flex items-center"
              >
                <ArrowUpTrayIcon className="h-5 w-5 mr-2" />
                {uploading ? 'アップロード中...' : 'アップロード'}
              </Button>
            </div>
          )}
          
          {/* アップロード手順 */}
          <div className="mt-10">
            <h2 className="text-lg font-medium text-gray-900">アップロード手順</h2>
            <div className="mt-4 bg-white shadow overflow-hidden sm:rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <ol className="list-decimal pl-5 space-y-3">
                  <li className="text-sm text-gray-700">
                    PDFファイルまたは画像ファイル（JPG、PNG）を選択またはドラッグ&ドロップします。
                  </li>
                  <li className="text-sm text-gray-700">
                    「アップロード」ボタンをクリックして、ファイルをアップロードします。
                  </li>
                  <li className="text-sm text-gray-700">
                    アップロードが完了すると、OCR処理が自動的に開始されます。
                  </li>
                  <li className="text-sm text-gray-700">
                    処理が完了したら、ドキュメント一覧ページで結果を確認できます。
                  </li>
                  <li className="text-sm text-gray-700">
                    必要に応じて、認識結果を修正することができます。
                  </li>
                </ol>
              </div>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
