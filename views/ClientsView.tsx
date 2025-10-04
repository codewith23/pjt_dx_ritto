import React, { useState } from 'react';
import { AppState, AppAction, Client } from '../types';
import { Modal } from '../components/Modal';

interface ClientsViewProps {
  appData: AppState;
  dispatch: React.Dispatch<AppAction>;
}

const ClientForm: React.FC<{
    client?: Client | null;
    onSave: (client: Client) => void;
    onClose: () => void;
}> = ({ client, onSave, onClose }) => {
    const [name, setName] = useState(client?.name || '');
    const [contactPerson, setContactPerson] = useState(client?.contactPerson || '');
    const [address, setAddress] = useState(client?.address || '');
    const [closingDay, setClosingDay] = useState<string>(client?.closingDay?.toString() || '99');
    const [paymentTerms, setPaymentTerms] = useState(client?.paymentTerms || '翌月末払い');
    const [dailyRate, setDailyRate] = useState<number>(client?.dailyRate || 0);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSave({
            id: client?.id || crypto.randomUUID(),
            name,
            contactPerson,
            address,
            closingDay: parseInt(closingDay),
            paymentTerms,
            dailyRate: dailyRate || 0,
        });
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <label className="block text-sm font-medium text-slate-700">元請先名 <span className="text-red-500">*</span></label>
                <input type="text" value={name} onChange={e => setName(e.target.value)} required className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"/>
            </div>
            <div>
                <label className="block text-sm font-medium text-slate-700">担当者名</label>
                <input type="text" value={contactPerson} onChange={e => setContactPerson(e.target.value)} className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"/>
            </div>
            <div>
                <label className="block text-sm font-medium text-slate-700">住所</label>
                <input type="text" value={address} onChange={e => setAddress(e.target.value)} className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"/>
            </div>
             <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-medium text-slate-700">締め日 <span className="text-red-500">*</span></label>
                    <select value={closingDay} onChange={e => setClosingDay(e.target.value)} required className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm">
                        {Array.from({ length: 31 }, (_, i) => i + 1).map(day => (
                            <option key={day} value={day}>{day}日</option>
                        ))}
                        <option value="99">月末</option>
                    </select>
                </div>
                <div>
                    <label className="block text-sm font-medium text-slate-700">支払条件</label>
                    <input type="text" value={paymentTerms} onChange={e => setPaymentTerms(e.target.value)} className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"/>
                </div>
            </div>
            <div>
                <label className="block text-sm font-medium text-slate-700">日当単価 (税抜)</label>
                <input type="number" value={dailyRate} onChange={e => setDailyRate(parseFloat(e.target.value) || 0)} placeholder="例: 18000" className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"/>
            </div>
            <div className="flex justify-end space-x-3 pt-4">
                <button type="button" onClick={onClose} className="bg-slate-100 text-slate-700 px-4 py-2 rounded-md hover:bg-slate-200">キャンセル</button>
                <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">保存</button>
            </div>
        </form>
    )
}

const ClientsView: React.FC<ClientsViewProps> = ({ appData, dispatch }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingClient, setEditingClient] = useState<Client | null>(null);

  const handleOpenModal = (client: Client | null = null) => {
    setEditingClient(client);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setEditingClient(null);
    setIsModalOpen(false);
  };

  const handleSave = (client: Client) => {
    if (editingClient) {
      dispatch({ type: 'UPDATE_CLIENT', payload: client });
    } else {
      dispatch({ type: 'ADD_CLIENT', payload: client });
    }
    handleCloseModal();
  };
  
  const handleDelete = (id: string) => {
      if(window.confirm('この元請先を削除しますか？関連するスケジュールもすべて削除されます。')) {
          dispatch({ type: 'DELETE_CLIENT', payload: id });
      }
  }

  return (
    <div>
      <div className="flex justify-end mb-6">
        <button
          onClick={() => handleOpenModal()}
          className="bg-blue-600 text-white px-5 py-2.5 rounded-lg shadow hover:bg-blue-700 transition flex items-center"
        >
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
          元請先を追加
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {appData.clients.length > 0 ? appData.clients.map(client => (
          <div key={client.id} className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow">
            <div className="flex justify-between items-start">
              <h3 className="text-xl font-bold text-slate-800">{client.name}</h3>
               <div className="flex space-x-2">
                    <button onClick={() => handleOpenModal(client)} className="text-slate-400 hover:text-blue-600"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.5L16.732 3.732z"></path></svg></button>
                    <button onClick={() => handleDelete(client.id)} className="text-slate-400 hover:text-red-600"><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg></button>
                </div>
            </div>
            {client.contactPerson && <p className="text-slate-600 mt-2">担当: {client.contactPerson} 様</p>}
            {client.address && <p className="text-sm text-slate-500 mt-1">{client.address}</p>}
            <div className="mt-4 pt-4 border-t border-slate-200 space-y-2 text-sm">
                 <div className="flex justify-between">
                    <span className="text-slate-500">締め日:</span>
                    <span className="font-semibold text-slate-700">{client.closingDay === 99 ? '月末' : `${client.closingDay}日`}</span>
                </div>
                 <div className="flex justify-between">
                    <span className="text-slate-500">支払条件:</span>
                    <span className="font-semibold text-slate-700">{client.paymentTerms}</span>
                </div>
                {client.dailyRate && client.dailyRate > 0 && <div className="flex justify-between">
                    <span className="text-slate-500">日当単価:</span>
                    <span className="font-semibold text-slate-700">{client.dailyRate.toLocaleString()} 円</span>
                </div>}
            </div>
          </div>
        )) : (
          <div className="col-span-full text-center py-12 bg-white rounded-lg shadow-md">
            <h3 className="text-xl text-slate-700">元請先が登録されていません。</h3>
            <p className="text-slate-500 mt-2">「元請先を追加」ボタンから最初の取引先を登録しましょう。</p>
          </div>
        )}
      </div>

      <Modal isOpen={isModalOpen} onClose={handleCloseModal} title={editingClient ? '元請先の編集' : '新しい元請先の追加'}>
        <ClientForm client={editingClient} onSave={handleSave} onClose={handleCloseModal} />
      </Modal>
    </div>
  );
};

export default ClientsView;