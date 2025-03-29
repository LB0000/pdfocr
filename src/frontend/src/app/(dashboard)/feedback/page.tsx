import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Button } from '@/components/ui/Button';
import { 
  ChatBubbleLeftRightIcon, 
  PaperAirplaneIcon,
  StarIcon
} from '@heroicons/react/24/outline';

// フィードバックシステムのUIコンポーネント
export default function FeedbackPage() {
  const [feedbackType, setFeedbackType] = useState('suggestion');
  const [feedbackText, setFeedbackText] = useState('');
  const [rating, setRating] = useState(0);
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  
  // フィードバックの送信
  const submitFeedback = () => {
    if (!feedbackText.trim()) {
      alert('フィードバック内容を入力してください');
      return;
    }
    
    setSubmitting(true);
    
    // 実際の実装ではAPIにフィードバックを送信
    setTimeout(() => {
      // 送信完了
      setSubmitting(false);
      setSubmitted(true);
      
      // フォームをリセット
      setTimeout(() => {
        setFeedbackText('');
        setRating(0);
        setSubmitted(false);
      }, 3000);
    }, 1500);
  };
  
  return (
    <DashboardLayout>
      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          <h1 className="text-2xl font-semibold text-gray-900">フィードバック</h1>
          <p className="mt-1 text-sm text-gray-500">
            システムの改善にご協力ください。ご意見、ご要望、バグ報告などをお寄せください。
          </p>
          
          {/* フィードバックフォーム */}
          <div className="mt-6 bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">フィードバックフォーム</h3>
            </div>
            <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
              {submitted ? (
                <div className="rounded-md bg-green-50 p-4">
                  <div className="flex">
                    <div className="flex-shrink-0">
                      <svg className="h-5 w-5 text-green-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                      </svg>
                    </div>
                    <div className="ml-3">
                      <h3 className="text-sm font-medium text-green-800">フィードバックを送信しました</h3>
                      <div className="mt-2 text-sm text-green-700">
                        <p>ご意見ありがとうございます。いただいたフィードバックは今後のシステム改善に役立てさせていただきます。</p>
                      </div>
                    </div>
                  </div>
                </div>
              ) : (
                <form className="space-y-6">
                  {/* フィードバックタイプ */}
                  <div>
                    <label className="text-base font-medium text-gray-900">フィードバックの種類</label>
                    <p className="text-sm leading-5 text-gray-500">どのような内容のフィードバックですか？</p>
                    <fieldset className="mt-4">
                      <div className="space-y-4 sm:flex sm:items-center sm:space-y-0 sm:space-x-10">
                        <div className="flex items-center">
                          <input
                            id="feedback-suggestion"
                            name="feedback-type"
                            type="radio"
                            checked={feedbackType === 'suggestion'}
                            onChange={() => setFeedbackType('suggestion')}
                            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                          />
                          <label htmlFor="feedback-suggestion" className="ml-3 block text-sm font-medium text-gray-700">
                            機能改善の提案
                          </label>
                        </div>
                        <div className="flex items-center">
                          <input
                            id="feedback-bug"
                            name="feedback-type"
                            type="radio"
                            checked={feedbackType === 'bug'}
                            onChange={() => setFeedbackType('bug')}
                            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                          />
                          <label htmlFor="feedback-bug" className="ml-3 block text-sm font-medium text-gray-700">
                            バグ報告
                          </label>
                        </div>
                        <div className="flex items-center">
                          <input
                            id="feedback-other"
                            name="feedback-type"
                            type="radio"
                            checked={feedbackType === 'other'}
                            onChange={() => setFeedbackType('other')}
                            className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                          />
                          <label htmlFor="feedback-other" className="ml-3 block text-sm font-medium text-gray-700">
                            その他
                          </label>
                        </div>
                      </div>
                    </fieldset>
                  </div>
                  
                  {/* 評価 */}
                  <div>
                    <label className="text-base font-medium text-gray-900">システム評価</label>
                    <p className="text-sm leading-5 text-gray-500">現在のシステムにどの程度満足していますか？</p>
                    <div className="mt-4 flex items-center">
                      {[1, 2, 3, 4, 5].map((star) => (
                        <button
                          key={star}
                          type="button"
                          onClick={() => setRating(star)}
                          className={`${
                            rating >= star ? 'text-yellow-400' : 'text-gray-300'
                          } hover:text-yellow-400 focus:outline-none focus:ring-0`}
                        >
                          <StarIcon className="h-8 w-8 fill-current" />
                        </button>
                      ))}
                      <span className="ml-2 text-sm text-gray-500">
                        {rating > 0 ? `${rating}点` : '評価なし'}
                      </span>
                    </div>
                  </div>
                  
                  {/* フィードバック内容 */}
                  <div>
                    <label htmlFor="feedback-content" className="block text-sm font-medium text-gray-700">
                      フィードバック内容
                    </label>
                    <div className="mt-1">
                      <textarea
                        id="feedback-content"
                        name="feedback-content"
                        rows={5}
                        className="shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block w-full sm:text-sm border-gray-300 rounded-md"
                        placeholder="ご意見、ご要望、バグ報告などを詳しくお書きください..."
                        value={feedbackText}
                        onChange={(e) => setFeedbackText(e.target.value)}
                      />
                    </div>
                  </div>
                  
                  {/* 送信ボタン */}
                  <div className="flex justify-end">
                    <Button
                      type="button"
                      onClick={submitFeedback}
                      disabled={submitting}
                      className="flex items-center"
                    >
                      {submitting ? (
                        <>
                          <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                          送信中...
                        </>
                      ) : (
                        <>
                          <PaperAirplaneIcon className="h-5 w-5 mr-2" />
                          フィードバックを送信
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              )}
            </div>
          </div>
          
          {/* フィードバックの活用方法 */}
          <div className="mt-10">
            <h2 className="text-lg font-medium text-gray-900">フィードバックの活用方法</h2>
            <div className="mt-4 bg-white shadow overflow-hidden sm:rounded-lg">
              <div className="px-4 py-5 sm:p-6">
                <h3 className="text-md font-medium text-gray-900 mb-3">いただいたフィードバックの取り扱い</h3>
                <p className="text-sm text-gray-500 mb-4">
                  ユーザーの皆様からいただいたフィードバックは、以下のように活用させていただきます：
                </p>
                <ul className="list-disc pl-5 space-y-2 text-sm text-gray-500">
                  <li>システムの機能改善や新機能の開発の参考資料</li>
                  <li>バグ修正の優先順位付けや対応方針の決定</li>
                  <li>ユーザーインターフェースの使いやすさの向上</li>
                  <li>OCR精度向上のための学習データとしての活用</li>
                  <li>今後のロードマップ策定の参考情報</li>
                </ul>
                
                <h3 className="text-md font-medium text-gray-900 mt-6 mb-3">フィードバックの流れ</h3>
                <ol className="list-decimal pl-5 space-y-2 text-sm text-gray-500">
                  <li>ユーザーからのフィードバック受付</li>
                  <li>開発チームによる内容確認と分類</li>
                  <li>対応方針の決定（即時対応、次期リリースでの対応、長期検討など）</li>
                  <li>必要に応じてユーザーへの追加情報のヒアリング</li>
                  <li>開発・修正作業の実施</li>
                  <li>リリースノートでの対応内容の公開</li>
                </ol>
              </div>
            </div>
          </div>
          
          {/* よくあるフィードバック */}
          <div className="mt-6 bg-white shadow overflow-hidden sm:rounded-lg">
            <div className="px-4 py-5 sm:px-6">
              <h3 className="text-lg leading-6 font-medium text-gray-900">よくあるフィードバックと対応状況</h3>
            </div>
            <div className="border-t border-gray-200">
              <dl>
                <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">OCR精度の向上</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    <div className="flex items-center">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-yellow-100 text-yellow-800">
                        対応中
                      </span>
                      <span className="ml-2">機械学習モデルの改善と辞書データの拡充を進めています。次回アップデートで精度向上を予定しています。</span>
                    </div>
                  </dd>
                </div>
                <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">一括処理機能</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    <div className="flex items-center">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        実装予定
                      </span>
                      <span className="ml-2">複数ドキュメントの一括処理機能は次期メジャーアップデートで実装予定です。</span>
                    </div>
                  </dd>
                </div>
                <div className="bg-gray-50 px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">モバイル対応</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    <div className="flex items-center">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-blue-100 text-blue-800">
                        検討中
                      </span>
                      <span className="ml-2">モバイルアプリの開発を検討中です。現在はレスポンシブデザインによるモバイルブラウザ対応を強化しています。</span>
                    </div>
                  </dd>
                </div>
                <div className="bg-white px-4 py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                  <dt className="text-sm font-medium text-gray-500">外部システム連携</dt>
                  <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">
                    <div className="flex items-center">
                      <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                        実装済み
                      </span>
                      <span className="ml-2">REST APIによる外部システム連携機能を実装しました。APIドキュメントは管理者向けページで確認できます。</span>
                    </div>
                  </dd>
                </div>
              </dl>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
