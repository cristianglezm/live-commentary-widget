import React from 'react';
import { FeatureIcon } from '../components/FeatureIcon';

const synergyFeatures = [
    {
        path: "M13 10V3L4 14h7v7l9-11h-7z",
        title: "Hyper-Dynamic AI Synergy",
        content: "Powered by a script we found on GitHub. It analyzes your JPEGs and tells you they're JPEGs. Groundbreaking."
    },
    {
        path: "M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z",
        title: "Blockchain Fortification",
        content: "We wrote 'blockchain' on a whiteboard and now your data is 5000% more secure. Trust us, we're experts."
    },
    {
        path: "M13 7h8m0 0v8m0-8l-8 8-4-4-6 6",
        title: "Real-Time KPI Annihilator",
        content: "Tired of metrics? Our dashboard displays random green numbers that go up. Your boss will love the engagement."
    },
    {
        path: "M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z",
        title: "Guilt-Free Open Source",
        content: "We take open source code, package it, and sell it back to you for a 10,000% markup. It's the circle of life."
    },
    {
        path: "M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z",
        title: "Artisanal, Hand-Crafted AI",
        content: "Our 'OpenAI compatible endpoint' is powered by real people. You get that authentic human touch, whether you want it or not."
    },
    {
        path: "M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v.01M12 6v-1m0-1V4m0 2.01v.01M12 14v4m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M12 14c-1.657 0-3-.895-3-2s1.343-2 3-2 3 .895 3 2-1.343 2-3 2m0 0c1.11 0 2.08.402 2.599 1",
        title: "Proactive Data Monetization",
        content: "Why just store user data when you can sell it? We find buyers you've never heard of. It's not a bug, it's a feature."
    }
];

const synergyPricing = [
    { name: "The Intern", price: "$999", period: "/mo", features: ["Look at the login page", "Basic disappointment", "Hope (sold separately)"], cta: "Start Losing Money" },
    { name: "The Middle Manager", price: "$4,999", period: "/mo", features: ["A functional dashboard!", "Numbers that look impressive", "Advanced existential dread"], cta: "Embrace Mediocrity", popular: true },
    { name: "The C-Suite", price: "$24,999", period: "/mo", features: ["A framed stock photo", "Your name in a press release", "We laugh at your jokes"], cta: "Achieve Irrelevance" },
];

export const SynergySharkSite = ({ onBuy }: { onBuy: (msg: string, color: string) => void }) => (
    <div className="bg-gray-900 min-h-screen font-sans text-gray-200">
        <main className="p-4 md:p-8 max-w-6xl mx-auto mr-0 md:mr-[350px] transition-all duration-300 pt-12">
            <header className="text-center mb-16 pt-8">
                <h1 className="text-5xl md:text-7xl font-extrabold mb-4 text-white tracking-tighter">
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-pink-500">
                        SynergyShark AI
                    </span>
                </h1>
                <p className="text-2xl text-gray-400 font-light max-w-3xl mx-auto">
                    Monetize Everything. Even Your Soul.
                </p>
                <p className="text-md text-gray-500 mt-4 max-w-2xl mx-auto">
                    Leverage our bleeding-edge, open-source-fueled AI paradigm to achieve unparalleled synergy. Or just look busy.
                </p>
            </header>

            <section className="mb-20 grid grid-cols-1 md:grid-cols-2 gap-8">
                {synergyFeatures.map((f, i) => (
                    <div key={i} className="p-6 bg-gray-800/50 rounded-xl shadow-lg border border-gray-700 hover:border-pink-500 transition-all transform hover:-translate-y-1">
                        <FeatureIcon className="bg-indigo-900 text-indigo-400 ring-indigo-500/50">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={f.path} />
                        </FeatureIcon>
                        <h3 className="text-xl font-bold text-white mb-2">{f.title}</h3>
                        <p className="text-gray-400">{f.content}</p>
                    </div>
                ))}
            </section>

            <section className="mb-16">
                 <h2 className="text-4xl font-bold text-center mb-12 text-white">Our Completely Reasonable Prices</h2>
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-start">
                    {synergyPricing.map((tier, i) => (
                        <div key={i} className={`p-6 bg-gray-800 rounded-xl shadow-2xl flex flex-col border ${tier.popular ? 'border-pink-500 scale-105' : 'border-gray-700'}`}>
                             {tier.popular && <span className="text-xs font-bold bg-pink-500 text-white py-1 px-3 rounded-full self-center -mt-9 mb-4">POPULAR</span>}
                             <h3 className="text-2xl font-bold text-white mb-2 text-center">{tier.name}</h3>
                             <div className="mb-6 text-center"><span className="text-4xl font-extrabold">{tier.price}</span><span className="text-gray-400">{tier.period}</span></div>
                             <ul className="space-y-3 text-gray-400 mb-8 flex-grow">
                                {tier.features.map((f, fi) => <li key={fi} className="flex items-center"><span className="text-green-400 mr-2">✓</span>{f}</li>)}
                             </ul>
                             <button 
                                onClick={() => onBuy('Transaction "Successful"! Thanks, sucker!', 'bg-indigo-600')} 
                                className="w-full mt-auto px-4 py-3 bg-indigo-600 text-white font-bold rounded-lg hover:bg-indigo-700 transition-colors"
                             >
                                {tier.cta}
                             </button>
                        </div>
                    ))}
                 </div>
            </section>
             <footer className="text-center text-gray-600 text-sm py-8 border-t border-gray-800">
                <p>© 2025 SynergyShark AI. All your data are belong to us.</p>
            </footer>
        </main>
    </div>
);
