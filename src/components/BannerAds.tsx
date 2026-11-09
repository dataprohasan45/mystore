import React, { useRef, useState } from 'react';
import { BannerAd, Language } from '../types';
import { Play, Pause, Volume2, VolumeX, ExternalLink, Sparkles, Megaphone } from 'lucide-react';

interface BannerAdsProps {
  placement: 'top' | 'middle' | 'bottom';
  ads: BannerAd[];
  lang: Language;
}

export const BannerAds: React.FC<BannerAdsProps> = ({ placement, ads, lang }) => {
  const activeAd = ads.find((a) => a.placement === placement && a.isActive);
  const [isPlaying, setIsPlaying] = useState(true);
  const [isMuted, setIsMuted] = useState(true);
  const videoRef = useRef<HTMLVideoElement>(null);

  if (!activeAd) return null;

  const toggleVideoPlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
      setIsPlaying(false);
    } else {
      videoRef.current.play();
      setIsPlaying(true);
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !isMuted;
    setIsMuted(!isMuted);
  };

  const title = lang === 'bn' ? activeAd.titleBn : activeAd.titleEn;
  const btnText = lang === 'bn' ? activeAd.buttonTextBn : activeAd.buttonTextEn;

  // TOP BAR (Ticker / Text Announcement style or compact banner)
  if (placement === 'top') {
    return (
      <aside aria-label="Top Announcement" className="bg-gradient-to-r from-red-600 via-green-700 to-green-900 text-white py-2 px-3 sm:px-6 shadow-sm border-b border-red-500/30">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2 text-xs sm:text-sm">
          <div className="flex items-center gap-2 font-medium">
            <span className="bg-white/20 p-1 rounded-full animate-bounce">
              <Megaphone className="w-3.5 h-3.5 text-yellow-300" />
            </span>
            <span className="font-semibold text-yellow-200">{title}</span>
            <span className="hidden md:inline text-white/90">| {activeAd.content}</span>
          </div>

          {activeAd.actionUrl && (
            <a
              href={activeAd.actionUrl}
              className="inline-flex items-center gap-1 bg-white text-gray-950 font-bold px-3 py-1 rounded-full text-xs shadow-sm hover:bg-yellow-300 transition-colors shrink-0"
            >
              <span>{btnText || (lang === 'bn' ? 'দেখুন' : 'Explore')}</span>
              <ExternalLink className="w-3 h-3 text-red-600" />
            </a>
          )}
        </div>
      </aside>
    );
  }

  // MIDDLE BANNER (Rich Promo with 15s Video or Large Image or Link Banner)
  if (placement === 'middle') {
    return (
      <section className="my-8 max-w-7xl mx-auto px-4 sm:px-6">
        <div className="relative rounded-2xl overflow-hidden border-2 border-red-600/30 shadow-lg bg-gradient-to-br from-green-900 via-gray-900 to-black text-white">
          {activeAd.type === 'video' ? (
            <div className="relative w-full aspect-[21/9] sm:aspect-[24/8] min-h-[220px] max-h-[360px] flex items-center justify-center bg-black">
              <video
                ref={videoRef}
                src={activeAd.content}
                autoPlay
                loop
                muted={isMuted}
                playsInline
                className="w-full h-full object-cover opacity-85"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/60 pointer-events-none" />

              {/* Overlay Content */}
              <div className="absolute inset-0 p-6 sm:p-10 flex flex-col justify-end pointer-events-auto">
                <div className="flex items-center gap-2 mb-2">
                  <span className="bg-red-600 text-white text-[11px] font-bold px-2.5 py-0.5 rounded uppercase tracking-wider shadow">
                    স্পেশাল ভিডিও এড (সর্বোচ্চ ১৫ সেকেন্ড)
                  </span>
                  <span className="bg-black/60 backdrop-blur text-xs px-2 py-0.5 rounded text-gray-300">
                    My Store Site Featured
                  </span>
                </div>
                <h3 className="text-xl sm:text-3xl font-black text-white drop-shadow mb-3 max-w-2xl leading-tight">
                  {title}
                </h3>
                <div className="flex flex-wrap items-center gap-3">
                  {activeAd.actionUrl && (
                    <a
                      href={activeAd.actionUrl}
                      className="bg-green-600 hover:bg-green-500 text-white font-bold text-sm px-5 py-2.5 rounded-lg shadow-md transition-all flex items-center gap-1.5"
                    >
                      <span>{btnText || (lang === 'bn' ? 'অফার কিনুন' : 'Shop Now')}</span>
                      <Sparkles className="w-4 h-4 text-yellow-300" />
                    </a>
                  )}

                  {/* Video Controls */}
                  <div className="flex items-center gap-2 bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10">
                    <button
                      onClick={toggleVideoPlay}
                      className="text-white hover:text-green-400 p-1"
                      title={isPlaying ? 'Pause' : 'Play'}
                    >
                      {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                    </button>
                    <button
                      onClick={toggleMute}
                      className="text-white hover:text-green-400 p-1"
                      title={isMuted ? 'Unmute' : 'Mute'}
                    >
                      {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
                    </button>
                    <span className="text-[11px] text-gray-300">১৫ সে. ক্লিপ</span>
                  </div>
                </div>
              </div>
            </div>
          ) : activeAd.type === 'image' ? (
            <div className="relative w-full aspect-[21/9] sm:aspect-[24/7] min-h-[180px] max-h-[300px]">
              <img
                src={activeAd.content}
                alt={title}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-black/85 via-black/40 to-transparent p-6 sm:p-10 flex flex-col justify-center">
                <span className="bg-red-600 text-white text-[11px] font-extrabold px-2.5 py-0.5 rounded w-max mb-2">
                  স্পন্সরড অফার
                </span>
                <h3 className="text-xl sm:text-3xl font-black text-white max-w-xl mb-3">
                  {title}
                </h3>
                {activeAd.actionUrl && (
                  <a
                    href={activeAd.actionUrl}
                    className="bg-green-600 hover:bg-green-500 text-white font-bold text-sm px-5 py-2.5 rounded-lg shadow-md w-max transition-all"
                  >
                    {btnText || (lang === 'bn' ? 'বিস্তারিত দেখুন' : 'Explore')}
                  </a>
                )}
              </div>
            </div>
          ) : (
            <div className="p-8 sm:p-10 bg-gradient-to-r from-red-800 via-gray-900 to-green-900 flex flex-col sm:flex-row items-center justify-between gap-6">
              <div>
                <span className="bg-yellow-400 text-gray-950 text-xs font-black px-2.5 py-0.5 rounded uppercase mb-2 inline-block">
                  বিজ্ঞাপন
                </span>
                <h3 className="text-xl sm:text-2xl font-black text-white mb-2">{title}</h3>
                <p className="text-gray-200 text-sm max-w-xl">{activeAd.content}</p>
              </div>
              {activeAd.actionUrl && (
                <a
                  href={activeAd.actionUrl}
                  className="bg-green-600 hover:bg-green-500 text-white font-bold px-6 py-3 rounded-xl shadow-lg shrink-0 transition-transform hover:scale-105"
                >
                  {btnText || (lang === 'bn' ? 'অংশ নিন' : 'Join Now')}
                </a>
              )}
            </div>
          )}
        </div>
      </section>
    );
  }

  // BOTTOM BANNER
  return (
    <aside aria-label="Bottom Promotion" className="my-6 max-w-7xl mx-auto px-4 sm:px-6">
      <div className="p-4 sm:p-6 rounded-2xl border border-green-600/30 bg-gradient-to-r from-green-50 via-white to-red-50 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-green-600 to-red-600 flex items-center justify-center text-white shrink-0 shadow">
            <Sparkles className="w-6 h-6 text-yellow-300" />
          </div>
          <div>
            <h4 className="font-black text-gray-900 text-base sm:text-lg">{title}</h4>
            <p className="text-xs sm:text-sm text-gray-700">{activeAd.content}</p>
          </div>
        </div>

        {activeAd.actionUrl && (
          <a
            href={activeAd.actionUrl}
            className="w-full sm:w-auto text-center bg-green-700 hover:bg-green-800 text-white font-bold px-5 py-2.5 rounded-xl text-sm shadow transition-colors shrink-0"
          >
            {btnText || (lang === 'bn' ? 'যোগাযোগ করুন' : 'Contact Us')}
          </a>
        )}
      </div>
    </aside>
  );
};
