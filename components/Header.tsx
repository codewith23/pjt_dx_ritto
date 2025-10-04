import React from 'react';

interface HeaderProps {
  title: string;
  userEmail?: string;
  onLogout?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ title, userEmail, onLogout }) => {
  return (
    <header className="no-print bg-white shadow-sm z-10">
      <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-slate-900">{title}</h1>
        {userEmail && onLogout && (
          <div className="flex items-center space-x-4">
            <span className="text-sm text-slate-600 hidden sm:block">{userEmail}</span>
            <button
              onClick={onLogout}
              className="bg-slate-200 text-slate-700 px-3 py-1.5 rounded-md hover:bg-slate-300 text-sm font-medium transition-colors"
            >
              ログアウト
            </button>
          </div>
        )}
      </div>
    </header>
  );
};