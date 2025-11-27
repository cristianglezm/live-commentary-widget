import React, { useState, useRef } from 'react';
import { LiveCommentary, createChatMessage } from '@cristianglezm/live-commentary-widget';
import { PurchaseAlert } from './components/PurchaseAlert';
import { NavBar } from './components/NavBar';
import { SynergySharkSite } from './sites/SynergySharkSite';
import { InfluencerSite } from './sites/InfluencerSite';
import { CryptoSite } from './sites/CryptoSite';
import { FootballSite } from './sites/FootballSite';

const footballUsernames = [
  "Goal_Screamer", "RefHater99", "Offside_King", "VAR_Official", "RedFan_4Life",
  "BlueArmy", "TacticalGenius", "Nutmeg_Prince", "SundayLeaguePro", "BenchWarmer",
  "CasualFan", "Ultra_1990", "CleanSheet", "HooliganHarry", "FairPlayFail"
];

function App() {
  const [currentSite, setCurrentSite] = useState<'synergy' | 'influencer' | 'crypto' | 'football'>('synergy');
  const [alert, setAlert] = useState<{show: boolean, msg: string, color: string}>({ show: false, msg: '', color: '' });
  
  // Bridge to hold the external capture function (for Football site)
  const captureSourceRef = useRef<(() => string | null) | null>(null);

  const handleBuy = (msg: string, color: string) => {
    setAlert({ show: true, msg, color });
    setTimeout(() => setAlert(prev => ({ ...prev, show: false })), 4000);
  };

  // Dynamic configuration based on the active site
  const getWidgetConfig = () => {
    switch(currentSite) {
        case 'synergy':
            return {
                title: 'Business Consultant',
                showBadges: false,
                prompts: {
                    system: `You are a cynical Corporate Business Consultant. 
                             You love buzzwords like 'synergy', 'paradigm shift', and 'circle back'.
                             Your goal is to sound expensive but useless.
                             Comment on the business viability of the screen content.
                             Keep comments short.`,
                    interval: "Analyze the business value of this screen.",
                    chat: "The client asked: '{{userPrompt}}'. Give a corporate non-answer."
                },
                contextData: { 
                    revenue: "Zero", 
                    burnRate: "High", 
                    currentQuarter: "Q3" 
                },
                usernames: undefined // Use default
            };
        case 'influencer':
            return {
                title: 'Hype Squad',
                showBadges: true,
                prompts: {
                    system: `You are a Gen-Z social media hype beast / roaster. 
                             You use lots of slang (no cap, fr, slay, mid).
                             If something looks expensive, hype it. If it looks cheap, roast it.
                             Keep comments very short and punchy.`,
                    interval: "Judge the aesthetic of this screen.",
                    chat: "The fan said: '{{userPrompt}}'. React with maximum drama."
                },
                contextData: { 
                    followerCount: "10k (bought)", 
                    trendingStatus: "Flopping" 
                },
                usernames: undefined
            };
        case 'crypto':
            return {
                title: 'Crypto Degen',
                showBadges: true,
                prompts: {
                    system: `You are a nervous Crypto Trader. 
                             You are obsessed with 'green candles', 'mooning', and 'fud'.
                             Everything is either a scam or the next Bitcoin.
                             Scream about buying or selling.
                             Keep comments frantic and short.`,
                    interval: "Check the charts (screen) for signals.",
                    chat: "A holder said: '{{userPrompt}}'. Shrill response required."
                },
                contextData: { 
                    ethPrice: "Volatile", 
                    portfolio: "-99%" 
                },
                usernames: undefined
            };
        case 'football':
            return {
                title: 'Match Commentary',
                showBadges: true,
                prompts: {
                    system: `You are a high-energy Football (Soccer) Commentator.
                             You are watching a live match between Red FC and Blue Utd.
                             React excitedly to goals, near misses, and ball possession.
                             Use phrases like "WHAT A STRIKE", "Unbelievable!", "Solid defense".
                             If the ball is near the goal, get hyped.
                             Keep comments short, punchy, and emotional.`,
                    interval: "Describe the current play on the field.",
                    chat: "A viewer asked: '{{userPrompt}}'. Answer like a sportscaster."
                },
                contextData: {
                    matchStatus: "Live",
                    teams: ["Red FC", "Blue Utd"]
                },
                usernames: footballUsernames
            };
    }
  };

  const widgetConfig = getWidgetConfig();

  return (
    <div>
      <LiveCommentary 
        key={currentSite}
        mode={currentSite === 'football' ? 'external' : 'screen-capture'}
        captureSource={() => captureSourceRef.current ? captureSourceRef.current() : null}
        config={{
            temperature: 0.8,
            captureInterval: currentSite === 'football' ? 6 : 10 // Faster commentary for sports
        }} 
        title={widgetConfig.title}
        showBadges={widgetConfig.showBadges}
        prompts={widgetConfig.prompts}
        contextData={widgetConfig.contextData}
        usernames={widgetConfig.usernames}
        // Example of middleware usage for the Football site to force specific announcer names if we wanted:
        /*
        responseTransform={currentSite === 'football' ? (text) => {
            // Simple pass-through example, but you could parse JSON here
            return [createChatMessage(text, "Announcer Bot", "#FFD700")];
        } : undefined}
        */
      />
      
      <NavBar currentSite={currentSite} setCurrentSite={setCurrentSite} />

      <div className="pt-16">
          {currentSite === 'synergy' && <SynergySharkSite onBuy={handleBuy} />}
          {currentSite === 'influencer' && <InfluencerSite onBuy={handleBuy} />}
          {currentSite === 'crypto' && <CryptoSite onBuy={handleBuy} />}
          {currentSite === 'football' && (
              <FootballSite 
                onRegisterCapture={(fn) => { captureSourceRef.current = fn; }} 
              />
          )}
      </div>

      {alert.show && <PurchaseAlert message={alert.msg} colorClass={alert.color} />}
    </div>
  );
}

export default App;
