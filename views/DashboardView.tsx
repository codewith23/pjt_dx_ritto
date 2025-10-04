import React from 'react';
import { AppState } from '../types';

interface DashboardViewProps {
    appData: AppState;
}

const StatCard: React.FC<{ title: string; value: string | number; icon: React.ReactNode }> = ({ title, value, icon }) => (
    <div className="bg-white p-6 rounded-lg shadow-md flex items-center space-x-4">
        <div className="bg-blue-100 text-blue-600 p-3 rounded-full">
            {icon}
        </div>
        <div>
            <p className="text-sm text-slate-500">{title}</p>
            <p className="text-2xl font-bold text-slate-800">{value}</p>
        </div>
    </div>
);

const ClosingDayAlerts: React.FC<{ appData: AppState }> = ({ appData }) => {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Ignore time part for date comparison

    const upcomingClosingDays = appData.clients
        .map(client => {
            const closingDay = client.closingDay;
            let closingDateThisMonth: Date;

            if (closingDay === 99) { // End of month
                closingDateThisMonth = new Date(today.getFullYear(), today.getMonth() + 1, 0);
            } else {
                closingDateThisMonth = new Date(today.getFullYear(), today.getMonth(), closingDay);
            }

            // If it has already passed this month, check next month's closing day
            if (closingDateThisMonth < today) {
                if (closingDay === 99) {
                    closingDateThisMonth = new Date(today.getFullYear(), today.getMonth() + 2, 0);
                } else {
                    closingDateThisMonth = new Date(today.getFullYear(), today.getMonth() + 1, closingDay);
                }
            }
            
            const diffTime = closingDateThisMonth.getTime() - today.getTime();
            const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

            if (diffDays >= 0 && diffDays <= 5) { // Alert for deadlines within 5 days
                return {
                    clientId: client.id,
                    clientName: client.name,
                    closingDate: closingDateThisMonth.toLocaleDateString('ja-JP', { month: 'long', day: 'numeric' }),
                    daysRemaining: diffDays
                };
            }
            return null;
        })
        .filter((item): item is NonNullable<typeof item> => item !== null)
        .sort((a,b) => a.daysRemaining - b.daysRemaining);

    if (upcomingClosingDays.length === 0) {
        return null;
    }

    return (
        <div className="bg-amber-100 border-l-4 border-amber-500 text-amber-800 p-4 rounded-lg shadow-md" role="alert">
            <div className="flex items-center">
                 <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-3 text-amber-500" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                </svg>
                <p className="font-bold">締め日アラート</p>
            </div>
            <ul className="mt-2 list-disc list-inside space-y-1 text-sm">
                {upcomingClosingDays.map(alert => (
                    <li key={alert.clientId}>
                        <span className="font-semibold">{alert.clientName}</span> - 締め日: {alert.closingDate} (あと{alert.daysRemaining}日)
                    </li>
                ))}
            </ul>
        </div>
    );
};


const DashboardView: React.FC<DashboardViewProps> = ({ appData }) => {
    const { clients, workEntries } = appData;
    
    const upcomingWork = workEntries.filter(entry => new Date(entry.date) >= new Date()).length;

    const totalRevenueThisMonth = workEntries.reduce((acc, entry) => {
        const entryDate = new Date(entry.date);
        const today = new Date();
        if (entryDate.getFullYear() === today.getFullYear() && entryDate.getMonth() === today.getMonth()) {
            return acc + (entry.quantity * entry.unitPrice);
        }
        return acc;
    }, 0);

    return (
        <div className="space-y-6">
            <ClosingDayAlerts appData={appData} />

            <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-2xl font-bold text-slate-800">ようこそ！</h2>
                <p className="mt-2 text-slate-600">あなたのビジネスの状況をここで確認できます。</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <StatCard 
                    title="登録元請先" 
                    value={`${clients.length} 社`}
                    icon={<svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"></path></svg>}
                />
                <StatCard 
                    title="今月の売上" 
                    value={`${totalRevenueThisMonth.toLocaleString()} 円`}
                    icon={<svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>}
                />
                 <StatCard 
                    title="今後の作業予定" 
                    value={`${upcomingWork} 件`}
                    icon={<svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path></svg>}
                />
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md">
                <h3 className="text-xl font-bold text-slate-800">クイックスタート</h3>
                <ol className="mt-4 list-decimal list-inside space-y-2 text-slate-600">
                    <li><span className="font-semibold">[元請先管理]</span> から取引先を登録します。</li>
                    <li><span className="font-semibold">[スケジュール]</span> に日々の作業内容と金額、時間を入力します。</li>
                    <li><span className="font-semibold">[請求書作成]</span> で元請先と対象月を選び、請求書を生成します。</li>
                </ol>
            </div>
        </div>
    );
};

export default DashboardView;
