import React, { useState, useEffect } from 'react';
import { useLanguage } from '../contexts/LanguageContext';

interface ARModel {
    id: string;
    fileName: string;
    name: {
        en: string;
        zh: string;      // Traditional Chinese
        zhHans?: string; // Simplified Chinese
    };
    imageUrl: string;
}

const Play: React.FC = () => {
    const { language } = useLanguage();
    const [isIOS, setIsIOS] = useState(false);

    const arModels: ARModel[] = [
        {
            id: 'chinese-knot',
            fileName: 'Chinese_knotting.usdz',
            name: {
                en: 'Chinese Knot',
                zh: '中國結',
                zhHans: '中国结',
            },
            imageUrl: 'https://cdn.shopify.com/s/files/1/0756/3486/8539/files/O1CN01ve66dU1GNQU2kvm1A__2216587900610-0-cib_480x480.jpg?v=1705579996'
        },
        {
            id: 'neon',
            fileName: 'Neon.usdz',
            name: {
                en: 'Neon Sign',
                zh: '霓虹燈',
                zhHans: '霓虹灯',
            },
            imageUrl: 'https://www.cathaypacific.com/content/dam/focal-point/cx/inspiration/2025/09/HoHK-Hong_Kong_neon_sign-Credit_Elvis_Chung-4.renditionimage.1700.1133.jpg?w=480&h=480&fit=crop'
        },
        {
            id: 'cathay-plane',
            fileName: 'Cathay_Pacific_Airbus_A330-300.usdz',
            name: {
                en: 'Cathay Pacific Airbus A330-300',
                zh: '國泰航空空中巴士 A330-300',
                zhHans: '国泰航空空中巴士 A330-300',
            },
            imageUrl: 'https://images.unsplash.com/photo-1569629743817-70d8db6c323b?w=480&h=480&fit=crop'
        }
    ];

    const getLocalizedModelName = (model: ARModel) => {
        if (language === 'zhHans' && model.name.zhHans) return model.name.zhHans;
        if (language === 'zh') return model.name.zh;
        return model.name.en;
    };

    useEffect(() => {
        // Detect iOS devices
        const userAgent = navigator.userAgent.toLowerCase();
        const isIOSDevice = /iphone|ipad|ipod/.test(userAgent) ||
            (userAgent.includes('macintosh') && navigator.maxTouchPoints > 1);
        setIsIOS(isIOSDevice);
    }, []);

    const handleDownloadUSDZ = (fileName: string) => {
        // Create a temporary link to download the USDZ file
        const link = document.createElement('a');
        link.href = `/${fileName}`;
        link.download = fileName;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handlePlayNowIOS = (fileName: string) => {
        // For iOS devices, open USDZ file directly with Quick Look
        const link = document.createElement('a');
        link.href = `/${fileName}`;
        link.rel = 'ar';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    return (
        <div className="h-full w-full flex flex-col bg-[var(--color-page-bg)] text-[var(--color-text-primary)] overflow-y-auto">
            <header className="p-6 pb-2 sticky top-0 bg-[var(--color-page-bg)]/80 backdrop-blur-md z-10">
                <h1 className="text-2xl font-bold text-[var(--color-text-primary)] mb-1">
                    {language !== 'en' ? '遊玩' : 'Play'}
                </h1>
                <p className="text-[17px] text-[var(--color-text-secondary)]">
                    {language !== 'en' ? 'AR 體驗' : 'AR Experience'}
                </p>
            </header>

            <div className="flex-grow p-6 space-y-6">
                {/* AR Model Cards */}
                {arModels.map((model) => (
                    <div 
                        key={model.id}
                        className="w-full rounded-2xl bg-[var(--color-surface)] border border-[var(--color-border)] shadow-lg overflow-hidden"
                    >
                        <div className="p-6 text-center">
                            <div className="w-20 h-20 bg-[var(--color-page-bg)] rounded-full flex items-center justify-center mx-auto mb-4 border-2 border-[var(--color-border)] overflow-hidden">
                                <img
                                    src={model.imageUrl}
                                    alt={getLocalizedModelName(model)}
                                    className="w-full h-full object-cover"
                                />
                            </div>

                            <h2 className="text-xl font-bold text-[var(--color-primary-accent)] mb-2">
                                {getLocalizedModelName(model)}
                            </h2>

                            <p className="text-[var(--color-text-secondary)] text-sm mb-6">
                                {isIOS ? (
                                    language !== 'en'
                                        ? '點擊「立即遊玩」使用 Quick Look 體驗 AR，或下載檔案供稍後使用'
                                        : 'Tap "Play now!" to experience AR with Quick Look, or download for later use'
                                ) : (
                                    language !== 'en'
                                        ? '下載 3D 模型檔案以體驗 AR'
                                        : 'Download 3D model file for AR experience'
                                )}
                            </p>

                            {/* iOS Quick Look Play Button or Download Button */}
                            {isIOS ? (
                                <div className="space-y-3">
                                    <button
                                        onClick={() => handlePlayNowIOS(model.fileName)}
                                        className="w-full bg-gradient-to-r from-[var(--color-primary-accent)] to-[var(--color-secondary-accent)] hover:from-[#004D4C] hover:to-[#006564] text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 relative flex items-center justify-center shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
                                    >
                                        <div className="absolute left-5 w-7 h-7 bg-white/20 rounded-full flex items-center justify-center">
                                            <svg className="w-3.5 h-3.5 text-white" fill="currentColor" viewBox="0 0 24 24">
                                                <path d="M8 5v14l11-7z" />
                                            </svg>
                                        </div>
                                        <span className="text-center font-semibold">
                                            {language !== 'en' ? '立即遊玩！' : 'Play now!'}
                                        </span>
                                    </button>
                                    <button
                                        onClick={() => handleDownloadUSDZ(model.fileName)}
                                        className="w-full bg-[var(--color-primary-accent)] hover:bg-[var(--color-primary-accent)]/90 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 relative flex items-center justify-center shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
                                    >
                                        <div className="absolute left-5 w-7 h-7 bg-white/20 rounded-full flex items-center justify-center">
                                            <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                                                <path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                            </svg>
                                        </div>
                                        <span className="text-center font-semibold">
                                            {language !== 'en' ? '下載 AR 模型' : 'Download AR Model'}
                                        </span>
                                    </button>
                                </div>
                            ) : (
                                <button
                                    onClick={() => handleDownloadUSDZ(model.fileName)}
                                    className="w-full bg-[var(--color-primary-accent)] hover:bg-[var(--color-primary-accent)]/90 text-white font-semibold py-4 px-6 rounded-xl transition-all duration-300 relative flex items-center justify-center shadow-lg hover:shadow-xl transform hover:scale-[1.02]"
                                >
                                    <div className="absolute left-5 w-7 h-7 bg-white/20 rounded-full flex items-center justify-center">
                                        <svg className="w-3.5 h-3.5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2.5}>
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                        </svg>
                                    </div>
                                    <span className="text-center font-semibold">
                                        {language !== 'en' ? '下載 AR 模型' : 'Download AR Model'}
                                    </span>
                                </button>
                            )}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default Play;


