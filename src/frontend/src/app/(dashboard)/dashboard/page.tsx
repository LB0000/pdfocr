import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Card } from '@/components/ui/Card';
import { 
  DocumentTextIcon, 
  DocumentDuplicateIcon, 
  UserIcon,
  CheckCircleIcon,
  ClockIcon,
  ExclamationCircleIcon
} from '@heroicons/react/24/outline';

export default function DashboardPage() {
  // 実際の実装ではAPIからデータを取得します
  const stats = [
    { name: '処理済みドキュメント', value: '128', icon: DocumentTextIcon, color: 'bg-blue-500' },
    { name: 'テンプレート数', value: '12', icon: DocumentDuplicateIcon, color: 'bg-green-500' },
    { name: 'ユーザー数', value: '24', icon: UserIcon, color: 'bg-purple-500' },
  ];
  
  const recentDocuments = [
    { id: 1, name: '請求書_2025-03-01.pdf', status: 'completed', date: '2025/03/28' },
    { id: 2, name: '契約書_A社_2025-03-15.pdf', status: 'processing', date: '2025/03/29' },
    { id: 3, name: '見積書_B社_2025-03-20.pdf', status: 'error', date: '2025/03/29' },
    { id: 4, name: '納品書_C社_2025-03-25.pdf', status: 'completed', date: '2025/03/27' },
    { id: 5, name: '請求書_D社_2025-03-27.pdf', status: 'completed', date: '2025/03/26' },
  ];
  
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
  
  return (
    <DashboardLayout>
      <div className="py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          <h1 className="text-2xl font-semibold text-gray-900">ダッシュボード</h1>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
          {/* 統計カード */}
          <div className="mt-8 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {stats.map((stat) => (
              <Card key={stat.name} className="px-4 py-5 sm:p-6">
                <div className="flex items-center">
                  <div className={`flex-shrink-0 rounded-md p-3 ${stat.color}`}>
                    <stat.icon className="h-6 w-6 text-white" aria-hidden="true" />
                  </div>
                  <div className="ml-5 w-0 flex-1">
                    <dl>
                      <dt className="text-sm font-medium text-gray-500 truncate">{stat.name}</dt>
                      <dd>
                        <div className="text-lg font-medium text-gray-900">{stat.value}</div>
                      </dd>
                    </dl>
                  </div>
                </div>
              </Card>
            ))}
          </div>
          
          {/* 最近のドキュメント */}
          <div className="mt-8">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-medium text-gray-900">最近のドキュメント</h2>
              <a href="/documents" className="text-sm font-medium text-indigo-600 hover:text-indigo-500">
                すべて表示
              </a>
            </div>
            
            <div className="mt-4 bg-white shadow overflow-hidden sm:rounded-md">
              <ul role="list" className="divide-y divide-gray-200">
                {recentDocuments.map((document) => (
                  <li key={document.id}>
                    <a href={`/documents/${document.id}`} className="block hover:bg-gray-50">
                      <div className="px-4 py-4 sm:px-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <DocumentTextIcon className="h-5 w-5 text-gray-400 mr-3" />
                            <p className="text-sm font-medium text-indigo-600 truncate">{document.name}</p>
                          </div>
                          <div className="ml-2 flex-shrink-0 flex">
                            <div className="flex items-center">
                              {getStatusIcon(document.status)}
                              <p className="ml-1 text-sm text-gray-500">{getStatusText(document.status)}</p>
                            </div>
                          </div>
                        </div>
                        <div className="mt-2 sm:flex sm:justify-between">
                          <div className="sm:flex">
                            <p className="flex items-center text-sm text-gray-500">
                              処理日: {document.date}
                            </p>
                          </div>
                        </div>
                      </div>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
