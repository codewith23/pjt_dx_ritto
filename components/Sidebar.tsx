import React from 'react';
import { AppView } from '../types';

interface SidebarProps {
  currentView: AppView;
  setView: (view: AppView) => void;
}

const NavItem: React.FC<{
  view: AppView;
  currentView: AppView;
  setView: (view: AppView) => void;
  icon: React.ReactNode;
  label: string;
}> = ({ view, currentView, setView, icon, label }) => {
  const isActive = currentView === view;
  return (
    <li>
      <button
        onClick={() => setView(view)}
        className={`flex items-center p-3 my-1 w-full text-base font-normal rounded-lg transition duration-75 group ${
          isActive
            ? 'bg-blue-600 text-white shadow-lg'
            : 'text-gray-200 hover:bg-slate-700'
        }`}
      >
        {icon}
        <span className="ml-3 flex-1 whitespace-nowrap">{label}</span>
      </button>
    </li>
  );
};

export const Sidebar: React.FC<SidebarProps> = ({ currentView, setView }) => {
  return (
    <aside className="no-print w-64 bg-slate-800 text-white flex-col flex transition-width duration-300">
      <div className="px-4 py-6">
        <h2 className="text-2xl font-bold text-center">請求管理</h2>
        <p className="text-sm text-slate-400 text-center">for Craftsmen</p>
      </div>
      <div className="flex-1 px-3">
        <ul className="space-y-2">
          <NavItem
            view="dashboard"
            currentView={currentView}
            setView={setView}
            label="ダッシュボード"
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path></svg>
            }
          />
          <NavItem
            view="schedule"
            currentView={currentView}
            setView={setView}
            label="スケジュール"
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>
            }
          />
          <NavItem
            view="clients"
            currentView={currentView}
            setView={setView}
            label="元請先管理"
            icon={
             <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>
            }
          />
          <NavItem
            view="invoices"
            currentView={currentView}
            setView={setView}
            label="請求書作成"
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"></path></svg>
            }
          />
        </ul>
      </div>
      <div className="px-3 pb-4">
        <ul className="space-y-2 pt-4 border-t border-slate-700">
           <NavItem
            view="settings"
            currentView={currentView}
            setView={setView}
            label="設定"
            icon={
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
            }
          />
        </ul>
      </div>
    </aside>
  );
};