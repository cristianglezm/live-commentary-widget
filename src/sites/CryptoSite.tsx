import React from 'react';
import { FeatureIcon } from '../components/FeatureIcon';

const cryptoFeatures = [
    { path: "M13 10V3L4 14h7v7l9-11h-7z", title: "Proof of Steak", content: "Our consensus mechanism validates transactions based on how well you marinate your tofu. Tasty and secure." },
    { path: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v.01M12 6v-1m0-1V4m0 2.01v.01M12 14v4m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M12 14c-1.657 0-3-.895-3-2s1.343-2 3-2 3 .895 3 2-1.343 2-3 2m0 0c1.11 0 2.08.402 2.599 1", title: "Rug Pull Protection", content: "We promise to notify you exactly 1 second after we drain the liquidity pool. Radical transparency." },
    { path: "M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z", title: "Whitepaper (Blank)", content: "Our whitepaper is actually just a blank PDF. It represents the limitless potential of your imagination (and our lack of a plan)." },
    { path: "M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z", title: "Yield Farming", content: "Plant your tokens in our digital soil. Warning: May contain pests, bugs, and financial ruin." }
];

const cryptoPricing = [
    { name: "Shrimp", price: "0.05 ETH", features: ["Access to Discord", "Hype Memes", "FOMO"], cta: "Ape In" },
    { name: "Whale", price: "50 ETH", features: ["Private Telegram", "Insider Info", "Exit Liquidity"], cta: "Pump It", popular: true },
    { name: "The Dev", price: "???", features: ["Admin Keys", "Mint Function", "Tornado Cash Access"], cta: "Deploy Scam" },
];

export const CryptoSite = ({ onBuy }: { onBuy: (msg: string, color: string) => void }) => (
    <div className="bg-black min-h-screen font-mono text-green-500">
        <main className="p-4 md:p-8 max-w-6xl mx-auto mr-0 md:mr-[350px] transition-all duration-300 pt-12">
             <header className="text-center mb-16 pt-8 border-b border-green-900 pb-8">
                <h1 className="text-5xl md:text-6xl font-bold mb-4 tracking-tighter animate-pulse">
                    Defi<span className="text-white">Tofu</span>_DAO
                </h1>
                <p className="text-xl text-green-700 max-w-3xl mx-auto">
                    &lt;Protocol status="alpha" risk="extreme" /&gt;
                </p>
                <p className="text-md text-green-800 mt-4 max-w-2xl mx-auto">
                    The world's first decentralized bean curd ecosystem. 1 TOFU = 1 TOFU.
                </p>
                 <div className="mt-6 font-bold text-red-500 border border-red-900 inline-block px-4 py-1 rounded bg-red-900/20">
                    WARNING: NOT FINANCIAL ADVICE. WE DON'T KNOW WHAT WE ARE DOING.
                </div>
            </header>

            <section className="mb-20 grid grid-cols-1 md:grid-cols-2 gap-8">
                {cryptoFeatures.map((f, i) => (
                    <div key={i} className="p-6 bg-gray-900 rounded-none border border-green-800 hover:bg-green-900/20 transition-all">
                        <FeatureIcon className="bg-black text-green-500 ring-green-700 shadow-green-900/50">
                             <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={f.path} />
                        </FeatureIcon>
                        <h3 className="text-xl font-bold text-white mb-2">&gt; {f.title}</h3>
                        <p className="text-green-700">{f.content}</p>
                    </div>
                ))}
            </section>

            <section className="mb-16">
                 <h2 className="text-3xl font-bold text-center mb-12 text-white">Tokenomics / Ponzi Scheme</h2>
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
                    {cryptoPricing.map((tier, i) => (
                        <div key={i} className={`p-6 bg-black border-2 ${tier.popular ? 'border-green-400 shadow-[0_0_20px_rgba(74,222,128,0.3)]' : 'border-green-900'} flex flex-col relative`}>
                             <h3 className="text-2xl font-bold text-white mb-2 text-center uppercase">[{tier.name}]</h3>
                             <div className="mb-6 text-center"><span className="text-3xl font-bold text-green-400">{tier.price}</span></div>
                             <ul className="space-y-3 text-green-800 mb-8 flex-grow font-sm">
                                {tier.features.map((f, fi) => <li key={fi} className="flex items-center">-- {f}</li>)}
                             </ul>
                             <button 
                                onClick={() => onBuy('Funds are SAFU (and gone).', 'bg-green-600')} 
                                className="w-full mt-auto px-4 py-3 bg-green-700 text-black font-bold hover:bg-green-500 transition-colors uppercase tracking-widest"
                             >
                                {tier.cta}
                             </button>
                        </div>
                    ))}
                 </div>
            </section>
            <footer className="text-center text-green-900 text-xs py-8 border-t border-green-900">
                <p>Running on Testnet. Do not send real funds. Or do, we can't stop you.</p>
            </footer>
        </main>
    </div>
);
