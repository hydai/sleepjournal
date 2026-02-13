import { useState, useEffect } from 'react';
import {
  Moon, Sun, Save, Calendar, Clock, Coffee,
  Activity, FileText, Download, Trash2,
  ChevronRight, ChevronLeft, BedDouble
} from 'lucide-react';

const initialFormState = {
  date: '',
  dayType: 'work',
  bedTime: '22:00',
  trySleepTime: '22:30',
  sleepLatency: 20,
  wakeCount: 0,
  totalWakeTime: 0,
  lastWakeTime: '06:30',
  getUpTime: '07:00',
  sleepQuality: 3,
  useAlarm: false,
  notes: '',
  napCount: 0,
  napDuration: 0,
  alcoholAmount: '',
  alcoholTime: '',
  caffeineAmount: '',
  caffeineTime: '',
  medsName: '',
  medsTime: '',
  lightTime: '',
  exerciseTime: '',
};

const RatingButton = ({ value, current, onChange }) => (
  <button
    onClick={() => onChange({ target: { name: 'sleepQuality', value } })}
    className={`w-10 h-10 rounded-full flex items-center justify-center font-bold text-sm transition-all
      ${current == value
        ? 'bg-blue-600 text-white scale-110 shadow-lg'
        : 'bg-gray-100 text-gray-400 hover:bg-gray-200'}`}
  >
    {value}
  </button>
);

export default function SleepDiaryApp() {
  const [activeTab, setActiveTab] = useState('morning');
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  const [entries, setEntries] = useState(() => {
    const saved = localStorage.getItem('sleep_diary_entries');
    return saved ? JSON.parse(saved) : {};
  });
  const [formData, setFormData] = useState(initialFormState);

  useEffect(() => {
    if (entries[selectedDate]) {
      setFormData(entries[selectedDate]);
    } else {
      setFormData({ ...initialFormState, date: selectedDate });
    }
  }, [selectedDate, entries]);

  useEffect(() => {
    localStorage.setItem('sleep_diary_entries', JSON.stringify(entries));
  }, [entries]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const saveEntry = () => {
    setEntries(prev => ({
      ...prev,
      [selectedDate]: formData
    }));
    alert('資料已儲存！');
  };

  const deleteEntry = (date) => {
    if (confirm('確定要刪除這天的紀錄嗎？')) {
      const newEntries = { ...entries };
      delete newEntries[date];
      setEntries(newEntries);
    }
  };

  const exportCSV = () => {
    const dates = Object.keys(entries).sort();
    if (dates.length === 0) {
      alert('目前沒有資料可匯出');
      return;
    }

    let csvContent = "\uFEFF";
    csvContent += "日期,類型,就寢時間,嘗試入睡,入睡耗時(分),醒來次數,醒來總時(分),最後醒來,起床時間,睡眠品質(1-5),使用鬧鐘,備註,小睡次數,小睡總時(分),酒精,最後喝酒,咖啡因,最後咖啡,藥物,服藥時間,照光,運動\n";

    dates.forEach(date => {
      const d = entries[date];
      const row = [
        d.date,
        d.dayType === 'work' ? '工作日' : '休息日',
        d.bedTime,
        d.trySleepTime,
        d.sleepLatency,
        d.wakeCount,
        d.totalWakeTime,
        d.lastWakeTime,
        d.getUpTime,
        d.sleepQuality,
        d.useAlarm ? '是' : '否',
        `"${d.notes || ''}"`,
        d.napCount,
        d.napDuration,
        `"${d.alcoholAmount || ''}"`,
        d.alcoholTime,
        `"${d.caffeineAmount || ''}"`,
        d.caffeineTime,
        `"${d.medsName || ''}"`,
        d.medsTime,
        `"${d.lightTime || ''}"`,
        `"${d.exerciseTime || ''}"`
      ].join(",");
      csvContent += row + "\n";
    });

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", `睡眠日誌匯出_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans pb-nav md:pb-0 text-slate-800">

      {/* Header */}
      <header className="bg-blue-900 text-white p-4 shadow-md sticky top-0 z-10">
        <div className="max-w-3xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Moon className="w-6 h-6 text-yellow-300" />
            <h1 className="text-xl font-bold tracking-wide">睡眠日誌</h1>
          </div>
          <div className="text-xs text-blue-200">台大醫院樣式</div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-3xl mx-auto p-4">

        {/* Date Selector */}
        {activeTab !== 'history' && (
          <div className="bg-white rounded-xl p-4 shadow-sm mb-6 flex items-center justify-between border border-blue-100">
            <button
              onClick={() => {
                const d = new Date(selectedDate);
                d.setDate(d.getDate() - 1);
                setSelectedDate(d.toISOString().split('T')[0]);
              }}
              className="p-2 hover:bg-slate-100 rounded-full text-slate-500"
            >
              <ChevronLeft size={24} />
            </button>
            <div className="flex flex-col items-center">
              <label className="text-xs text-slate-400 mb-1">記錄日期</label>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="font-bold text-lg text-blue-900 bg-transparent text-center focus:outline-none"
              />
            </div>
            <button
              onClick={() => {
                const d = new Date(selectedDate);
                d.setDate(d.getDate() + 1);
                setSelectedDate(d.toISOString().split('T')[0]);
              }}
              className="p-2 hover:bg-slate-100 rounded-full text-slate-500"
            >
              <ChevronRight size={24} />
            </button>
          </div>
        )}

        {/* --- MORNING TAB --- */}
        {activeTab === 'morning' && (
          <div className="space-y-6 animate-fade-in">
            <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-md mb-4">
              <h3 className="text-blue-800 font-bold flex items-center gap-2">
                <Sun className="w-5 h-5" /> 早上填寫 (回想昨晚)
              </h3>
              <p className="text-sm text-blue-600 mt-1">請填寫 {selectedDate} 早上醒來後的感受</p>
            </div>

            <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-100">
              <label className="block text-sm font-medium text-slate-700 mb-3">今日類型</label>
              <div className="flex gap-4">
                <label className={`flex-1 p-3 rounded-lg border-2 cursor-pointer transition-all flex items-center justify-center gap-2
                  ${formData.dayType === 'work' ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-200 text-gray-500'}`}>
                  <input type="radio" name="dayType" value="work" checked={formData.dayType === 'work'} onChange={handleInputChange} className="hidden" />
                  <FileText size={18} /> 工作日
                </label>
                <label className={`flex-1 p-3 rounded-lg border-2 cursor-pointer transition-all flex items-center justify-center gap-2
                  ${formData.dayType === 'rest' ? 'border-green-500 bg-green-50 text-green-700' : 'border-gray-200 text-gray-500'}`}>
                  <input type="radio" name="dayType" value="rest" checked={formData.dayType === 'rest'} onChange={handleInputChange} className="hidden" />
                  <Coffee size={18} /> 休息日
                </label>
              </div>
            </div>

            <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-100 space-y-4">
              <h4 className="font-semibold text-slate-800 border-b pb-2">睡眠時間</h4>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-slate-500 block mb-1">就寢時間 (躺上床)</label>
                  <input type="time" name="bedTime" value={formData.bedTime} onChange={handleInputChange} className="w-full p-3 bg-slate-50 rounded-lg outline-none focus:ring-2 focus:ring-blue-300" />
                </div>
                <div>
                  <label className="text-xs text-slate-500 block mb-1">嘗試入睡時間</label>
                  <input type="time" name="trySleepTime" value={formData.trySleepTime} onChange={handleInputChange} className="w-full p-3 bg-slate-50 rounded-lg outline-none focus:ring-2 focus:ring-blue-300" />
                </div>
              </div>

              <div>
                <label className="text-xs text-slate-500 block mb-1">睡著所需時間 (分鐘)</label>
                <div className="flex items-center gap-2">
                  <input type="number" name="sleepLatency" value={formData.sleepLatency} onChange={handleInputChange} className="flex-1 p-3 bg-slate-50 rounded-lg outline-none focus:ring-2 focus:ring-blue-300" />
                  <span className="text-slate-400">分</span>
                </div>
              </div>
            </div>

            <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-100 space-y-4">
              <h4 className="font-semibold text-slate-800 border-b pb-2">半夜醒來</h4>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-slate-500 block mb-1">醒來次數</label>
                  <input type="number" name="wakeCount" value={formData.wakeCount} onChange={handleInputChange} className="w-full p-3 bg-slate-50 rounded-lg outline-none focus:ring-2 focus:ring-blue-300" />
                </div>
                <div>
                  <label className="text-xs text-slate-500 block mb-1">總計醒來時間 (分)</label>
                  <input type="number" name="totalWakeTime" value={formData.totalWakeTime} onChange={handleInputChange} className="w-full p-3 bg-slate-50 rounded-lg outline-none focus:ring-2 focus:ring-blue-300" />
                </div>
              </div>
            </div>

            <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-100 space-y-4">
              <h4 className="font-semibold text-slate-800 border-b pb-2">起床狀況</h4>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-slate-500 block mb-1">最後醒來時間</label>
                  <input type="time" name="lastWakeTime" value={formData.lastWakeTime} onChange={handleInputChange} className="w-full p-3 bg-slate-50 rounded-lg outline-none focus:ring-2 focus:ring-blue-300" />
                </div>
                <div>
                  <label className="text-xs text-slate-500 block mb-1">實際起床時間</label>
                  <input type="time" name="getUpTime" value={formData.getUpTime} onChange={handleInputChange} className="w-full p-3 bg-slate-50 rounded-lg outline-none focus:ring-2 focus:ring-blue-300" />
                </div>
              </div>

              <div>
                 <div className="flex justify-between items-center mb-2">
                    <label className="text-sm text-slate-700">自覺睡眠品質</label>
                    <span className="text-xs text-slate-400">1(極差) - 5(極佳)</span>
                 </div>
                 <div className="flex justify-between gap-2">
                   {[1, 2, 3, 4, 5].map(v => (
                     <RatingButton key={v} value={v} current={formData.sleepQuality} onChange={handleInputChange} />
                   ))}
                 </div>
              </div>

              <div className="flex items-center justify-between py-2 border-t mt-2">
                <div className="flex items-center gap-2">
                   <Clock className="text-slate-400" size={18} />
                   <span className="text-sm text-slate-700">是否被鬧鐘叫醒？</span>
                   <span className="text-xs text-slate-400">(自然醒選否)</span>
                </div>
                <div className="relative inline-block w-12 mr-2 align-middle select-none transition duration-200 ease-in">
                  <input type="checkbox" name="useAlarm" id="toggle" checked={formData.useAlarm} onChange={handleInputChange} className="toggle-checkbox absolute block w-6 h-6 rounded-full bg-white border-4 appearance-none cursor-pointer border-gray-300 checked:right-0 checked:border-blue-600"/>
                  <label htmlFor="toggle" className={`toggle-label block overflow-hidden h-6 rounded-full cursor-pointer ${formData.useAlarm ? 'bg-blue-600' : 'bg-gray-300'}`}></label>
                </div>
              </div>

              <div>
                <label className="text-xs text-slate-500 block mb-1">備註 (感冒、生理期等)</label>
                <input type="text" name="notes" value={formData.notes} onChange={handleInputChange} className="w-full p-3 bg-slate-50 rounded-lg outline-none focus:ring-2 focus:ring-blue-300" placeholder="無" />
              </div>

            </div>

            <button
              onClick={saveEntry}
              className="w-full py-4 bg-blue-600 text-white rounded-xl font-bold shadow-lg shadow-blue-200 active:scale-95 transition-transform flex items-center justify-center gap-2"
            >
              <Save size={20} /> 儲存早上紀錄
            </button>
          </div>
        )}

        {/* --- EVENING TAB --- */}
        {activeTab === 'evening' && (
          <div className="space-y-6 animate-fade-in">
             <div className="bg-indigo-50 border-l-4 border-indigo-500 p-4 rounded-r-md mb-4">
              <h3 className="text-indigo-800 font-bold flex items-center gap-2">
                <Moon className="w-5 h-5" /> 睡前填寫 (回顧今日)
              </h3>
              <p className="text-sm text-indigo-600 mt-1">請在 {selectedDate} 睡前填寫今日白天的行為</p>
            </div>

            <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-100 space-y-4">
              <h4 className="font-semibold text-slate-800 border-b pb-2 flex items-center gap-2">
                <BedDouble size={18} className="text-indigo-500"/> 小睡情況
              </h4>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-xs text-slate-500 block mb-1">小睡次數</label>
                  <input type="number" name="napCount" value={formData.napCount} onChange={handleInputChange} className="w-full p-3 bg-slate-50 rounded-lg outline-none focus:ring-2 focus:ring-indigo-300" />
                </div>
                <div>
                  <label className="text-xs text-slate-500 block mb-1">總共幾分鐘</label>
                  <input type="number" name="napDuration" value={formData.napDuration} onChange={handleInputChange} className="w-full p-3 bg-slate-50 rounded-lg outline-none focus:ring-2 focus:ring-indigo-300" />
                </div>
              </div>
            </div>

            <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-100 space-y-4">
              <h4 className="font-semibold text-slate-800 border-b pb-2 flex items-center gap-2">
                <Coffee size={18} className="text-amber-700"/> 飲食攝取
              </h4>

              <div className="p-3 bg-slate-50 rounded-lg">
                <label className="text-sm font-bold text-slate-700 mb-2 block">酒精 (啤酒/紅酒等)</label>
                <div className="grid grid-cols-1 gap-2">
                   <input type="text" name="alcoholAmount" value={formData.alcoholAmount} onChange={handleInputChange} placeholder="總量/種類 (例如 250cc 啤酒)" className="w-full p-2 border rounded" />
                   <div className="flex items-center gap-2">
                     <span className="text-xs text-slate-500 whitespace-nowrap">最後飲用時間:</span>
                     <input type="time" name="alcoholTime" value={formData.alcoholTime} onChange={handleInputChange} className="w-full p-2 border rounded" />
                   </div>
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-lg">
                <label className="text-sm font-bold text-slate-700 mb-2 block">咖啡因 (茶/咖啡/可樂)</label>
                <div className="grid grid-cols-1 gap-2">
                   <input type="text" name="caffeineAmount" value={formData.caffeineAmount} onChange={handleInputChange} placeholder="總量/種類 (例如 1杯美式)" className="w-full p-2 border rounded" />
                   <div className="flex items-center gap-2">
                     <span className="text-xs text-slate-500 whitespace-nowrap">最後飲用時間:</span>
                     <input type="time" name="caffeineTime" value={formData.caffeineTime} onChange={handleInputChange} className="w-full p-2 border rounded" />
                   </div>
                </div>
              </div>
            </div>

            <div className="bg-white p-5 rounded-xl shadow-sm border border-slate-100 space-y-4">
              <h4 className="font-semibold text-slate-800 border-b pb-2 flex items-center gap-2">
                <Activity size={18} className="text-green-600"/> 藥物與活動
              </h4>

              <div>
                <label className="text-xs text-slate-500 block mb-1">助眠藥物名稱/劑量</label>
                <input type="text" name="medsName" value={formData.medsName} onChange={handleInputChange} placeholder="例如 Stilnox 10mg" className="w-full p-3 bg-slate-50 rounded-lg outline-none focus:ring-2 focus:ring-indigo-300 mb-2" />
                <div className="flex items-center gap-2">
                   <span className="text-xs text-slate-500">服藥時間:</span>
                   <input type="time" name="medsTime" value={formData.medsTime} onChange={handleInputChange} className="flex-1 p-2 bg-slate-50 rounded border-none" />
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 pt-2">
                <div>
                   <label className="text-xs text-slate-500 block mb-1">照光時間 (區間)</label>
                   <input type="text" name="lightTime" value={formData.lightTime} onChange={handleInputChange} placeholder="例如 07:00-08:00 AM" className="w-full p-3 bg-slate-50 rounded-lg outline-none focus:ring-2 focus:ring-indigo-300" />
                </div>
                <div>
                   <label className="text-xs text-slate-500 block mb-1">運動時間 (區間)</label>
                   <input type="text" name="exerciseTime" value={formData.exerciseTime} onChange={handleInputChange} placeholder="例如 19:00-20:00 PM" className="w-full p-3 bg-slate-50 rounded-lg outline-none focus:ring-2 focus:ring-indigo-300" />
                </div>
              </div>
            </div>

            <button
              onClick={saveEntry}
              className="w-full py-4 bg-indigo-600 text-white rounded-xl font-bold shadow-lg shadow-indigo-200 active:scale-95 transition-transform flex items-center justify-center gap-2"
            >
              <Save size={20} /> 儲存睡前紀錄
            </button>
          </div>
        )}

        {/* --- HISTORY TAB --- */}
        {activeTab === 'history' && (
          <div className="space-y-4 animate-fade-in">
             <div className="flex justify-between items-center mb-4">
               <h3 className="text-lg font-bold text-slate-700">歷史紀錄</h3>
               <button
                 onClick={exportCSV}
                 className="px-4 py-2 bg-green-600 text-white rounded-lg text-sm flex items-center gap-2 hover:bg-green-700"
               >
                 <Download size={16} /> 匯出 CSV (Excel)
               </button>
             </div>

             {Object.keys(entries).length === 0 ? (
               <div className="text-center py-10 text-slate-400">
                 <FileText size={48} className="mx-auto mb-2 opacity-20" />
                 <p>目前還沒有紀錄</p>
                 <p className="text-sm">請切換到填寫分頁開始記錄</p>
               </div>
             ) : (
               <div className="space-y-3">
                 {Object.keys(entries).sort().reverse().map(date => {
                   const entry = entries[date];
                   return (
                     <div key={date} className="bg-white p-4 rounded-xl shadow-sm border border-slate-100 flex justify-between items-center group">
                       <div>
                         <div className="flex items-center gap-2">
                           <span className="font-bold text-slate-800">{date}</span>
                           <span className={`text-xs px-2 py-0.5 rounded ${entry.dayType === 'work' ? 'bg-blue-100 text-blue-600' : 'bg-green-100 text-green-600'}`}>
                             {entry.dayType === 'work' ? '工作日' : '休息日'}
                           </span>
                         </div>
                         <div className="text-xs text-slate-500 mt-1 flex gap-3">
                           <span>😴 {entry.bedTime} 就寢</span>
                           <span>⚡ 品質: {entry.sleepQuality}/5</span>
                         </div>
                       </div>
                       <div className="flex gap-2">
                         <button
                           onClick={() => {
                             setSelectedDate(date);
                             setActiveTab('morning');
                           }}
                           className="p-2 text-blue-600 hover:bg-blue-50 rounded"
                         >
                           修改
                         </button>
                         <button
                           onClick={() => deleteEntry(date)}
                           className="p-2 text-red-400 hover:bg-red-50 rounded"
                         >
                           <Trash2 size={18} />
                         </button>
                       </div>
                     </div>
                   );
                 })}
               </div>
             )}
          </div>
        )}

      </main>

      {/* Bottom Navigation */}
      <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 flex justify-around p-2 pb-safe md:max-w-3xl md:mx-auto md:rounded-t-xl md:shadow-2xl">
        <button
          onClick={() => setActiveTab('morning')}
          className={`flex flex-col items-center p-2 rounded-lg w-1/3 transition-colors ${activeTab === 'morning' ? 'text-blue-600 bg-blue-50' : 'text-slate-400'}`}
        >
          <Sun size={24} />
          <span className="text-xs mt-1">早上填寫</span>
        </button>
        <button
          onClick={() => setActiveTab('evening')}
          className={`flex flex-col items-center p-2 rounded-lg w-1/3 transition-colors ${activeTab === 'evening' ? 'text-indigo-600 bg-indigo-50' : 'text-slate-400'}`}
        >
          <Moon size={24} />
          <span className="text-xs mt-1">睡前填寫</span>
        </button>
        <button
          onClick={() => setActiveTab('history')}
          className={`flex flex-col items-center p-2 rounded-lg w-1/3 transition-colors ${activeTab === 'history' ? 'text-green-600 bg-green-50' : 'text-slate-400'}`}
        >
          <Calendar size={24} />
          <span className="text-xs mt-1">歷史/匯出</span>
        </button>
      </nav>
    </div>
  );
}
