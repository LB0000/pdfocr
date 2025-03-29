import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

interface RegisterFormData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  role?: 'admin' | 'manager' | 'user';
}

interface RegisterFormProps {
  showRoleSelection?: boolean;
  onSuccess?: () => void;
}

export default function RegisterForm({ showRoleSelection = false, onSuccess }: RegisterFormProps) {
  const { register: registerUser, error: authError } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm<RegisterFormData>({
    defaultValues: {
      role: 'user',
    },
  });
  
  const password = watch('password');
  
  const onSubmit = async (data: RegisterFormData) => {
    setIsLoading(true);
    try {
      const { confirmPassword, ...userData } = data;
      await registerUser(userData);
      if (onSuccess) {
        onSuccess();
      } else {
        // 登録成功時はログインページにリダイレクト
        window.location.href = '/login';
      }
    } catch (error) {
      // エラーはAuthContextで処理されるため、ここでは何もしない
      console.error('Registration error:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
      <div className="text-center">
        <h1 className="text-2xl font-bold">ユーザー登録</h1>
        <p className="mt-2 text-gray-600">新しいアカウントを作成</p>
      </div>
      
      {authError && (
        <div className="p-3 text-sm text-red-500 bg-red-50 rounded-md">
          {authError}
        </div>
      )}
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div>
          <Input
            id="name"
            label="名前"
            type="text"
            autoComplete="name"
            error={errors.name?.message}
            {...register('name', {
              required: '名前は必須です',
              minLength: {
                value: 2,
                message: '名前は2文字以上である必要があります',
              },
            })}
          />
        </div>
        
        <div>
          <Input
            id="email"
            label="メールアドレス"
            type="email"
            autoComplete="email"
            error={errors.email?.message}
            {...register('email', {
              required: 'メールアドレスは必須です',
              pattern: {
                value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                message: '有効なメールアドレスを入力してください',
              },
            })}
          />
        </div>
        
        <div>
          <Input
            id="password"
            label="パスワード"
            type="password"
            autoComplete="new-password"
            error={errors.password?.message}
            {...register('password', {
              required: 'パスワードは必須です',
              minLength: {
                value: 8,
                message: 'パスワードは8文字以上である必要があります',
              },
              pattern: {
                value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
                message: 'パスワードは少なくとも1つの大文字、小文字、数字、特殊文字を含む必要があります',
              },
            })}
          />
        </div>
        
        <div>
          <Input
            id="confirmPassword"
            label="パスワード（確認）"
            type="password"
            autoComplete="new-password"
            error={errors.confirmPassword?.message}
            {...register('confirmPassword', {
              required: 'パスワード確認は必須です',
              validate: value => value === password || 'パスワードが一致しません',
            })}
          />
        </div>
        
        {showRoleSelection && (
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              ロール
            </label>
            <select
              className="w-full h-10 rounded-md border border-input bg-background px-3 py-2 text-sm"
              {...register('role')}
            >
              <option value="user">一般ユーザー</option>
              <option value="manager">管理者</option>
              <option value="admin">システム管理者</option>
            </select>
          </div>
        )}
        
        <div>
          <Button
            type="submit"
            className="w-full"
            isLoading={isLoading}
            disabled={isLoading}
          >
            登録
          </Button>
        </div>
      </form>
      
      <div className="text-center text-sm">
        <span className="text-gray-600">すでにアカウントをお持ちですか？</span>{' '}
        <a href="/login" className="text-blue-600 hover:text-blue-800">
          ログイン
        </a>
      </div>
    </div>
  );
}
