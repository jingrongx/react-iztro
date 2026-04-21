import { useState, useRef, useEffect, useCallback } from 'react';
import { toPng } from 'html-to-image';
import { Iztrolabe } from 'react-iztro';
import { astro } from 'iztro';
import Header from './components/Header';
import InputForm from './components/InputForm';
import AISettings from './components/AISettings';
import AIInterpretation from './components/AIInterpretation';
import TauriUpdateBanner from './components/TauriUpdateBanner';
import UpdateChecker from './components/UpdateChecker';
import dayjs from 'dayjs';
import './ziwei-theme.css';
import { isConfigured } from './services/aiConfig';
import { interpretAstrolabe, buildPrompt } from './services/deepseekService';
import { openUrl } from './lib/openUrl';
import { isTauri } from './hooks/useTauriUpdater';

function App() {
  const [astrolabeData, setAstrolabeData] = useState({
    date: dayjs().format('YYYY-MM-DD'),
    time: 0,
    gender: 'male' as 'male' | 'female',
    dateType: 'solar' as 'solar' | 'lunar',
    leap: false,
  });

  const [showSettings, setShowSettings] = useState(false);
  const [showInterpretation, setShowInterpretation] = useState(false);
  const [aiResult, setAiResult] = useState({
    content: '',
    reasoning: '',
    isLoading: false,
    error: '',
    promptData: '',
  });

  const astrolabeRef = useRef<HTMLDivElement>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    const onFullscreenChange = () => {
      setIsFullscreen(!!document.fullscreenElement);
    };
    document.addEventListener('fullscreenchange', onFullscreenChange);
    document.addEventListener('webkitfullscreenchange', onFullscreenChange);
    return () => {
      document.removeEventListener('fullscreenchange', onFullscreenChange);
      document.removeEventListener('webkitfullscreenchange', onFullscreenChange);
    };
  }, []);

  const exitFullscreen = useCallback(() => {
    if (document.fullscreenElement) {
      document.exitFullscreen();
    }
  }, []);

  const handleFullscreen = () => {
    if (!document.fullscreenElement) {
      astrolabeRef.current?.requestFullscreen().catch(err => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`);
      });
    } else {
      document.exitFullscreen();
    }
  };

  const handleDownload = async () => {
    if (astrolabeRef.current) {
      try {
        await new Promise(resolve => setTimeout(resolve, 100));

        const dataUrl = await toPng(astrolabeRef.current, {
          cacheBust: true,
          backgroundColor: '#ffffff',
          pixelRatio: 2,
        });

        if (isTauri()) {
          const base64Data = dataUrl.split(',')[1];
          const fileName = `ziwei-chart-${dayjs().format('YYYYMMDD-HHmmss')}.png`;

          try {
            const { save } = await import('@tauri-apps/plugin-dialog');
            const filePath = await save({
              defaultPath: fileName,
              filters: [{ name: 'PNG', extensions: ['png'] }],
            });
            if (filePath) {
              const { writeFile } = await import('@tauri-apps/plugin-fs');
              const binaryString = atob(base64Data);
              const bytes = new Uint8Array(binaryString.length);
              for (let i = 0; i < binaryString.length; i++) {
                bytes[i] = binaryString.charCodeAt(i);
              }
              await writeFile(filePath, bytes);
              alert('图片保存成功！');
            }
          } catch (dialogErr) {
            console.warn('Tauri dialog/fs 失败，尝试备用方案:', dialogErr);
            const link = document.createElement('a');
            link.download = fileName;
            link.href = dataUrl;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
          }
        } else {
          const link = document.createElement('a');
          link.download = `ziwei-chart-${dayjs().format('YYYYMMDD-HHmmss')}.png`;
          link.href = dataUrl;
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        }
      } catch (e) {
        console.error('Download failed detail:', e);
        alert('下载失败，请重试。如果问题持续，请尝试使用系统自带截图工具。');
      }
    }
  };

  const handleSave = () => {
    try {
      const savedCharts = JSON.parse(localStorage.getItem('ziwei_saved_charts') || '[]');
      const newChart = {
        id: Date.now(),
        data: astrolabeData,
        savedAt: new Date().toISOString(),
        name: `命盘 ${dayjs().format('YYYY-MM-DD HH:mm')}`
      };
      savedCharts.push(newChart);
      localStorage.setItem('ziwei_saved_charts', JSON.stringify(savedCharts));
      alert('命盘保存成功！');
    } catch (e) {
      console.error('Save failed', e);
      alert('保存失败，请检查浏览器设置');
    }
  };



  const handleFormSubmit = (data: any) => {
    setAstrolabeData({
      date: data.date,
      time: data.time,
      gender: data.gender,
      dateType: data.dateType,
      leap: data.leap,
    });
  };

  const handleAIInterpret = async () => {
    try {
      // 使用iztro直接生成astrolabe数据
      const inputDate = dayjs(astrolabeData.date).format('YYYY-MM-DD');
      const astrolabeInstance = astrolabeData.dateType === 'solar'
        ? astro.bySolar(inputDate, astrolabeData.time, astrolabeData.gender)
        : astro.byLunar(inputDate, astrolabeData.time, astrolabeData.gender, astrolabeData.leap);

      // 生成运势数据
      const horoscopeInstance = astrolabeInstance.horoscope(new Date(), 0);
      const prompt = buildPrompt({
        astrolabe: astrolabeInstance,
        horoscope: horoscopeInstance,
      });

      // 检查是否已配置API密钥
      if (!isConfigured()) {
        setShowInterpretation(true);
        setAiResult({
          content: '',
          reasoning: '',
          isLoading: false,
          error: '未配置API密钥。您可以复制上方【发送给AI的数据】手动询问。',
          promptData: prompt,
        });
        return;
      }

      // 显示解读对话框并开始加载
      setShowInterpretation(true);
      setAiResult({
        content: '',
        reasoning: '',
        isLoading: true,
        error: '',
        promptData: prompt,
      });

      // 调用AI服务进行解读
      const result = await interpretAstrolabe({
        astrolabeData: {
          astrolabe: astrolabeInstance,
          horoscope: horoscopeInstance,
        },
      }, (text) => {
        setAiResult(prev => ({
          ...prev,
          content: text,
        }));
      });

      setAiResult({
        content: result.content,
        reasoning: result.reasoning || '',
        isLoading: false,
        error: '',
        promptData: prompt,
      });
    } catch (error) {
      setAiResult({
        content: '',
        reasoning: '',
        isLoading: false,
        error: error instanceof Error ? error.message : 'AI解读失败',
        promptData: aiResult.promptData,
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col font-sans transition-colors duration-200">
      <TauriUpdateBanner />
      <UpdateChecker />
      <Header />
      <main className="flex-1 flex flex-col md:flex-row md:overflow-hidden relative">
        <div className="flex-1 p-4 md:p-8 pb-20 md:pb-8 md:overflow-auto flex justify-center items-start">
          <div ref={astrolabeRef} onClick={isFullscreen ? exitFullscreen : undefined} className={`astrolabe-container w-full max-w-5xl shadow-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-0 md:p-1 relative${isFullscreen ? ' cursor-pointer' : ''}`}>
            <Iztrolabe
              birthday={astrolabeData.date}
              birthTime={astrolabeData.time}
              gender={astrolabeData.gender}
              birthdayType={astrolabeData.dateType}
              isLeapMonth={astrolabeData.leap}
              horoscopeDate={new Date()}
            />
          </div>
        </div>
        <InputForm
          onSubmit={handleFormSubmit}
          onAIInterpret={handleAIInterpret}
          onOpenSettings={() => setShowSettings(true)}
          onFullscreen={handleFullscreen}
          onDownload={handleDownload}
          onSave={handleSave}
        />
      </main>

      {/* AI设置对话框 */}
      <AISettings
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
      />

      {/* AI解读结果对话框 */}
      {showInterpretation && (
        <AIInterpretation
          content={aiResult.content}
          reasoning={aiResult.reasoning}
          isLoading={aiResult.isLoading}
          error={aiResult.error}
          promptData={aiResult.promptData}
          onClose={() => setShowInterpretation(false)}
        />
      )}

      {/* 推广区域 */}
      <footer className="bg-gray-50 dark:bg-gray-950 border-t border-gray-200 dark:border-gray-800 py-8 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <h3 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mb-2">🌿 经方家AI - 智能中医助手</h3>
          <p className="text-gray-600 dark:text-gray-400 mb-4">望诊+问诊辨证更准确，中医思维真中医</p>
          <p className="text-amber-600 dark:text-amber-400 mb-6">💡 建议使用电脑访问网页版，或下载安卓APP获得最佳体验</p>
          <div className="flex flex-wrap justify-center gap-4 mb-6">
            <a href="https://www.jingfangjia.chat/" target="_blank" rel="noopener noreferrer" onClick={(e) => { e.preventDefault(); openUrl('https://www.jingfangjia.chat/'); }} className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-6 rounded-lg transition-colors">访问官网</a>
            <a href="https://ghproxy.net/https://github.com/jingrongx/jingfangjia-ai-releases/releases/download/v1.7.51/JingFangJia-AI-v1.7.51.apk" target="_blank" rel="noopener noreferrer" onClick={(e) => { e.preventDefault(); openUrl('https://ghproxy.net/https://github.com/jingrongx/jingfangjia-ai-releases/releases/download/v1.7.51/JingFangJia-AI-v1.7.51.apk'); }} className="bg-green-600 hover:bg-green-700 text-white font-medium py-2 px-6 rounded-lg transition-colors">国内下载 APK</a>
            <a href="https://github.com/jingrongx/jingfangjia-ai-releases/releases/download/v1.7.51/JingFangJia-AI-v1.7.51.apk" target="_blank" rel="noopener noreferrer" onClick={(e) => { e.preventDefault(); openUrl('https://github.com/jingrongx/jingfangjia-ai-releases/releases/download/v1.7.51/JingFangJia-AI-v1.7.51.apk'); }} className="bg-gray-800 hover:bg-gray-900 text-white font-medium py-2 px-6 rounded-lg transition-colors">GitHub下载</a>
          </div>
          <p className="text-gray-600 dark:text-gray-400 mb-4">微信搜索关注【经方家AI】，免费获取海量中医经典资料</p>
          <p className="text-gray-500 dark:text-gray-500 text-sm">本程序仅供学习研究使用，请勿用于商业用途</p>
          <p className="text-gray-500 dark:text-gray-500 text-sm mt-2">© 2026 紫微斗数 - 传承传统占星文化</p>
        </div>
      </footer>
    </div>
  );
}

export default App;
