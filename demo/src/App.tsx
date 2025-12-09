import { useState, useRef } from 'react';
import html2canvas from 'html2canvas';
import { Iztrolabe } from 'react-iztro';
import { astro } from 'iztro';
import Header from './components/Header';
import InputForm from './components/InputForm';
import AISettings from './components/AISettings';
import AIInterpretation from './components/AIInterpretation';
import dayjs from 'dayjs';
import './ziwei-theme.css';
import { isConfigured } from './services/aiConfig';
import { interpretAstrolabe, buildPrompt } from './services/deepseekService';

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
        // 等待一小段时间确保DOM渲染完成
        await new Promise(resolve => setTimeout(resolve, 100));

        const canvas = await html2canvas(astrolabeRef.current, {
          useCORS: true,
          allowTaint: true,
          scale: 2, // High resolution
          backgroundColor: '#ffffff', // Ensure white background
          logging: true, // Enable logging to debug
          onclone: (_doc) => {
            // 可以在这里处理克隆后的文档，比如修改样式
            console.log('DOM cloned for capture');
          }
        });

        const link = document.createElement('a');
        link.download = `ziwei-chart-${dayjs().format('YYYYMMDD-HHmmss')}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
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
    // 检查是否已配置API密钥
    if (!isConfigured()) {
      alert('请先在设置中配置DeepSeek API密钥');
      setShowSettings(true);
      return;
    }

    // 显示解读对话框并开始加载
    setShowInterpretation(true);
    setAiResult({
      content: '',
      reasoning: '',
      isLoading: true,
      error: '',
      promptData: '',
    });

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

      setAiResult(prev => ({ ...prev, promptData: prompt }));

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
        promptData: aiResult.promptData || prompt,
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
      <Header />
      <main className="flex-1 flex overflow-hidden">
        <div className="flex-1 p-4 md:p-8 pb-20 overflow-auto flex justify-center items-start md:items-center">
          <div ref={astrolabeRef} className="w-full max-w-5xl shadow-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-1">
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
    </div>
  );
}

export default App;
