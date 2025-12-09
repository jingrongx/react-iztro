import { Calendar, ChevronDown, Download, Maximize2, Save, Settings } from 'lucide-react';
import React, { useState } from 'react';

interface InputFormProps {
    onSubmit: (data: any) => void;
}

export default function InputForm({ onSubmit }: InputFormProps) {
    const [formData, setFormData] = useState({
        dateType: 'solar', // solar or lunar
        date: '1987-11-13',
        time: 7,
        gender: 'male',
        name: '',
        leap: false,
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        onSubmit(formData);
    };

    // 时辰选项 - 每个时辰使用其中间小时值
    const timeOptions = [
        { value: 0, label: '子 23:00-01:00' },
        { value: 2, label: '丑 01:00-03:00' },
        { value: 4, label: '寅 03:00-05:00' },
        { value: 6, label: '卯 05:00-07:00' },
        { value: 8, label: '辰 07:00-09:00' },
        { value: 10, label: '巳 09:00-11:00' },
        { value: 12, label: '午 11:00-13:00' },
        { value: 14, label: '未 13:00-15:00' },
        { value: 16, label: '申 15:00-17:00' },
        { value: 18, label: '酉 17:00-19:00' },
        { value: 20, label: '戌 19:00-21:00' },
        { value: 22, label: '亥 21:00-23:00' },
    ];

    return (
        <div className="w-80 bg-white dark:bg-gray-800 border-l border-gray-200 dark:border-gray-700 p-6 flex flex-col h-[calc(100vh-64px)] overflow-y-auto">
            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                    <label className="text-sm text-gray-500 dark:text-gray-400">日期类型</label>
                    <div className="flex rounded-lg bg-gray-100 dark:bg-gray-700 p-1">
                        <button
                            type="button"
                            className={`flex-1 py-1.5 text-sm rounded-md transition-colors ${formData.dateType === 'solar'
                                ? 'bg-white dark:bg-gray-600 shadow text-gray-900 dark:text-white'
                                : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                                }`}
                            onClick={() => setFormData({ ...formData, dateType: 'solar' })}
                        >
                            阳历
                        </button>
                        <button
                            type="button"
                            className={`flex-1 py-1.5 text-sm rounded-md transition-colors ${formData.dateType === 'lunar'
                                ? 'bg-white dark:bg-gray-600 shadow text-gray-900 dark:text-white'
                                : 'text-gray-500 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white'
                                }`}
                            onClick={() => setFormData({ ...formData, dateType: 'lunar' })}
                        >
                            农历
                        </button>
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-sm text-gray-500 dark:text-gray-400">生日</label>
                    <div className="relative">
                        <input
                            type="date"
                            value={formData.date}
                            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                            className="w-full pl-10 pr-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                        <Calendar className="absolute left-3 top-2.5 text-gray-400" size={16} />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-sm text-gray-500 dark:text-gray-400">时辰</label>
                    <div className="relative">
                        <select
                            value={formData.time}
                            onChange={(e) => setFormData({ ...formData, time: parseInt(e.target.value) })}
                            className="w-full pl-4 pr-10 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500 appearance-none"
                        >
                            {timeOptions.map((option) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </select>
                        <ChevronDown className="absolute right-3 top-2.5 text-gray-400" size={16} />
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-sm text-gray-500 dark:text-gray-400">性别</label>
                    <div className="flex gap-4">
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="radio"
                                name="gender"
                                value="male"
                                checked={formData.gender === 'male'}
                                onChange={() => setFormData({ ...formData, gender: 'male' })}
                                className="text-purple-600 focus:ring-purple-500"
                            />
                            <span className="text-sm text-gray-700 dark:text-gray-300">男</span>
                        </label>
                        <label className="flex items-center gap-2 cursor-pointer">
                            <input
                                type="radio"
                                name="gender"
                                value="female"
                                checked={formData.gender === 'female'}
                                onChange={() => setFormData({ ...formData, gender: 'female' })}
                                className="text-purple-600 focus:ring-purple-500"
                            />
                            <span className="text-sm text-gray-700 dark:text-gray-300">女</span>
                        </label>
                    </div>
                </div>

                <div className="space-y-2">
                    <label className="text-sm text-gray-500 dark:text-gray-400">名字</label>
                    <input
                        type="text"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        placeholder="请输入姓名"
                        className="w-full px-4 py-2 bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                </div>

                <button
                    type="submit"
                    className="w-full py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg font-medium transition-colors shadow-lg shadow-purple-200 dark:shadow-purple-900/20"
                >
                    排 盘
                </button>
            </form>

            <div className="mt-8 grid grid-cols-4 gap-4">
                <button className="flex flex-col items-center gap-1 text-xs text-gray-500 hover:text-purple-600 transition-colors">
                    <div className="p-2 rounded-lg bg-gray-50 dark:bg-gray-700 hover:bg-purple-50 dark:hover:bg-purple-900/30">
                        <Settings size={18} />
                    </div>
                    <span>设置</span>
                </button>
                <button className="flex flex-col items-center gap-1 text-xs text-gray-500 hover:text-purple-600 transition-colors">
                    <div className="p-2 rounded-lg bg-gray-50 dark:bg-gray-700 hover:bg-purple-50 dark:hover:bg-purple-900/30">
                        <Maximize2 size={18} />
                    </div>
                    <span>全屏</span>
                </button>
                <button className="flex flex-col items-center gap-1 text-xs text-gray-500 hover:text-purple-600 transition-colors">
                    <div className="p-2 rounded-lg bg-gray-50 dark:bg-gray-700 hover:bg-purple-50 dark:hover:bg-purple-900/30">
                        <Download size={18} />
                    </div>
                    <span>下载</span>
                </button>
                <button className="flex flex-col items-center gap-1 text-xs text-gray-500 hover:text-purple-600 transition-colors">
                    <div className="p-2 rounded-lg bg-gray-50 dark:bg-gray-700 hover:bg-purple-50 dark:hover:bg-purple-900/30">
                        <Save size={18} />
                    </div>
                    <span>保存</span>
                </button>
            </div>
        </div>
    );
}
