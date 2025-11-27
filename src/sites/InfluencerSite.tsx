import React from 'react';
import { FeatureIcon } from '../components/FeatureIcon';

const influencerFeatures = [
    { path: "M3 21v-8a2 2 0 012-2h14a2 2 0 012 2v8M17 9l-5-5-5 5m5-5v12", title: "Auto-Apology Generator", content: "Caught in a scandal? Our AI writes a tearful script in seconds. Includes 'deep sigh' and 'no makeup' filter suggestions." },
    { path: "M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z", title: "Brand Deal Hallucinator", content: "Generates fake emails from luxury brands to make your friends jealous. Fake it 'til you make it, babe." },
    { path: "M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z", title: "Bot Farm Access", content: "Get 10k likes instantly. Our bots have realistic names like 'User99283' so nobody will suspect a thing." },
    { path: "M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z", title: "Vlog Trauma Mining", content: "AI scans your childhood memories to find the most monetizable trauma for your next 'Storytime' video." }
];

const influencerPricing = [
    { name: "The Wannabe", price: "$0", features: ["Watermarked selfies", "Desperation (Included)", "1 Filter"], cta: "Start Begging" },
    { name: "The Sellout", price: "$499", period: "/mo", features: ["Verified Checkmark (Fake)", "Bot Access", "Sponsorship Templates"], cta: "Buy Clout", popular: true },
    { name: "The Reality Star", price: "$9,999", period: "/mo", features: ["Paparazzi Drone", "Ghostwriter for your Memoir", "Scandal Insurance"], cta: "Sell Your Soul" },
];

export const InfluencerSite = ({ onBuy }: { onBuy: (msg: string, color: string) => void }) => (
    <div className="bg-pink-50 min-h-screen font-sans text-gray-800">
        <main className="p-4 md:p-8 max-w-6xl mx-auto mr-0 md:mr-[350px] transition-all duration-300 pt-12">
             <header className="text-center mb-16 pt-8">
                <h1 className="text-5xl md:text-7xl font-black mb-4 text-pink-600 tracking-tight rotate-1">
                    Influencer<span className="text-purple-600 font-serif italic">OS</span>
                </h1>
                <p className="text-2xl text-purple-800 font-medium max-w-3xl mx-auto">
                    Don't just live your life. <span className="underline decoration-pink-400 decoration-4">Content it.</span>
                </p>
                <div className="flex justify-center space-x-2 mt-6">
                    <span className="bg-pink-200 text-pink-800 text-xs font-bold px-2 py-1 rounded-full">#Blessed</span>
                    <span className="bg-purple-200 text-purple-800 text-xs font-bold px-2 py-1 rounded-full">#GRWM</span>
                    <span className="bg-orange-200 text-orange-800 text-xs font-bold px-2 py-1 rounded-full">#Ad</span>
                </div>
            </header>

            <section className="mb-20 grid grid-cols-1 md:grid-cols-2 gap-8">
                {influencerFeatures.map((f, i) => (
                    <div key={i} className="p-6 bg-white rounded-3xl shadow-xl border-2 border-pink-100 hover:border-purple-400 transition-all transform hover:-rotate-1">
                        <FeatureIcon className="bg-gradient-to-br from-pink-400 to-purple-500 text-white ring-pink-300">
                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={f.path} />
                        </FeatureIcon>
                        <h3 className="text-xl font-bold text-gray-800 mb-2">{f.title}</h3>
                        <p className="text-gray-600">{f.content}</p>
                    </div>
                ))}
            </section>

            <section className="mb-16">
                 <h2 className="text-4xl font-bold text-center mb-12 text-purple-900">Invest in Your Vibe</h2>
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
                    {influencerPricing.map((tier, i) => (
                        <div key={i} className={`p-6 bg-white rounded-3xl shadow-xl flex flex-col border-2 ${tier.popular ? 'border-purple-500 ring-4 ring-purple-100' : 'border-gray-100'}`}>
                             {tier.popular && <span className="text-xs font-bold bg-gradient-to-r from-purple-400 to-pink-500 text-white py-1 px-3 rounded-full self-center -mt-9 mb-4 shadow-md">TRENDING</span>}
                             <h3 className="text-2xl font-bold text-gray-800 mb-2 text-center">{tier.name}</h3>
                             <div className="mb-6 text-center"><span className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-purple-600">{tier.price}</span><span className="text-gray-400">{tier.period}</span></div>
                             <ul className="space-y-3 text-gray-500 mb-8 flex-grow">
                                {tier.features.map((f, fi) => <li key={fi} className="flex items-center"><span className="text-pink-500 mr-2">♥</span>{f}</li>)}
                             </ul>
                             <button 
                                onClick={() => onBuy('Clout purchased. You still feel empty.', 'bg-pink-500')} 
                                className="w-full mt-auto px-4 py-3 bg-gray-900 text-white font-bold rounded-xl hover:bg-black transition-colors shadow-lg"
                             >
                                {tier.cta}
                             </button>
                        </div>
                    ))}
                 </div>
            </section>
            <footer className="text-center text-gray-400 text-sm py-8">
                <p>© 2025 InfluencerOS. We own your likeness in perpetuity.</p>
            </footer>
        </main>
    </div>
);
