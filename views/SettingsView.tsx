import React, { useState, useEffect } from 'react';
import { AppState, AppAction, UserProfile } from '../types';

interface SettingsViewProps {
  appData: AppState;
  dispatch: React.Dispatch<AppAction>;
}

const SettingsView: React.FC<SettingsViewProps> = ({ appData, dispatch }) => {
  const [profile, setProfile] = useState<UserProfile>(appData.userProfile || {});
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    setProfile(appData.userProfile || {});
  }, [appData.userProfile]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleLogoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) { // 2MB limit
          alert("ファイルサイズは2MB以下にしてください。");
          return;
      }
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfile({ ...profile, companyLogo: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleRemoveLogo = () => {
    setProfile({ ...profile, companyLogo: undefined });
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch({ type: 'SET_USER_PROFILE', payload: profile });
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white p-6 sm:p-8 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-slate-800 border-b pb-4 mb-6">事業者情報設定</h2>
        <p className="text-sm text-slate-500 mb-6">ここで設定した情報は、請求書に自動で記載されます。</p>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-slate-700">事業者名/屋号</label>
              <input type="text" name="companyName" value={profile.companyName || ''} onChange={handleChange} className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"/>
            </div>
             <div>
              <label className="block text-sm font-medium text-slate-700">登録番号 (インボイス)</label>
              <input type="text" name="registrationNumber" value={profile.registrationNumber || ''} onChange={handleChange} placeholder="T1234567890123" className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"/>
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">住所</label>
            <input type="text" name="companyAddress" value={profile.companyAddress || ''} onChange={handleChange} className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"/>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">電話番号</label>
            <input type="text" name="companyTel" value={profile.companyTel || ''} onChange={handleChange} className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"/>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700">振込先情報</label>
            <textarea name="bankInfo" value={profile.bankInfo || ''} onChange={handleChange} rows={3} placeholder="例: 〇〇銀行 〇〇支店 普通 1234567" className="mt-1 block w-full rounded-md border-slate-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm"/>
          </div>
          <div>
             <label className="block text-sm font-medium text-slate-700">ロゴ</label>
             <div className="mt-2 flex items-center space-x-6">
                <div className="shrink-0">
                    {profile.companyLogo ? (
                        <img className="h-16 w-32 object-contain" src={profile.companyLogo} alt="現在のロゴ" />
                    ) : (
                        <div className="h-16 w-32 bg-slate-100 rounded-md flex items-center justify-center text-slate-400 text-sm">ロゴなし</div>
                    )}
                </div>
                <div>
                  <input type="file" id="logo-upload" accept="image/png, image/jpeg" onChange={handleLogoChange} className="hidden" />
                  <label htmlFor="logo-upload" className="cursor-pointer rounded-md bg-white px-3 py-2 text-sm font-semibold text-slate-900 shadow-sm ring-1 ring-inset ring-slate-300 hover:bg-slate-50">
                    ファイルを選択
                  </label>
                  {profile.companyLogo && <button type="button" onClick={handleRemoveLogo} className="ml-3 text-sm font-semibold text-red-600 hover:text-red-500">削除</button>}
                </div>
             </div>
             <p className="text-xs text-slate-500 mt-2">PNG, JPG形式のファイルをアップロードできます。(2MBまで)</p>
          </div>
          <div className="pt-6 flex justify-end items-center">
            {isSaved && <span className="text-sm text-green-600 mr-4">保存しました！</span>}
            <button type="submit" className="bg-blue-600 text-white px-6 py-2.5 rounded-lg shadow hover:bg-blue-700 transition">
              保存する
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SettingsView;
