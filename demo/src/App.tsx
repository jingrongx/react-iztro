import { useState } from 'react';
import { Iztrolabe } from 'react-iztro';
import Header from './components/Header';
import InputForm from './components/InputForm';
import dayjs from 'dayjs';
import './ziwei-theme.css';

function App() {
  const [astrolabeData, setAstrolabeData] = useState({
    date: '1987-11-13',
    time: 7,
    gender: 'male' as 'male' | 'female',
    dateType: 'solar' as 'solar' | 'lunar',
    leap: false,
  });

  const handleFormSubmit = (data: any) => {
    setAstrolabeData({
      date: data.date,
      time: data.time,
      gender: data.gender,
      dateType: data.dateType,
      leap: data.leap,
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex flex-col font-sans transition-colors duration-200">
      <Header />
      <main className="flex-1 flex overflow-hidden">
        <div className="flex-1 p-4 md:p-8 pb-20 overflow-auto flex justify-center items-start md:items-center">
          <div className="w-full max-w-5xl aspect-square shadow-2xl rounded-2xl bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-800 p-1">
            <Iztrolabe
              birthday={astrolabeData.date}
              birthTime={astrolabeData.time}
              gender={astrolabeData.gender}
              birthdayType={astrolabeData.dateType}
              isLeapMonth={astrolabeData.leap}
              horoscopeDate={dayjs(astrolabeData.date).toDate()}
            />
          </div>
        </div>
        <InputForm onSubmit={handleFormSubmit} />
      </main>
    </div>
  );
}

export default App;
