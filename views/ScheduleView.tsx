import React, { useState, useMemo, useEffect } from 'react';
import { AppState, AppAction, WorkEntry, Client } from '../types';
import { Modal } from '../components/Modal';

interface ScheduleViewProps {
  appData: AppState;
  dispatch: React.Dispatch<AppAction>;
}

// Helper function to format a local date to YYYY-MM-DD
const toLocalDateString = (date: Date): string => {
  const year = date.getFullYear();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');
  return `${year}-${month}-${day}`;
};

const WorkEntryForm: React.FC<{
    entry?: WorkEntry | null;
    clients: Client[];
    selectedDate?: string;
    onSave: (entry: WorkEntry) => void;
    onClose: () => void;
    onDelete?: (id: string) => void;
}> = ({ entry, clients, selectedDate, onSave, onClose, onDelete }) => {
    const [date, setDate] = useState(entry?.date || selectedDate || toLocalDateString(new Date()));
    const [clientId, setClientId] = useState(entry?.clientId || (clients[0]?.id || ''));
    const [description, setDescription] = useState(entry?.description || '');
    const [quantity, setQuantity] = useState(entry?.quantity || 1);
    const [unit, setUnit] = useState(entry?.unit || '式');
    const [unitPrice, setUnitPrice] = useState(entry?.unitPrice || 0);
    const [expenses, setExpenses] = useState(entry?.expenses || 0);
    const [startTime, setStartTime] = useState(entry?.startTime || '');
    const [endTime, setEndTime] = useState(entry?.endTime || '');

    useEffect(() => {
        // 新規登録時のみ、元請先が選択されたら日当を自動入力する
        if (!entry && clientId) {
            const selectedClient = clients.find(c => c.id === clientId);
            if (selectedClient && typeof selectedClient.dailyRate === 'number' && selectedClient.dailyRate > 0) {
                setUnitPrice(selectedClient.dailyRate);
                setUnit('日');
                setQuantity(1);
            }
        }
    }, [clientId, clients, entry]);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!clientId) {
            alert('元請先を選択してください。');
            return;
        }
        onSave({
            id: entry?.id || crypto.randomUUID(),
            date,
            clientId,
            description,
            quantity,
            unit,
            unitPrice,
            expenses,
            startTime,
            endTime
        });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-slate-700">日付 <span className="text-red-500">*</span></label>
                    <input type="date" value={date} onChange={e => setDate(e.target.value)} required className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"/>
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700">元請先 <span className="text-red-500">*</span></label>
                    <select value={clientId} onChange={e => setClientId(e.target.value)} required className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm">
                        <option value="" disabled>選択してください</option>
                        {clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                    </select>
                </div>
            </div>
             <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                 <div>
                    <label className="block text-sm font-medium text-slate-700">開始時間</label>
                    <input type="time" value={startTime} onChange={e => setStartTime(e.target.value)} className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"/>
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700">終了時間</label>
                    <input type="time" value={endTime} onChange={e => setEndTime(e.target.value)} className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"/>
                </div>
            </div>
            <div>
                <label className="block text-sm font-medium text-slate-700">作業内容 <span className="text-red-500">*</span></label>
                <textarea value={description} onChange={e => setDescription(e.target.value)} required rows={3} className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"/>
            </div>
            <div className="grid grid-cols-3 gap-4">
                <div>
                    <label className="block text-sm font-medium text-slate-700">数量</label>
                    <input type="number" step="any" value={quantity} onChange={e => setQuantity(parseFloat(e.target.value))} className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"/>
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700">単位</label>
                    <input type="text" value={unit} onChange={e => setUnit(e.target.value)} list="units" className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"/>
                    <datalist id="units">
                        <option value="式" />
                        <option value="時間" />
                        <option value="日" />
                        <option value="件" />
                        <option value="m" />
                        <option value="m²" />
                    </datalist>
                </div>
                 <div>
                    <label className="block text-sm font-medium text-slate-700">単価</label>
                    <input type="number" step="any" value={unitPrice} onChange={e => setUnitPrice(parseFloat(e.target.value))} className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"/>
                </div>
            </div>
            <div>
                <label className="block text-sm font-medium text-slate-700">諸経費 (駐車場代など)</label>
                <input type="number" step="any" value={expenses} onChange={e => setExpenses(parseFloat(e.target.value) || 0)} className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"/>
            </div>
             <p className="text-right text-lg font-semibold text-slate-800">
                合計: {((quantity * unitPrice) + (expenses || 0)).toLocaleString()} 円
            </p>
            <div className="flex justify-between items-center pt-4">
                <div>
                    {entry && onDelete && (
                        <button
                            type="button"
                            onClick={() => onDelete(entry.id)}
                            className="bg-red-100 text-red-700 px-4 py-2 rounded-md hover:bg-red-200 transition-colors"
                        >
                            削除する
                        </button>
                    )}
                </div>
                <div className="flex justify-end space-x-3">
                    <button type="button" onClick={onClose} className="bg-slate-100 text-slate-700 px-4 py-2 rounded-md hover:bg-slate-200">キャンセル</button>
                    <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">保存</button>
                </div>
            </div>
        </form>
    );
};

type ViewMode = 'month' | 'week' | 'day';

const CalendarHeader: React.FC<{
    currentDate: Date;
    viewMode: ViewMode;
    onPrev: () => void;
    onNext: () => void;
    onToday: () => void;
    onSetViewMode: (mode: ViewMode) => void;
}> = ({ currentDate, viewMode, onPrev, onNext, onToday, onSetViewMode }) => {
    const formatHeader = () => {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth() + 1;
        switch(viewMode) {
            case 'month':
                return `${year}年 ${month}月`;
            case 'week':
                const start = new Date(currentDate);
                start.setDate(start.getDate() - start.getDay());
                const end = new Date(start);
                end.setDate(end.getDate() + 6);
                return `${start.getFullYear()}年${start.getMonth()+1}月${start.getDate()}日 - ${end.getMonth()+1}月${end.getDate()}日`;
            case 'day':
                 return `${year}年 ${month}月 ${currentDate.getDate()}日`;
        }
    }

    return (
        <div className="flex items-center justify-between p-2 md:p-4 border-b">
            <div className="flex items-center space-x-1 md:space-x-2">
                <button onClick={onPrev} className="p-2 rounded-md hover:bg-slate-100">&lt;</button>
                <button onClick={onNext} className="p-2 rounded-md hover:bg-slate-100">&gt;</button>
                <button onClick={onToday} className="px-2 md:px-4 py-2 text-sm font-medium border rounded-md hover:bg-slate-100">今日</button>
            </div>
             <h2 className="text-base md:text-lg font-semibold text-center">{formatHeader()}</h2>
            <div className="flex items-center space-x-1 bg-slate-100 p-1 rounded-lg">
                {(['month', 'week', 'day'] as ViewMode[]).map(mode => (
                    <button key={mode} onClick={() => onSetViewMode(mode)} className={`px-2 md:px-3 py-1 text-sm rounded-md ${viewMode === mode ? 'bg-white shadow' : 'text-slate-600 hover:bg-slate-200'}`}>
                       {{'month': '月', 'week': '週', 'day': '日'}[mode]}
                    </button>
                ))}
            </div>
        </div>
    );
}

const ScheduleView: React.FC<ScheduleViewProps> = ({ appData, dispatch }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingEntry, setEditingEntry] = useState<WorkEntry | null>(null);
    const [selectedDate, setSelectedDate] = useState<string | undefined>();
    
    const [viewMode, setViewMode] = useState<ViewMode>('month');
    const [currentDate, setCurrentDate] = useState(new Date());
    const [dragOverDate, setDragOverDate] = useState<string | null>(null);

    const handleOpenModalForNew = (date: Date) => {
        setSelectedDate(toLocalDateString(date));
        setEditingEntry(null);
        setIsModalOpen(true);
    };

    const handleOpenModalForEdit = (entry: WorkEntry) => {
        setSelectedDate(undefined);
        setEditingEntry(entry);
        setIsModalOpen(true);
    };
    
    const handleCloseModal = () => {
        setEditingEntry(null);
        setSelectedDate(undefined);
        setIsModalOpen(false);
    };

    const handleSave = (entry: WorkEntry) => {
        if (editingEntry) {
            dispatch({ type: 'UPDATE_WORK_ENTRY', payload: entry });
        } else {
            dispatch({ type: 'ADD_WORK_ENTRY', payload: entry });
        }
        handleCloseModal();
    };

    const handleDelete = (id: string) => {
        if (window.confirm('この作業記録を削除しますか？')) {
            dispatch({ type: 'DELETE_WORK_ENTRY', payload: id });
            handleCloseModal();
        }
    };

    const entriesByDate = useMemo(() => {
        return appData.workEntries.reduce((acc, entry) => {
            const date = entry.date;
            if (!acc[date]) {
                acc[date] = [];
            }
            acc[date].push(entry);
            return acc;
        }, {} as Record<string, WorkEntry[]>);
    }, [appData.workEntries]);
    
    const changeDate = (amount: number, unit: 'month' | 'week' | 'day') => {
        const newDate = new Date(currentDate);
        if (unit === 'month') newDate.setMonth(newDate.getMonth() + amount);
        else if (unit === 'week') newDate.setDate(newDate.getDate() + amount * 7);
        else if (unit === 'day') newDate.setDate(newDate.getDate() + amount);
        setCurrentDate(newDate);
    };

    const handleDragStart = (e: React.DragEvent<HTMLDivElement>, entry: WorkEntry) => {
        e.dataTransfer.setData('workEntryId', entry.id);
        e.currentTarget.style.opacity = '0.5';
    };

    const handleDragEnd = (e: React.DragEvent<HTMLDivElement>) => {
        e.currentTarget.style.opacity = '1';
        setDragOverDate(null);
    };
    
    const handleDragOverCell = (e: React.DragEvent<HTMLDivElement>, dateStr: string) => {
        e.preventDefault();
        if (dragOverDate !== dateStr) {
            setDragOverDate(dateStr);
        }
    };
    
    const handleDrop = (e: React.DragEvent<HTMLDivElement>, dateStr: string) => {
        e.preventDefault();
        const entryId = e.dataTransfer.getData('workEntryId');
        const entryToMove = appData.workEntries.find(entry => entry.id === entryId);

        if (entryToMove && entryToMove.date !== dateStr) {
            const updatedEntry = { ...entryToMove, date: dateStr };
            dispatch({ type: 'UPDATE_WORK_ENTRY', payload: updatedEntry });
        }
        setDragOverDate(null);
    };
    
    const renderMonthView = () => {
        const monthStart = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
        const monthEnd = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
        const startDate = new Date(monthStart);
        startDate.setDate(startDate.getDate() - startDate.getDay());
        const endDate = new Date(monthEnd);
        endDate.setDate(endDate.getDate() + (6 - endDate.getDay()));

        const days = [];
        let day = new Date(startDate);
        while (day <= endDate) {
            days.push(new Date(day));
            day.setDate(day.getDate() + 1);
        }
        
        const dayNames = ['日', '月', '火', '水', '木', '金', '土'];

        return (
             <div>
                <div className="grid grid-cols-7 text-center font-semibold text-xs md:text-sm text-slate-600 border-b">
                    {dayNames.map(d => <div key={d} className="py-2">{d}</div>)}
                </div>
                <div className="grid grid-cols-7">
                    {days.map((d, i) => {
                        const dateStr = toLocalDateString(d);
                        const entries = entriesByDate[dateStr] || [];
                        const isCurrentMonth = d.getMonth() === currentDate.getMonth();
                        const isToday = toLocalDateString(new Date()) === dateStr;
                        const isDragOver = dragOverDate === dateStr;

                        return (
                            <div 
                                key={i}
                                onClick={() => handleOpenModalForNew(d)} 
                                onDragOver={(e) => handleDragOverCell(e, dateStr)}
                                onDrop={(e) => handleDrop(e, dateStr)}
                                className={`relative min-h-[6rem] md:h-32 border-b border-r p-1 md:p-2 cursor-pointer transition-colors ${isCurrentMonth ? 'bg-white' : 'bg-slate-50'} ${isDragOver ? 'bg-blue-100 ring-2 ring-blue-400' : 'hover:bg-blue-50'}`}
                            >
                                <span className={`text-xs md:text-sm ${isCurrentMonth ? 'text-slate-800' : 'text-slate-400'} ${isToday ? 'bg-blue-600 text-white rounded-full w-6 h-6 flex items-center justify-center font-bold' : ''}`}>{d.getDate()}</span>
                                <div className="mt-1 space-y-1 overflow-y-auto max-h-20">
                                    {entries.map(entry => {
                                         const client = appData.clients.find(c => c.id === entry.clientId);
                                         const time = entry.startTime ? `${entry.startTime}~` : '';
                                         return (
                                            <div 
                                                key={entry.id} 
                                                draggable
                                                onDragStart={(e) => handleDragStart(e, entry)}
                                                onDragEnd={handleDragEnd}
                                                onClick={(e) => { e.stopPropagation(); handleOpenModalForEdit(entry); }} 
                                                className="text-xs bg-blue-100 text-blue-800 p-1 rounded truncate hover:bg-blue-200 cursor-grab"
                                            >
                                                {time}{client?.name}
                                            </div>
                                         )
                                    })}
                                </div>
                            </div>
                        )
                    })}
                </div>
             </div>
        )
    };
    
    const renderWeekView = () => {
        const weekStart = new Date(currentDate);
        weekStart.setDate(weekStart.getDate() - weekStart.getDay());
        const days = Array.from({length: 7}, (_, i) => {
            const d = new Date(weekStart);
            d.setDate(d.getDate() + i);
            return d;
        });
        const dayNames = ['日', '月', '火', '水', '木', '金', '土'];
        const timeLabels = Array.from({length: 15}, (_, i) => `${i + 7}:00`); // 7:00 to 21:00

        const timeToPercent = (time: string) => {
            if(!time) return 0;
            const [hours, minutes] = time.split(':').map(Number);
            return ((hours - 7) + minutes / 60) / timeLabels.length * 100;
        }

        return (
            <div className="flex flex-col">
                <div className="grid grid-cols-8 sticky top-0 bg-white z-10">
                    <div className="w-12 md:w-16 border-r border-b"></div>
                    {days.map((d, i) => {
                        const isToday = toLocalDateString(new Date()) === toLocalDateString(d);
                        return (
                            <div key={i} className={`text-center py-2 border-b ${isToday ? 'bg-blue-50' : ''}`}>
                                <span className="text-xs md:text-sm text-slate-500">{dayNames[i]}</span>
                                <p className={`font-semibold text-sm md:text-lg ${isToday ? 'text-blue-600' : ''}`}>{d.getDate()}</p>
                            </div>
                        )
                    })}
                </div>
                <div className="flex flex-grow overflow-y-auto" style={{height: '70vh'}}>
                    <div className="w-12 md:w-16">
                        {timeLabels.map(time => (
                            <div key={time} className="h-16 text-right pr-2 text-xs text-slate-400 border-r -mt-px pt-1">{time}</div>
                        ))}
                    </div>
                    <div className="grid grid-cols-7 flex-1">
                        {days.map((d) => {
                            const dateStr = toLocalDateString(d);
                            const entries = entriesByDate[dateStr] || [];
                            return (
                                <div key={dateStr} className="relative border-r">
                                    {timeLabels.map((_, i) => <div key={i} className="h-16 border-b"></div>)}
                                    {entries.map(entry => {
                                        const client = appData.clients.find(c => c.id === entry.clientId);
                                        const start = entry.startTime ? timeToPercent(entry.startTime) : -1;
                                        const end = entry.endTime ? timeToPercent(entry.endTime) : -1;
                                        if (start < 0 || end < 0 || end <= start) return null;

                                        return (
                                            <div key={entry.id}
                                                onClick={() => handleOpenModalForEdit(entry)}
                                                className="absolute w-full p-2 bg-blue-100 border-l-4 border-blue-500 rounded-r-lg cursor-pointer overflow-hidden"
                                                style={{ top: `${start}%`, height: `${end - start}%` }}
                                            >
                                                <p className="font-semibold text-xs text-blue-800">{entry.startTime} - {entry.endTime}</p>
                                                <p className="text-xs text-blue-700 truncate">{client?.name}</p>
                                                <p className="text-xs text-blue-600 truncate">{entry.description}</p>
                                            </div>
                                        )
                                    })}
                                </div>
                            )
                        })}
                    </div>
                </div>
            </div>
        )
    }
    
    const renderDayView = () => {
        const dateStr = toLocalDateString(currentDate);
        const entries = (entriesByDate[dateStr] || []).sort((a,b) => (a.startTime || "24:00").localeCompare(b.startTime || "24:00"));
        
        return (
            <div className="p-4 space-y-4">
                {entries.length > 0 ? entries.map(entry => {
                     const client = appData.clients.find(c => c.id === entry.clientId);
                     const total = (entry.quantity * entry.unitPrice) + (entry.expenses || 0);
                     const timeInfo = entry.startTime && entry.endTime ? `${entry.startTime} - ${entry.endTime}` : (entry.startTime ? `${entry.startTime}~` : '');
                    return (
                        <div key={entry.id} className="p-4 bg-white rounded-lg shadow-md flex justify-between items-center">
                            <div>
                                {timeInfo && <p className="text-sm font-semibold text-blue-600 mb-1">{timeInfo}</p>}
                                <p className="font-bold text-slate-800">{client?.name}</p>
                                <p className="text-slate-600">{entry.description}</p>
                                <p className="text-sm text-slate-500">{entry.quantity}{entry.unit} x {entry.unitPrice.toLocaleString()}円 {entry.expenses ? `+ 経費${entry.expenses.toLocaleString()}円 ` : ''}= <span className="font-semibold">{total.toLocaleString()}円</span></p>
                            </div>
                            <div className="flex items-center space-x-4">
                                <button onClick={() => handleOpenModalForEdit(entry)} className="text-blue-600 hover:text-blue-900">編集</button>
                                <button onClick={() => handleDelete(entry.id)} className="text-red-600 hover:text-red-900">削除</button>
                            </div>
                        </div>
                    )
                }) : (
                    <div className="text-center py-12 text-slate-500">
                        <p>この日の作業記録はありません。</p>
                    </div>
                )}
                 <button onClick={() => handleOpenModalForNew(currentDate)} className="w-full text-center text-lg text-slate-500 py-4 rounded-lg border-2 border-dashed hover:bg-slate-100 mt-4">+ 新しい作業を登録</button>
            </div>
        )
    }
    
    const unitMap = {month: 'month', week: 'week', day: 'day'} as const;

    return (
        <div>
            <div className="flex justify-end mb-6">
                <button
                    onClick={() => handleOpenModalForNew(new Date())}
                    disabled={appData.clients.length === 0}
                    className="bg-blue-600 text-white px-5 py-2.5 rounded-lg shadow hover:bg-blue-700 transition flex items-center disabled:bg-slate-400 disabled:cursor-not-allowed"
                >
                     <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
                    作業を登録
                </button>
            </div>
            {appData.clients.length === 0 && (
                <div className="text-center p-4 mb-4 bg-yellow-100 text-yellow-800 border border-yellow-200 rounded-lg">
                    スケジュールを登録する前に、まず「元請先管理」から元請先を登録してください。
                </div>
            )}

            <div className="bg-white shadow-md rounded-lg overflow-hidden">
                <CalendarHeader 
                    currentDate={currentDate}
                    viewMode={viewMode}
                    onPrev={() => changeDate(-1, unitMap[viewMode])}
                    onNext={() => changeDate(1, unitMap[viewMode])}
                    onToday={() => setCurrentDate(new Date())}
                    onSetViewMode={setViewMode}
                />
                {viewMode === 'month' && renderMonthView()}
                {viewMode === 'week' && renderWeekView()}
                {viewMode === 'day' && renderDayView()}
            </div>

            <Modal isOpen={isModalOpen} onClose={handleCloseModal} title={editingEntry ? '作業記録の編集' : '新しい作業の登録'}>
                <WorkEntryForm 
                    entry={editingEntry} 
                    clients={appData.clients} 
                    selectedDate={selectedDate} 
                    onSave={handleSave} 
                    onClose={handleCloseModal} 
                    onDelete={editingEntry ? handleDelete : undefined}
                />
            </Modal>
        </div>
    );
};

export default ScheduleView;