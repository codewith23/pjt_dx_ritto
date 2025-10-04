import React, { useState } from 'react';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { BottomNav } from './components/BottomNav';
import { useAppData } from './hooks/useAppData';
import useAuth from './hooks/useAuth';
import DashboardView from './views/DashboardView';
import ClientsView from './views/ClientsView';
import ScheduleView from './views/ScheduleView';
import InvoicesView from './views/InvoicesView';
import SettingsView from './views/SettingsView';
import AuthView from './views/AuthView';
import { AppView } from './types';

const App: React.FC = () => {
  const { currentUser, login, signup, logout, loading } = useAuth();
  const [currentView, setCurrentView] = useState<AppView>('dashboard');
  const { state, dispatch } = useAppData(currentUser?.id);

  const renderView = () => {
    switch (currentView) {
      case 'dashboard':
        return <DashboardView appData={state} />;
      case 'schedule':
        return <ScheduleView appData={state} dispatch={dispatch} />;
      case 'clients':
        return <ClientsView appData={state} dispatch={dispatch} />;
      case 'invoices':
        return <InvoicesView appData={state} dispatch={dispatch} />;
      case 'settings':
        return <SettingsView appData={state} dispatch={dispatch} />;
      default:
        return <DashboardView appData={state} />;
    }
  };
  
  const viewTitles: Record<AppView, string> = {
    dashboard: 'ダッシュボード',
    schedule: 'スケジュール管理',
    clients: '元請先管理',
    invoices: '請求書作成',
    settings: '設定'
  };

  if (loading) {
      return (
          <div className="flex items-center justify-center h-screen bg-slate-100">
              <div className="text-xl text-slate-600">読み込み中...</div>
          </div>
      );
  }

  if (!currentUser) {
    return <AuthView onLogin={login} onSignup={signup} />;
  }

  return (
    <div className="flex h-screen bg-slate-100 text-slate-800">
      <div className="hidden md:flex">
        <Sidebar currentView={currentView} setView={setCurrentView} />
      </div>
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header title={viewTitles[currentView]} userEmail={currentUser.email} onLogout={logout} />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-slate-100 p-4 sm:p-6 lg:p-8 pb-24 md:pb-8">
          {renderView()}
        </main>
      </div>
      <BottomNav currentView={currentView} setView={setCurrentView} />
    </div>
  );
};

export default App;