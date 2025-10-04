import React, { useState, useMemo } from 'react';
import { AppState, AppAction, Client, WorkEntry, UserProfile } from '../types';
import { Modal } from '../components/Modal';
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

interface InvoicePreviewProps {
    invoiceData: {
        client: Client;
        entries: WorkEntry[];
        invoiceNumber: string;
        issueDate: string;
        dueDate: string;
        total: number;
        tax: number;
        grandTotal: number;
    };
    userProfile: UserProfile;
    onClose: () => void;
}


const InvoicePreview: React.FC<InvoicePreviewProps> = ({ invoiceData, userProfile, onClose }) => {
    const { client, entries, invoiceNumber, issueDate, dueDate, total, tax, grandTotal } = invoiceData;
    const [isEmailModalOpen, setIsEmailModalOpen] = useState(false);
    const [emailBody, setEmailBody] = useState('');
    const [isPdfLoading, setIsPdfLoading] = useState(false);

    const handlePrint = () => {
        window.print();
    };

    const handleExportPdf = () => {
        const input = document.getElementById('invoice-content');
        if (!input) return;

        setIsPdfLoading(true);

        html2canvas(input, {
          scale: 2,
          useCORS: true, 
          windowWidth: input.scrollWidth,
          windowHeight: input.scrollHeight
        }).then(canvas => {
          const imgData = canvas.toDataURL('image/png');
          const pdf = new jsPDF('p', 'mm', 'a4');
          const pdfWidth = pdf.internal.pageSize.getWidth();
          const pdfHeight = pdf.internal.pageSize.getHeight();
          const canvasWidth = canvas.width;
          const canvasHeight = canvas.height;
          const ratio = canvasWidth / canvasHeight;

          let imgWidth = pdfWidth;
          let imgHeight = pdfWidth / ratio;
          
          if (imgHeight > pdfHeight) {
              imgHeight = pdfHeight;
              imgWidth = pdfHeight * ratio;
          }

          pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight);
          pdf.save(`請求書_${invoiceData.invoiceNumber}.pdf`);
          setIsPdfLoading(false);
        }).catch(() => {
            setIsPdfLoading(false);
            alert("PDFの生成に失敗しました。");
        });
    };

    const handleOpenEmailModal = () => {
        const defaultBody = `お世話になっております。\n${userProfile.companyName || ''}です。\n\n請求書をお送りいたしますので、ご査収のほどよろしくお願い申し上げます。\n\n--------------------------------\n請求金額: ${grandTotal.toLocaleString()}円 (税込)\nお支払期日: ${new Date(dueDate).toLocaleDateString('ja-JP')}\n--------------------------------\n\nご確認のほど、よろしくお願いいたします。`;
        setEmailBody(defaultBody);
        setIsEmailModalOpen(true);
    };

    const mailtoHref = `mailto:?subject=請求書のご送付（${new Date(issueDate).toLocaleDateString('ja-JP')}発行分）&body=${encodeURIComponent(emailBody)}`;


    return (
        <div className="fixed inset-0 bg-slate-800 bg-opacity-75 z-50 flex justify-center items-start overflow-y-auto p-4">
            <div className="relative bg-white w-full max-w-4xl my-8 rounded-lg shadow-2xl print-container">
                 {/* Actions Toolbar */}
                <div className="no-print sticky top-0 bg-slate-100 p-4 border-b border-slate-300 flex justify-between items-center z-10 rounded-t-lg">
                    <h3 className="text-lg font-bold">請求書プレビュー</h3>
                    <div className="flex items-center space-x-3">
                        <button onClick={handleExportPdf} disabled={isPdfLoading} className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 text-sm flex items-center disabled:bg-red-400">
                             {isPdfLoading ? (
                                <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"><circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle><path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path></svg>
                            ) : (
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M4 4a2 2 0 012-2h4.586A2 2 0 0112 2.586L15.414 6A2 2 0 0116 7.414V16a2 2 0 01-2 2H6a2 2 0 01-2-2V4zm2 6a1 1 0 011-1h6a1 1 0 110 2H7a1 1 0 01-1-1zm1 3a1 1 0 100 2h6a1 1 0 100-2H7z" clipRule="evenodd" /></svg>
                            )}
                           {isPdfLoading ? '生成中...' : 'PDF'}
                        </button>
                        <button onClick={handleOpenEmailModal} className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 text-sm flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor"><path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z" /><path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z" /></svg>
                            メール
                        </button>
                        <button onClick={handlePrint} className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 text-sm flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-2" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M5 4v3H4a2 2 0 00-2 2v6a2 2 0 002 2h1v-4a1 1 0 011-1h10a1 1 0 011 1v4h1a2 2 0 002-2v-6a2 2 0 00-2-2h-1V4a2 2 0 00-2-2H7a2 2 0 00-2 2zm8 0H7v3h6V4zm0 8H7v4h6v-4z" clipRule="evenodd" /></svg>
                            印刷
                        </button>
                        <button onClick={onClose} className="text-slate-500 hover:text-slate-800">
                             <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                        </button>
                    </div>
                </div>

                {/* Invoice Content */}
                <div className="p-12" id="invoice-content">
                    <header className="flex justify-between items-start pb-8 border-b">
                        <div className="w-3/5">
                            <h1 className="text-3xl font-bold">御請求書</h1>
                            <p className="mt-4 text-lg font-semibold text-slate-700 border-b border-slate-800 pb-1">{client.name} 御中</p>
                            {client.contactPerson && <p className="text-sm text-slate-600 mt-1">{client.contactPerson} 様</p>}
                            {client.address && <p className="text-sm text-slate-500 mt-2">{client.address}</p>}
                            <p className="mt-4 text-slate-600">下記の通り御請求申し上げます。</p>
                        </div>
                        <div className="text-right text-sm w-2/5 flex flex-col items-end">
                            {userProfile.companyLogo && <img src={userProfile.companyLogo} alt="company logo" className="max-h-16 max-w-[10rem] object-contain ml-auto mb-4" />}
                            <p className="font-bold text-base">{userProfile.companyName}</p>
                            <p className="text-slate-600 whitespace-pre-wrap mt-1">{userProfile.companyAddress}</p>
                            {userProfile.companyTel && <p className="text-slate-600">TEL: {userProfile.companyTel}</p>}
                            {userProfile.registrationNumber && <p className="text-slate-600 mt-2">登録番号: {userProfile.registrationNumber}</p>}
                        </div>
                    </header>

                     <div className="flex justify-between items-baseline mt-4">
                        <div className="w-1/2">
                            <div className="text-2xl font-bold text-slate-800">ご請求金額</div>
                            <div className="text-5xl font-bold text-slate-900 mt-1">{grandTotal.toLocaleString()}円 <span className="text-xl font-normal">(税込)</span></div>
                        </div>
                        <div className="text-right">
                            <p>請求番号: {invoiceNumber}</p>
                            <p>発行日: {new Date(issueDate).toLocaleDateString('ja-JP')}</p>
                            <p className="font-semibold mt-2">お支払期日: {new Date(dueDate).toLocaleDateString('ja-JP')}</p>
                        </div>
                    </div>
                    
                    <section className="mt-8">
                         <table className="min-w-full divide-y divide-slate-300">
                            <thead className="bg-slate-100">
                                <tr>
                                    <th className="px-3 py-3.5 text-left text-sm font-semibold text-slate-900">摘要</th>
                                    <th className="px-3 py-3.5 text-right text-sm font-semibold text-slate-900">数量</th>
                                    <th className="px-3 py-3.5 text-right text-sm font-semibold text-slate-900">単位</th>
                                    <th className="px-3 py-3.5 text-right text-sm font-semibold text-slate-900">単価</th>
                                    <th className="px-3 py-3.5 text-right text-sm font-semibold text-slate-900">金額(税抜)</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-200 bg-white">
                                {entries.map(entry => (
                                    <tr key={entry.id}>
                                        <td className="w-1/2 px-3 py-4 text-sm text-slate-600">{new Date(entry.date).toLocaleDateString('ja-JP', {month: '2-digit', day: '2-digit'})} {entry.description}
                                            {entry.expenses && entry.expenses > 0 ? <span className="text-xs text-slate-400"> (諸経費: {entry.expenses.toLocaleString()}円)</span> : ''}
                                        </td>
                                        <td className="px-3 py-4 text-sm text-slate-500 text-right">{entry.quantity.toLocaleString()}</td>
                                        <td className="px-3 py-4 text-sm text-slate-500 text-right">{entry.unit}</td>
                                        <td className="px-3 py-4 text-sm text-slate-500 text-right">{entry.unitPrice.toLocaleString()}</td>
                                        <td className="px-3 py-4 text-sm text-slate-700 text-right font-semibold">{((entry.quantity * entry.unitPrice) + (entry.expenses || 0)).toLocaleString()}</td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </section>
                    
                     <section className="mt-8 flex justify-end">
                        <div className="w-1/2 md:w-1/3">
                            <dl className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                    <dt className="text-slate-600">小計 (税抜)</dt>
                                    <dd className="font-semibold text-slate-800">{total.toLocaleString()} 円</dd>
                                </div>
                                <div className="flex justify-between">
                                    <dt className="text-slate-600">消費税 (10%)</dt>
                                    <dd className="font-semibold text-slate-800">{tax.toLocaleString()} 円</dd>
                                </div>
                                <div className="flex justify-between pt-2 border-t font-bold text-base">
                                    <dt className="text-slate-800">合計金額</dt>
                                    <dd className="text-slate-900">{grandTotal.toLocaleString()} 円</dd>
                                </div>
                            </dl>
                        </div>
                    </section>

                    <footer className="mt-12 pt-8 border-t">
                         {userProfile.bankInfo && (
                            <div className="mb-4">
                                <p className="font-semibold text-sm">お振込先</p>
                                <p className="text-sm text-slate-600 whitespace-pre-wrap">{userProfile.bankInfo}</p>
                            </div>
                        )}
                        <p className="text-xs text-slate-500">※ 振込手数料は貴社にてご負担いただけますようお願い申し上げます。</p>
                    </footer>
                </div>
            </div>

             <Modal isOpen={isEmailModalOpen} onClose={() => setIsEmailModalOpen(false)} title="メール作成">
                <div className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-slate-700">メール本文</label>
                        <textarea 
                            value={emailBody} 
                            onChange={e => setEmailBody(e.target.value)}
                            rows={15} 
                            className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"
                        ></textarea>
                    </div>
                     <div className="flex justify-end">
                        <a href={mailtoHref} target="_blank" rel="noopener noreferrer" className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 text-sm">
                            メールソフトで開く
                        </a>
                    </div>
                </div>
            </Modal>
        </div>
    );
};

interface InvoicesViewProps {
  appData: AppState;
  dispatch: React.Dispatch<AppAction>;
}

const InvoicesView: React.FC<InvoicesViewProps> = ({ appData }) => {
  const [selectedClientId, setSelectedClientId] = useState<string>('');
  const today = new Date();
  const [billingYear, setBillingYear] = useState<string>(today.getFullYear().toString());
  const [billingMonth, setBillingMonth] = useState<string>((today.getMonth() + 1).toString());
  const [invoiceData, setInvoiceData] = useState<any>(null);

  const selectedClient = useMemo(() => appData.clients.find(c => c.id === selectedClientId), [selectedClientId, appData.clients]);

  const relevantEntries = useMemo(() => {
    if (!selectedClient) return [];

    const year = parseInt(billingYear);
    const month = parseInt(billingMonth) - 1; // 0-indexed month
    
    // Determine the date range based on the client's closing day
    let startDate: Date;
    let endDate: Date;
    
    if (selectedClient.closingDay === 99) { // End of month
        startDate = new Date(year, month, 1);
        endDate = new Date(year, month + 1, 0);
    } else { // Specific day
        startDate = new Date(year, month - 1, selectedClient.closingDay + 1);
        endDate = new Date(year, month, selectedClient.closingDay);
    }
    
    return appData.workEntries.filter(entry => {
        const [y, m, d] = entry.date.split('-').map(Number);
        const entryDate = new Date(y, m - 1, d); // Create date in local timezone to avoid UTC issues
        return entry.clientId === selectedClientId && entryDate >= startDate && entryDate <= endDate;
    });
  }, [selectedClientId, billingYear, billingMonth, appData.workEntries, selectedClient]);


  const handleGenerateInvoice = () => {
      if(!selectedClient || relevantEntries.length === 0) {
          alert("請求対象のデータがありません。");
          return;
      }
      
      const total = relevantEntries.reduce((sum, entry) => sum + (entry.quantity * entry.unitPrice) + (entry.expenses || 0), 0);
      const tax = Math.floor(total * 0.1);
      const grandTotal = total + tax;
      const issueDate = new Date().toISOString();
      
      let dueDate : Date;
      const currentBillingMonth = parseInt(billingMonth) - 1;
      const nextMonth = new Date(parseInt(billingYear), currentBillingMonth + 1, 1);
      const nextNextMonth = new Date(parseInt(billingYear), currentBillingMonth + 2, 1);

      // Simple logic for "翌月末払い" (end of next month)
      if(selectedClient.paymentTerms?.includes("翌月末")) {
          dueDate = new Date(nextNextMonth.getFullYear(), nextNextMonth.getMonth(), 0);
      } else {
          // Default to end of next month if not specified
          dueDate = new Date(nextNextMonth.getFullYear(), nextNextMonth.getMonth(), 0);
      }

      const invoiceNumber = `${billingYear}${billingMonth.padStart(2, '0')}-${selectedClientId.substring(0, 4)}`;

      setInvoiceData({
          client: selectedClient,
          entries: relevantEntries,
          invoiceNumber,
          issueDate,
          dueDate: dueDate.toISOString(),
          total,
          tax,
          grandTotal,
      });
  };
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-1 bg-white p-6 rounded-lg shadow-md">
              <h3 className="text-lg font-semibold border-b pb-3 mb-4">請求書作成</h3>
              <div className="space-y-4">
                  <div>
                      <label className="block text-sm font-medium text-slate-700">元請先</label>
                       <select value={selectedClientId} onChange={e => setSelectedClientId(e.target.value)} className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm">
                          <option value="">選択してください</option>
                          {appData.clients.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                      </select>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                      <div>
                           <label className="block text-sm font-medium text-slate-700">請求対象年</label>
                           <input type="number" value={billingYear} onChange={e => setBillingYear(e.target.value)} className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm" />
                      </div>
                      <div>
                           <label className="block text-sm font-medium text-slate-700">請求対象月</label>
                           <select value={billingMonth} onChange={e => setBillingMonth(e.target.value)} className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm">
                              {Array.from({length: 12}, (_, i) => i + 1).map(m => <option key={m} value={m}>{m}月</option>)}
                           </select>
                      </div>
                  </div>
                  <button 
                    onClick={handleGenerateInvoice}
                    disabled={!selectedClientId || relevantEntries.length === 0}
                    className="w-full bg-blue-600 text-white px-5 py-2.5 rounded-lg shadow hover:bg-blue-700 transition flex items-center justify-center disabled:bg-slate-400 disabled:cursor-not-allowed"
                  >
                      請求書プレビュー
                  </button>
              </div>
          </div>
          <div className="lg:col-span-2 bg-white p-6 rounded-lg shadow-md">
               <h3 className="text-lg font-semibold border-b pb-3 mb-4">請求対象の作業一覧 ({relevantEntries.length}件)</h3>
               <div className="max-h-96 overflow-y-auto">
                {selectedClientId ? (
                     relevantEntries.length > 0 ? (
                        <ul className="space-y-3">
                            {relevantEntries.map(entry => (
                                <li key={entry.id} className="p-3 bg-slate-50 rounded-md flex justify-between items-center">
                                    <div>
                                        <p className="font-medium text-slate-800">{entry.description}</p>
                                        <p className="text-sm text-slate-500">{entry.date}</p>
                                    </div>
                                    <p className="font-semibold text-slate-800">{((entry.quantity * entry.unitPrice) + (entry.expenses || 0)).toLocaleString()}円</p>
                                </li>
                            ))}
                        </ul>
                     ) : (
                        <p className="text-slate-500 text-center py-8">この期間に該当する作業記録はありません。</p>
                     )
                ) : (
                    <p className="text-slate-500 text-center py-8">元請先と対象年月を選択してください。</p>
                )}
               </div>
          </div>
      </div>
      {invoiceData && <InvoicePreview invoiceData={invoiceData} userProfile={appData.userProfile} onClose={() => setInvoiceData(null)} />}
    </div>
  );
};

export default InvoicesView;