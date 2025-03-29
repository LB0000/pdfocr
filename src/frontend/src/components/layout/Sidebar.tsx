import { useAuth } from '@/context/AuthContext';
import { 
  HomeIcon, 
  DocumentTextIcon, 
  DocumentDuplicateIcon, 
  CogIcon,
  UserGroupIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline';
import { cn } from '@/lib/utils';
import { usePathname } from 'next/navigation';
import Link from 'next/link';

interface NavigationItem {
  name: string;
  href: string;
  icon: React.ForwardRefExoticComponent<React.SVGProps<SVGSVGElement>>;
  roles?: Array<'admin' | 'manager' | 'user'>;
}

export function Sidebar() {
  const { user } = useAuth();
  const pathname = usePathname();
  
  const navigation: NavigationItem[] = [
    { name: 'ダッシュボード', href: '/dashboard', icon: HomeIcon },
    { name: 'ドキュメント', href: '/documents', icon: DocumentTextIcon },
    { name: 'テンプレート', href: '/templates', icon: DocumentDuplicateIcon },
    { name: '統計', href: '/statistics', icon: ChartBarIcon, roles: ['admin', 'manager'] },
    { name: 'ユーザー管理', href: '/users', icon: UserGroupIcon, roles: ['admin'] },
    { name: '設定', href: '/settings', icon: CogIcon },
  ];
  
  // ユーザーのロールに基づいてナビゲーションをフィルタリング
  const filteredNavigation = navigation.filter(item => {
    if (!item.roles) return true;
    return user?.role && item.roles.includes(user.role);
  });
  
  return (
    <div className="hidden md:flex md:w-64 md:flex-col md:fixed md:inset-y-0">
      <div className="flex-1 flex flex-col min-h-0 bg-gray-800">
        <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
          <div className="flex items-center flex-shrink-0 px-4">
            <span className="text-white text-xl font-bold">PDF2MD拡張</span>
          </div>
          <nav className="mt-5 flex-1 px-2 space-y-1">
            {filteredNavigation.map((item) => {
              const isActive = pathname === item.href || pathname?.startsWith(`${item.href}/`);
              
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    isActive
                      ? 'bg-gray-900 text-white'
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white',
                    'group flex items-center px-2 py-2 text-sm font-medium rounded-md'
                  )}
                >
                  <item.icon
                    className={cn(
                      isActive
                        ? 'text-gray-300'
                        : 'text-gray-400 group-hover:text-gray-300',
                      'mr-3 flex-shrink-0 h-6 w-6'
                    )}
                    aria-hidden="true"
                  />
                  {item.name}
                </Link>
              );
            })}
          </nav>
        </div>
        <div className="flex-shrink-0 flex bg-gray-700 p-4">
          <div className="flex-shrink-0 w-full group block">
            <div className="flex items-center">
              <div className="h-9 w-9 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-800 font-medium">
                {user?.name?.charAt(0) || 'U'}
              </div>
              <div className="ml-3">
                <p className="text-sm font-medium text-white">{user?.name}</p>
                <p className="text-xs font-medium text-gray-300 group-hover:text-gray-200">
                  {user?.role === 'admin' ? '管理者' : user?.role === 'manager' ? '管理者' : 'ユーザー'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
