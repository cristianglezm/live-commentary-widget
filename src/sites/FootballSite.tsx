import React, { useEffect, useRef, useState } from 'react';

interface Entity {
    x: number;
    y: number;
    vx: number;
    vy: number;
    radius: number;
    color: string;
    speed: number;
}

interface Player extends Entity {
    team: 'red' | 'blue';
    role: 'goalie' | 'defender' | 'forward';
    homeX: number; // Normalized (0-1) home position
    homeY: number; // Normalized (0-1) home position
    cooldown: number; // Frames until can kick again
    number: number;
}

const FIELD_WIDTH = 800;
const FIELD_HEIGHT = 500;
const GOAL_HEIGHT = 140;

interface FootballSiteProps {
    onRegisterCapture?: (captureFn: () => string | null) => void;
}

export const FootballSite: React.FC<FootballSiteProps> = ({ onRegisterCapture }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [score, setScore] = useState({ red: 0, blue: 0 });
    const [gameTime, setGameTime] = useState(0);
    const requestRef = useRef<number>(null);

    // Initial setup with 5v5
    const createTeam = (team: 'red' | 'blue'): Player[] => {
        const isRed = team === 'red';
        const color = isRed ? '#ef4444' : '#3b82f6';
        const baseSpeed = 3.5;
        
        // Define formation relative to team side
        // Goalie, 2 Defenders, 2 Forwards
        const configs = [
            { role: 'goalie', x: 0.05, y: 0.5, speed: baseSpeed * 0.8 },
            { role: 'defender', x: 0.25, y: 0.3, speed: baseSpeed * 0.9 },
            { role: 'defender', x: 0.25, y: 0.7, speed: baseSpeed * 0.9 },
            { role: 'forward', x: 0.45, y: 0.4, speed: baseSpeed * 1.1 },
            { role: 'forward', x: 0.45, y: 0.6, speed: baseSpeed * 1.1 },
        ];

        return configs.map((cfg, i) => {
            const homeX = isRed ? cfg.x : 1 - cfg.x;
            return {
                x: homeX * FIELD_WIDTH,
                y: cfg.y * FIELD_HEIGHT,
                vx: 0,
                vy: 0,
                radius: 12,
                color,
                speed: cfg.speed,
                team,
                role: cfg.role as any,
                homeX,
                homeY: cfg.y,
                cooldown: 0,
                number: i + 1
            };
        });
    };

    // Game State
    const state = useRef({
        ball: { x: FIELD_WIDTH / 2, y: FIELD_HEIGHT / 2, vx: 0, vy: 0, radius: 8, color: '#ffffff', speed: 0 },
        players: [...createTeam('red'), ...createTeam('blue')],
        isGoal: false,
    });

    // Register capture function for the AI widget
    useEffect(() => {
        if (onRegisterCapture) {
            onRegisterCapture(() => {
                if (canvasRef.current) {
                    return canvasRef.current.toDataURL('image/jpeg', 0.8);
                }
                return null;
            });
        }
    }, [onRegisterCapture]);

    const resetBall = () => {
        state.current.ball.x = FIELD_WIDTH / 2;
        state.current.ball.y = FIELD_HEIGHT / 2;
        state.current.ball.vx = 0;
        state.current.ball.vy = 0;
        state.current.isGoal = false;
        
        // Reset positions
        state.current.players.forEach(p => {
            p.x = p.homeX * FIELD_WIDTH;
            p.y = p.homeY * FIELD_HEIGHT;
            p.vx = 0;
            p.vy = 0;
            p.cooldown = 0;
        });
    };

    const update = () => {
        const { ball, players, isGoal } = state.current;
        if (isGoal) return;

        setGameTime(prev => prev + 1);

        // --- Ball Physics ---
        // Friction
        ball.vx *= 0.98;
        ball.vy *= 0.98;
        ball.x += ball.vx;
        ball.y += ball.vy;

        // Wall collisions (Y Axis)
        if (ball.y < ball.radius) {
            ball.y = ball.radius;
            ball.vy *= -0.8;
        } else if (ball.y > FIELD_HEIGHT - ball.radius) {
            ball.y = FIELD_HEIGHT - ball.radius;
            ball.vy *= -0.8;
        }

        // Goal Logic (X Axis)
        if (ball.x < ball.radius) {
            if (ball.y > (FIELD_HEIGHT - GOAL_HEIGHT) / 2 && ball.y < (FIELD_HEIGHT + GOAL_HEIGHT) / 2) {
                // Goal Blue
                state.current.isGoal = true;
                setScore(s => ({ ...s, blue: s.blue + 1 }));
                setTimeout(resetBall, 1500);
            } else {
                ball.x = ball.radius;
                ball.vx *= -0.8;
            }
        } else if (ball.x > FIELD_WIDTH - ball.radius) {
            if (ball.y > (FIELD_HEIGHT - GOAL_HEIGHT) / 2 && ball.y < (FIELD_HEIGHT + GOAL_HEIGHT) / 2) {
                // Goal Red
                state.current.isGoal = true;
                setScore(s => ({ ...s, red: s.red + 1 }));
                setTimeout(resetBall, 1500);
            } else {
                ball.x = FIELD_WIDTH - ball.radius;
                ball.vx *= -0.8;
            }
        }

        // --- Player Logic ---
        // Determine closest player per team to chase ball
        let closestRed: Player | null = null;
        let minRedDist = Infinity;
        let closestBlue: Player | null = null;
        let minBlueDist = Infinity;

        players.forEach(p => {
            if (p.role === 'goalie') return; // Goalies don't chase far
            const dist = Math.hypot(ball.x - p.x, ball.y - p.y);
            if (p.team === 'red' && dist < minRedDist) { minRedDist = dist; closestRed = p; }
            if (p.team === 'blue' && dist < minBlueDist) { minBlueDist = dist; closestBlue = p; }
        });

        players.forEach(p => {
            if (p.cooldown > 0) p.cooldown--;

            let targetX = p.homeX * FIELD_WIDTH;
            let targetY = p.homeY * FIELD_HEIGHT;
            let chase = false;

            const myGoalX = p.team === 'red' ? 0 : FIELD_WIDTH;
            const oppGoalX = p.team === 'red' ? FIELD_WIDTH : 0;

            if (p.role === 'goalie') {
                // Goalie tracks ball Y but stays near home X
                targetX = p.homeX * FIELD_WIDTH;
                // Clamp Y to penalty box area (roughly)
                const yLimit = 100;
                targetY = Math.max(FIELD_HEIGHT/2 - yLimit, Math.min(FIELD_HEIGHT/2 + yLimit, ball.y));
                
                // If ball comes very close, charge it
                if (Math.abs(ball.x - p.x) < 100 && Math.abs(ball.y - p.y) < 100) {
                     targetX = ball.x;
                     targetY = ball.y;
                     chase = true;
                }
            } else if (p === closestRed || p === closestBlue) {
                // Closest player chases ball
                targetX = ball.x;
                targetY = ball.y;
                chase = true;
            } else {
                // Formation logic
                // Shift formation based on ball position
                const ballXRatio = ball.x / FIELD_WIDTH;
                const shiftX = (ballXRatio - 0.5) * 200; // Shift whole team forward/back
                
                // Defenders stay behind ball mostly
                if (p.role === 'defender') {
                    targetX = (p.homeX * FIELD_WIDTH) + shiftX * 0.5;
                    // Clamp to own half roughly
                    if (p.team === 'red') targetX = Math.min(targetX, FIELD_WIDTH * 0.6);
                    else targetX = Math.max(targetX, FIELD_WIDTH * 0.4);
                } else {
                    // Forwards push up
                    targetX = (p.homeX * FIELD_WIDTH) + shiftX;
                }
                
                // Match ball height partially
                targetY = (p.homeY * FIELD_HEIGHT) + (ball.y - FIELD_HEIGHT/2) * 0.2;
            }

            // Move
            const dx = targetX - p.x;
            const dy = targetY - p.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            
            const effectiveSpeed = chase ? p.speed : p.speed * 0.6; // Slower when returning to position

            if (dist > 2) {
                p.vx = (dx / dist) * effectiveSpeed;
                p.vy = (dy / dist) * effectiveSpeed;
            } else {
                p.vx *= 0.8;
                p.vy *= 0.8;
            }

            // Simple separation to avoid stacking
            players.forEach(other => {
                if (p === other) return;
                const distO = Math.hypot(p.x - other.x, p.y - other.y);
                if (distO < p.radius * 2) {
                    const angle = Math.atan2(p.y - other.y, p.x - other.x);
                    const force = 0.5;
                    p.vx += Math.cos(angle) * force;
                    p.vy += Math.sin(angle) * force;
                }
            });
            
            p.x += p.vx;
            p.y += p.vy;

            // Bounds Check
            p.x = Math.max(p.radius, Math.min(FIELD_WIDTH - p.radius, p.x));
            p.y = Math.max(p.radius, Math.min(FIELD_HEIGHT - p.radius, p.y));

            // Kick Physics
            const distToBall = Math.hypot(ball.x - p.x, ball.y - p.y);
            
            if (distToBall < p.radius + ball.radius && p.cooldown === 0) {
                // Aim logic
                const goalY = FIELD_HEIGHT / 2;
                let aimX = oppGoalX;
                let aimY = goalY;
                
                // Add significant noise/variance
                const noise = (Math.random() - 0.5) * 150; 
                aimY += noise;

                // If defender/goalie, just clear it (aim away from goal)
                if (p.role !== 'forward') {
                   // Often aim to sides to clear
                   aimY += (Math.random() - 0.5) * 300; 
                }

                const kickDx = aimX - p.x;
                const kickDy = aimY - p.y;
                const kickDist = Math.hypot(kickDx, kickDy);
                
                const kickPower = 8 + Math.random() * 4; // 8-12
                
                ball.vx = (kickDx / kickDist) * kickPower;
                ball.vy = (kickDy / kickDist) * kickPower;
                
                p.cooldown = 15;
            }
        });
    };

    const draw = () => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        // Draw Field
        ctx.fillStyle = '#15803d'; // Green-700
        ctx.fillRect(0, 0, FIELD_WIDTH, FIELD_HEIGHT);
        
        // Striped Grass Effect
        ctx.fillStyle = '#166534'; // Green-800
        for (let i = 0; i < FIELD_WIDTH; i += 100) {
            if ((i / 100) % 2 === 0) ctx.fillRect(i, 0, 50, FIELD_HEIGHT);
        }

        // Draw Lines
        ctx.strokeStyle = 'rgba(255,255,255,0.6)';
        ctx.lineWidth = 2;
        
        // Center Line
        ctx.beginPath();
        ctx.moveTo(FIELD_WIDTH / 2, 0);
        ctx.lineTo(FIELD_WIDTH / 2, FIELD_HEIGHT);
        ctx.stroke();

        // Center Circle
        ctx.beginPath();
        ctx.arc(FIELD_WIDTH / 2, FIELD_HEIGHT / 2, 60, 0, Math.PI * 2);
        ctx.stroke();
        
        // Penalty Areas
        ctx.strokeRect(0, (FIELD_HEIGHT - 250) / 2, 100, 250);
        ctx.strokeRect(FIELD_WIDTH - 100, (FIELD_HEIGHT - 250) / 2, 100, 250);

        // Goals
        ctx.fillStyle = 'rgba(255, 255, 255, 0.3)';
        const goalTop = (FIELD_HEIGHT - GOAL_HEIGHT) / 2;
        ctx.fillRect(0, goalTop, 5, GOAL_HEIGHT);
        ctx.fillRect(FIELD_WIDTH - 5, goalTop, 5, GOAL_HEIGHT);

        // Draw Players
        state.current.players.forEach(p => {
            ctx.beginPath();
            ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
            ctx.fillStyle = p.color;
            ctx.fill();
            
            // Player Outline
            ctx.strokeStyle = '#fff';
            ctx.lineWidth = 2;
            ctx.stroke();

            // Number
            ctx.fillStyle = '#fff';
            ctx.font = '10px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText(p.number.toString(), p.x, p.y);
        });

        // Draw Ball
        const b = state.current.ball;
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.radius, 0, Math.PI * 2);
        ctx.fillStyle = b.color;
        ctx.fill();
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 1;
        ctx.stroke();

        // Goal Text
        if (state.current.isGoal) {
            ctx.fillStyle = 'rgba(0,0,0,0.6)';
            ctx.fillRect(0, 0, FIELD_WIDTH, FIELD_HEIGHT);
            
            ctx.save();
            ctx.translate(FIELD_WIDTH / 2, FIELD_HEIGHT / 2);
            ctx.rotate(-0.1);
            
            ctx.shadowColor = 'black';
            ctx.shadowBlur = 10;
            ctx.fillStyle = '#fbbf24';
            ctx.font = 'bold italic 90px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';
            ctx.fillText("GOAL!!!", 0, 0);
            
            ctx.restore();
        }
    };

    const loop = () => {
        update();
        draw();
        requestRef.current = requestAnimationFrame(loop);
    };

    useEffect(() => {
        requestRef.current = requestAnimationFrame(loop);
        return () => {
            if (requestRef.current) cancelAnimationFrame(requestRef.current);
        };
    }, []);

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-neutral-900 pt-20">
            {/* Scoreboard */}
            <div className="mb-6 flex items-center justify-center space-x-0 bg-black rounded-lg border-4 border-neutral-700 overflow-hidden shadow-2xl z-10">
                <div className="bg-red-900/80 p-4 w-32 text-center border-r-2 border-neutral-800">
                    <h2 className="text-red-400 font-bold text-xs uppercase tracking-widest mb-1">Red FC</h2>
                    <p className="text-5xl font-mono font-black text-white">{score.red}</p>
                </div>
                
                <div className="bg-neutral-800 p-4 w-24 text-center">
                     <p className="text-neutral-500 text-xs font-bold uppercase mb-1">Time</p>
                    <div className="text-white font-mono text-xl">
                        {Math.floor(gameTime / 60)}:{(gameTime % 60).toString().padStart(2, '0')}
                    </div>
                </div>
                
                <div className="bg-blue-900/80 p-4 w-32 text-center border-l-2 border-neutral-800">
                    <h2 className="text-blue-400 font-bold text-xs uppercase tracking-widest mb-1">Blue Utd</h2>
                    <p className="text-5xl font-mono font-black text-white">{score.blue}</p>
                </div>
            </div>

            {/* Game Canvas */}
            <div className="relative rounded-lg overflow-hidden shadow-[0_0_50px_rgba(0,0,0,0.5)] border-8 border-neutral-800 bg-neutral-950">
                <canvas 
                    ref={canvasRef} 
                    width={FIELD_WIDTH} 
                    height={FIELD_HEIGHT} 
                    className="block cursor-none"
                    style={{ maxWidth: '100%', maxHeight: '80vh' }}
                />
            </div>

            <div className="mt-8 text-neutral-500 text-sm max-w-lg text-center font-mono">
                <p className="mb-2"><span className="text-green-500">●</span> 10 AI Agents playing 5v5 autonomously</p>
                <p>Start the Live Commentary Widget to listen to the match.</p>
            </div>
        </div>
    );
};
