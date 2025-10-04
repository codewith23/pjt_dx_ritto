import React, { useState } from 'react';

interface AuthViewProps {
  onLogin: (email: string, password: string) => Promise<any>;
  onSignup: (email: string, password: string) => Promise<any>;
}

const AuthView: React.FC<AuthViewProps> = ({ onLogin, onSignup }) => {
  const [isLoginView, setIsLoginView] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      if (isLoginView) {
        await onLogin(email, password);
      } else {
        await onSignup(email, password);
      }
    } catch (err: any) {
      setError(err.message || 'エラーが発生しました。');
    } finally {
      setLoading(false);
    }
  };

  const handleDemoLogin = async () => {
    setError('');
    setLoading(true);
    try {
      await onLogin('demo@example.com', 'password123');
    } catch (err: any) {
      setError(err.message || 'デモログインに失敗しました。');
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="flex items-center justify-center min-h-screen bg-slate-100">
      <div className="w-full max-w-md p-8 space-y-6 bg-white rounded-lg shadow-md mx-4">
        <div>
          <h2 className="text-3xl font-bold text-center text-slate-800">
            {isLoginView ? 'ログイン' : '新規登録'}
          </h2>
           <p className="text-sm text-slate-500 text-center mt-2">職人さんの請求管理へようこそ</p>
        </div>
        <form className="space-y-6" onSubmit={handleSubmit} noValidate>
          {error && <p className="p-3 text-sm text-red-700 bg-red-100 rounded-md">{error}</p>}
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-slate-700">
              メールアドレス
            </label>
            <div className="mt-1">
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-3 py-2 border rounded-md border-slate-300 placeholder-slate-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          <div>
            <label
              htmlFor="password"
              className="block text-sm font-medium text-slate-700"
            >
              パスワード
            </label>
            <div className="mt-1">
              <input
                id="password"
                name="password"
                type="password"
                autoComplete={isLoginView ? "current-password" : "new-password"}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-3 py-2 border rounded-md border-slate-300 placeholder-slate-400 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          <div>
            <button
              type="submit"
              disabled={loading || !email || !password}
              className="flex justify-center w-full px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-md shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-slate-400 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? '処理中...' : (isLoginView ? 'ログイン' : '登録する')}
            </button>
          </div>
        </form>

        <div className="relative my-4">
          <div className="absolute inset-0 flex items-center">
            <div className="w-full border-t border-slate-300" />
          </div>
          <div className="relative flex justify-center text-sm">
            <span className="px-2 bg-white text-slate-500">または</span>
          </div>
        </div>

        <div>
          <button
            type="button"
            onClick={handleDemoLogin}
            disabled={loading}
            className="flex justify-center w-full px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 border border-slate-300 rounded-md shadow-sm hover:bg-slate-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:bg-slate-300 disabled:cursor-not-allowed transition-colors"
          >
            デモユーザーでログイン
          </button>
        </div>

        <p className="text-sm text-center text-slate-600">
          {isLoginView ? 'アカウントをお持ちでないですか？' : '既にアカウントをお持ちですか？'}
          <button
            onClick={() => {
              setIsLoginView(!isLoginView);
              setError('');
              setEmail('');
              setPassword('');
            }}
            className="ml-1 font-medium text-blue-600 hover:text-blue-500"
          >
            {isLoginView ? '新規登録' : 'ログイン'}
          </button>
        </p>
      </div>
    </div>
  );
};

export default AuthView;