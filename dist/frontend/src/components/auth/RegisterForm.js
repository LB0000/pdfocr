"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.default = RegisterForm;
const AuthContext_1 = require("@/context/AuthContext");
const react_1 = require("react");
const navigation_1 = require("next/navigation");
function RegisterForm() {
    const [name, setName] = (0, react_1.useState)('');
    const [email, setEmail] = (0, react_1.useState)('');
    const [password, setPassword] = (0, react_1.useState)('');
    const [confirmPassword, setConfirmPassword] = (0, react_1.useState)('');
    const [isLoading, setIsLoading] = (0, react_1.useState)(false);
    const [errorMessage, setErrorMessage] = (0, react_1.useState)('');
    const { register } = (0, AuthContext_1.useAuth)();
    const router = (0, navigation_1.useRouter)();
    const handleSubmit = async (e) => {
        e.preventDefault();
        setIsLoading(true);
        setErrorMessage('');
        // パスワード確認
        if (password !== confirmPassword) {
            setErrorMessage('パスワードが一致しません');
            setIsLoading(false);
            return;
        }
        try {
            await register(name, email, password);
            router.push('/dashboard');
        }
        catch (error) {
            setErrorMessage(error.message || '登録に失敗しました');
        }
        finally {
            setIsLoading(false);
        }
    };
    return (<div className="w-full max-w-md p-8 space-y-8 bg-white rounded-lg shadow-md">
      <div className="text-center">
        <h1 className="text-2xl font-bold">PDF2MD システム</h1>
        <p className="mt-2 text-gray-600">新規アカウント登録</p>
      </div>
      
      {errorMessage && (<div className="p-4 text-red-700 bg-red-100 rounded-md">
          {errorMessage}
        </div>)}
      
      <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
        <div>
          <label htmlFor="name" className="block text-sm font-medium text-gray-700">
            名前
          </label>
          <input id="name" name="name" type="text" required value={name} onChange={(e) => setName(e.target.value)} className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"/>
        </div>
        
        <div>
          <label htmlFor="email" className="block text-sm font-medium text-gray-700">
            メールアドレス
          </label>
          <input id="email" name="email" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"/>
        </div>
        
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700">
            パスワード
          </label>
          <input id="password" name="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"/>
        </div>
        
        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
            パスワード（確認）
          </label>
          <input id="confirmPassword" name="confirmPassword" type="password" required value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="block w-full px-3 py-2 mt-1 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"/>
        </div>
        
        <div>
          <button type="submit" disabled={isLoading} className="flex justify-center w-full px-4 py-2 text-sm font-medium text-white bg-indigo-600 border border-transparent rounded-md shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50">
            {isLoading ? '登録中...' : '登録する'}
          </button>
        </div>
        
        <div className="text-sm text-center">
          <a href="/login" className="font-medium text-indigo-600 hover:text-indigo-500">
            すでにアカウントをお持ちの方はこちら
          </a>
        </div>
      </form>
    </div>);
}
//# sourceMappingURL=RegisterForm.js.map