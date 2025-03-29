import { useForm } from 'react-hook-form';
import { useState } from 'react';
import { useAuth } from '@/context/AuthContext';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

interface LoginFormData {
  email: string;
  password: string;
}

export default function LoginForm() {
  const { login, error: authError } = useAuth();
  const [isLoading, setIsLoading] = useState(false);
  
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>();
  
  const onSubmit = async (data: LoginFormData) => {
    setIsLoading(true);
    try {
      await login(data.email, data.password);
      // ログイン成功時はダッシュボードにリダイレクト
      window.location.href = '/dashboard';
    } catch (error) {
      // エラーはAuthContextで処理されるため、ここでは何もしない
      console.error('Login error:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
      <div className="text-center">
        <h1 className="text-2xl font-bold">PDF2MD拡張システム</h1>
        <p className="mt-2 text-gray-600">アカウントにログイン</p>
      </div>
      
      {authError && (
        <div className="p-3 text-sm text-red-500 bg-red-50 rounded-md">
          {authError}
        </div>
      )}
      
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
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
            autoComplete="current-password"
            error={errors.password?.message}
            {...register('password', {
              required: 'パスワードは必須です',
              minLength: {
                value: 8,
                message: 'パスワードは8文字以上である必要があります',
              },
            })}
          />
        </div>
        
        <div>
          <Button
            type="submit"
            className="w-full"
            isLoading={isLoading}
            disabled={isLoading}
          >
            ログイン
          </Button>
        </div>
      </form>
      
      <div className="text-center text-sm">
        <a href="#" className="text-blue-600 hover:text-blue-800">
          パスワードをお忘れですか？
        </a>
      </div>
    </div>
  );
}
