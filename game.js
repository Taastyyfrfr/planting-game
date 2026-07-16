/* ==========================================================================
   NanoGarden - Core Game System (State Serialization & Detailed Graphics)
   ========================================================================== */

// --- 1. GAME DATA & CONFIGURATION ---

// --- 2. CROP DATABASE ---
const CROPS = [
    {
        name: 'Carrot',
        width: 1,
        height: 1,
        cost: 2,
        revenue: 10,
        growthTime: 10, // seconds
        xp: 5,
        unlockLevel: 1,
        desc: 'Fast growing, simple root vegetable.'
    },
    {
        name: 'Strawberry',
        width: 1,
        height: 1,
        cost: 5,
        revenue: 25,
        growthTime: 20,
        xp: 12,
        unlockLevel: 2,
        desc: 'Lush red berries. High value crop.'
    },
    {
        name: 'Watermelon',
        width: 2,
        height: 1,
        cost: 12,
        revenue: 60,
        growthTime: 35,
        xp: 28,
        unlockLevel: 3,
        desc: 'Wide striped melon. Spans 2 horizontal tiles.'
    },
    {
        name: 'Sunflower',
        width: 1,
        height: 2,
        cost: 25,
        revenue: 120,
        growthTime: 50,
        xp: 55,
        unlockLevel: 4,
        desc: 'Tall yellow flower. Spans 2 vertical tiles.'
    },
    {
        name: 'Pumpkin',
        width: 2,
        height: 2,
        cost: 60,
        revenue: 300,
        growthTime: 80,
        xp: 120,
        unlockLevel: 5,
        desc: 'Colossal orange gourd. Requires a 2x2 grid space.'
    },
    {
        name: 'Ascent Pipe',
        width: 1,
        height: 1,
        cost: 30,
        isStructure: true,
        revenue: 0,
        growthTime: 0,
        xp: 0,
        unlockLevel: 1,
        desc: 'Elevator pipe. Pumps water up to Floor N+1 at 15%/sec.',
        emoji: '🪠'
    }
];

// --- 3. RETRO AUDIO SYNTH (WEB AUDIO API) ---
const SoundFX = {
    ctx: null,
    muted: false,

    init() {
        if (this.ctx) return;
        const AudioContextClass = window.AudioContext || window.webkitAudioContext;
        if (AudioContextClass) {
            this.ctx = new AudioContextClass();
        }
    },

    toggleMute() {
        this.muted = !this.muted;
        return this.muted;
    },

    playClick() {
        if (this.muted) return;
        this.init();
        if (!this.ctx) return;

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(800, this.ctx.currentTime);
        osc.frequency.exponentialRampToValueAtTime(150, this.ctx.currentTime + 0.08);

        gain.gain.setValueAtTime(0.08, this.ctx.currentTime);
        gain.gain.exponentialRampToValueAtTime(0.001, this.ctx.currentTime + 0.08);

        osc.start();
        osc.stop(this.ctx.currentTime + 0.08);
    },

    playPlant() {
        if (this.muted) return;
        this.init();
        if (!this.ctx) return;

        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.connect(gain);
        gain.connect(this.ctx.destination);

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(160, this.ctx.currentTime);
        osc.frequency.linearRampToValueAtTime(50, this.ctx.currentTime + 0.15);

        gain.gain.setValueAtTime(0.15, this.ctx.currentTime);
        gain.gain.linearRampToValueAtTime(0.005, this.ctx.currentTime + 0.15);

        osc.start();
        osc.stop(this.ctx.currentTime + 0.15);
    },

    playWater() {
        if (this.muted) return;
        this.init();
        if (!this.ctx) return;

        const now = this.ctx.currentTime;
        const bubbles = 3;
        for (let i = 0; i < bubbles; i++) {
            const time = now + i * 0.04;
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.connect(gain);
            gain.connect(this.ctx.destination);

            osc.type = 'sine';
            const baseFreq = 300 + Math.random() * 150;
            osc.frequency.setValueAtTime(baseFreq, time);
            osc.frequency.exponentialRampToValueAtTime(baseFreq * 2, time + 0.08);

            gain.gain.setValueAtTime(0.05, time);
            gain.gain.exponentialRampToValueAtTime(0.001, time + 0.08);

            osc.start(time);
            osc.stop(time + 0.08);
        }
    },

    playHarvest() {
        if (this.muted) return;
        this.init();
        if (!this.ctx) return;

        const notes = [293.66, 349.23, 392.00, 440.00, 523.25, 587.33]; // D4, F4, G4, A4, C5, D5
        const now = this.ctx.currentTime;

        notes.forEach((freq, index) => {
            const time = now + index * 0.05;
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.connect(gain);
            gain.connect(this.ctx.destination);

            osc.type = 'triangle';
            osc.frequency.setValueAtTime(freq, time);

            gain.gain.setValueAtTime(0.1, time);
            gain.gain.exponentialRampToValueAtTime(0.002, time + 0.12);

            osc.start(time);
            osc.stop(time + 0.12);
        });
    },

    playUpgrade() {
        if (this.muted) return;
        this.init();
        if (!this.ctx) return;

        const notes = [261.63, 329.63, 392.00, 523.25, 659.25, 783.99, 1046.50]; // C4, E4, G4, C5, E5, G5, C6
        const now = this.ctx.currentTime;

        notes.forEach((freq, index) => {
            const time = now + index * 0.06;
            const osc = this.ctx.createOscillator();
            const gain = this.ctx.createGain();
            osc.connect(gain);
            gain.connect(this.ctx.destination);

            osc.type = 'sine';
            osc.frequency.setValueAtTime(freq, time);

            gain.gain.setValueAtTime(0.12, time);
            gain.gain.exponentialRampToValueAtTime(0.002, time + 0.25);

            osc.start(time);
            osc.stop(time + 0.25);
        });
    }
};

// --- 4. GAME VARIABLES & STATE ---
let canvas, ctx;

// Stats
let coins = 20;
let xp = 0;
let level = 1;
let harvestCount = 0;

// Dynamic lighting day/night loop variables
let dayNightTime = 15; // starts at early day (0 to 60)
let theta = 0; // sun angle
let sunX = 320;
let sunY = 100;
let ambientColor = 'rgb(220, 220, 220)';

// Z-Axis Multi-Tier state
let activeFloor = 0; // 0 = Ground Bed, 1 = Hydroponics, 2 = Canopy
let currentScrollY = 0; // for animating elevator transitions
let noclipEnabled = false;

// Grid layout variables (now a 3D grid [floor][row][col])
let gridSize = 6;
let grid = [];
let cellSize = 64;
let gridOffsetX = 0;
let gridOffsetY = 0;

// Selected assets
let selectedSeed = null;
let selectedTool = 'inspect'; // 'inspect', 'water', 'harvest'

// Active systems
let drones = [];
let particles = [];

// Hover tracking (relative to drawing coordinate space)
let mouseX = -999;
let mouseY = -999;

// Drone counters
let harvesterCount = 0;
let planterCount = 0;
let watererCount = 0;

// Offscreen sprites storage
const sprites = {
    grass: null,
    soilDry: null,
    soilWet: null,
    seed: null,
    sprout: null,
    carrot: {},
    strawberry: {},
    watermelon: {},
    sunflower: {},
    pumpkin: {},
    'ascent pipe': {}
};

// Upgrades Tech config
const upgrades = {
    gridSize: {
        level: 0,
        maxLevel: 3,
        costs: [150, 400, 1000],
        sizes: [6, 8, 10, 12]
    },
    growthSpeed: {
        level: 1,
        maxLevel: 6,
        costs: [50, 120, 300, 800, 2000],
        multipliers: [1.0, 1.3, 1.7, 2.2, 3.0, 4.0],
        multiplier: 1.0
    },
    autoSpeed: {
        level: 1,
        maxLevel: 5,
        costs: [60, 150, 400, 1000],
        multipliers: [1.0, 1.4, 1.9, 2.5, 3.5],
        multiplier: 1.0
    },
    waterDuration: {
        level: 1,
        maxLevel: 4,
        costs: [40, 100, 250],
        values: [1.0, 1.6, 2.5, 4.0],
        value: 1.0
    }
};

// Background canvases caching
let grassPatternCanvas = null;
let hydroBackgroundCanvas = null;
let canopyBackgroundCanvas = null;

// Lightmap Caching Canvas
let lightmapCanvas = null;
let lightmapCtx = null;

// Silhouette temporary canvas for Dynamic Skew Shadow outlines
let shadowSilhouetteCanvas = null;

// --- 5. HIGH-DENSITY PROCEDURAL TEXTURE GENERATORS (32x32 & 64x64) ---

function drawGrassSprite(pCtx) {
    pCtx.fillStyle = '#022c22'; // Deep jade green base
    pCtx.fillRect(0, 0, 32, 32);
    
    pCtx.fillStyle = '#047857'; // Mid-tone emerald blades
    const blades = [
        [2, 4], [8, 12], [14, 2], [22, 18], [28, 8],
        [4, 20], [12, 28], [18, 14], [24, 24], [30, 2]
    ];
    blades.forEach(pt => {
        pCtx.fillRect(pt[0], pt[1], 2, 2);
        pCtx.fillRect(pt[0] + 1, pt[1] - 1, 1, 2);
    });
    
    pCtx.fillStyle = '#10b981'; // Neon green leaf tips
    const tips = [
        [3, 3], [9, 11], [15, 1], [23, 17], [29, 7],
        [5, 19], [13, 27], [19, 13], [25, 23], [31, 1]
    ];
    tips.forEach(pt => {
        pCtx.fillRect(pt[0], pt[1], 1, 1);
    });
}

function drawDrySoilSprite(pCtx) {
    pCtx.fillStyle = '#451a03'; // Deep soil border outline
    pCtx.fillRect(0, 0, 32, 32);
    
    pCtx.fillStyle = '#78350f'; // Rich soil clay body
    pCtx.fillRect(1, 1, 30, 30);
    
    // Scattered pebble outlines & textures
    pCtx.fillStyle = '#b45309';
    pCtx.fillRect(4, 6, 4, 3);
    pCtx.fillRect(18, 12, 3, 3);
    pCtx.fillRect(12, 22, 5, 2);
    pCtx.fillRect(24, 20, 3, 4);
    
    pCtx.fillStyle = '#d97706'; // Gold clay highlights
    pCtx.fillRect(5, 6, 1, 1);
    pCtx.fillRect(19, 12, 1, 1);
    pCtx.fillRect(13, 22, 1, 1);
}

function drawWetSoilSprite(pCtx) {
    pCtx.fillStyle = '#0c0a09'; // Ultra dark wet soil border
    pCtx.fillRect(0, 0, 32, 32);
    
    pCtx.fillStyle = '#1c1917'; // Wet mud base (nearly black)
    pCtx.fillRect(1, 1, 30, 30);
    
    pCtx.fillStyle = '#451a03'; // Saturated dirt patches
    pCtx.fillRect(5, 5, 6, 4);
    pCtx.fillRect(16, 20, 5, 5);
    pCtx.fillRect(22, 8, 4, 4);
    
    // Glowing water droplet reflections
    pCtx.fillStyle = '#0ea5e9';
    pCtx.fillRect(6, 6, 2, 2);
    pCtx.fillRect(18, 22, 2, 2);
    pCtx.fillRect(24, 9, 2, 2);
    
    pCtx.fillStyle = '#38bdf8'; // Sub-pixel specular glints
    pCtx.fillRect(6, 6, 1, 1);
    pCtx.fillRect(18, 22, 1, 1);
}

function drawSeedSprite(pCtx) {
    pCtx.fillStyle = '#451a03'; // Outline
    pCtx.fillRect(13, 22, 6, 4);
    pCtx.fillStyle = '#78350f'; // Hull body
    pCtx.fillRect(14, 21, 4, 4);
    pCtx.fillStyle = '#b45309'; // Highlight
    pCtx.fillRect(14, 21, 2, 2);
}

function drawSproutSprite(pCtx) {
    // Stalk
    pCtx.fillStyle = '#064e3b';
    pCtx.fillRect(15, 18, 2, 8);
    // Left Emerald leaf
    pCtx.fillStyle = '#10b981';
    pCtx.fillRect(11, 14, 4, 4);
    pCtx.fillStyle = '#34d399'; // leaf highlight
    pCtx.fillRect(12, 14, 2, 2);
    
    // Right Jade leaf
    pCtx.fillStyle = '#047857';
    pCtx.fillRect(17, 13, 4, 4);
    pCtx.fillStyle = '#a7f3d0';
    pCtx.fillRect(18, 13, 2, 2);
}

function drawCarrotGrowing(pCtx) {
    pCtx.fillStyle = '#ea580c';
    pCtx.fillRect(14, 16, 4, 8);
    pCtx.fillStyle = '#f97316';
    pCtx.fillRect(14, 16, 2, 6);
    
    pCtx.fillStyle = '#10b981';
    pCtx.fillRect(13, 10, 2, 6);
    pCtx.fillRect(17, 11, 2, 5);
}

function drawCarrotMature(pCtx) {
    // Root core
    pCtx.fillStyle = '#9a3412';
    pCtx.beginPath();
    pCtx.moveTo(11, 12);
    pCtx.lineTo(21, 12);
    pCtx.lineTo(16, 29);
    pCtx.closePath();
    pCtx.fill();
    
    pCtx.fillStyle = '#ea580c';
    pCtx.beginPath();
    pCtx.moveTo(12, 13);
    pCtx.lineTo(20, 13);
    pCtx.lineTo(16, 28);
    pCtx.closePath();
    pCtx.fill();
    
    pCtx.fillStyle = '#f97316';
    pCtx.beginPath();
    pCtx.moveTo(13, 13);
    pCtx.lineTo(17, 13);
    pCtx.lineTo(15, 26);
    pCtx.closePath();
    pCtx.fill();
    
    pCtx.fillStyle = '#ffedd5'; // Sub-pixel highlight top-left
    pCtx.fillRect(13, 14, 2, 4);
    pCtx.fillRect(14, 13, 4, 1);
    
    // Emerald foliage leaf sprays
    pCtx.fillStyle = '#064e3b';
    pCtx.fillRect(12, 4, 8, 8);
    
    pCtx.fillStyle = '#10b981';
    pCtx.fillRect(13, 5, 2, 7);
    pCtx.fillRect(17, 3, 2, 9);
    
    pCtx.fillStyle = '#34d399';
    pCtx.fillRect(14, 6, 1, 4);
    pCtx.fillRect(18, 4, 1, 5);
}

function drawStrawberryGrowing(pCtx) {
    pCtx.fillStyle = '#b91c1c';
    pCtx.fillRect(13, 16, 6, 6);
    pCtx.fillStyle = '#10b981';
    pCtx.fillRect(12, 12, 8, 4);
}

function drawStrawberryMature(pCtx) {
    // Vine crowns
    pCtx.fillStyle = '#064e3b';
    pCtx.fillRect(8, 8, 16, 6);
    pCtx.fillStyle = '#10b981';
    pCtx.fillRect(10, 6, 12, 4);
    
    // Heart shape berry outline
    pCtx.fillStyle = '#7f1d1d';
    pCtx.beginPath();
    pCtx.arc(13, 17, 5, 0, Math.PI * 2);
    pCtx.arc(19, 17, 5, 0, Math.PI * 2);
    pCtx.fill();
    pCtx.fillRect(9, 17, 14, 6);
    pCtx.beginPath();
    pCtx.moveTo(9, 21);
    pCtx.lineTo(23, 21);
    pCtx.lineTo(16, 29);
    pCtx.closePath();
    pCtx.fill();
    
    // Main berry red flesh
    pCtx.fillStyle = '#b91c1c';
    pCtx.beginPath();
    pCtx.arc(13, 17, 4, 0, Math.PI * 2);
    pCtx.arc(19, 17, 4, 0, Math.PI * 2);
    pCtx.fill();
    pCtx.fillRect(10, 17, 12, 5);
    pCtx.beginPath();
    pCtx.moveTo(10, 21);
    pCtx.lineTo(22, 21);
    pCtx.lineTo(16, 28);
    pCtx.closePath();
    pCtx.fill();
    
    // Bright highlights
    pCtx.fillStyle = '#ef4444';
    pCtx.fillRect(11, 16, 4, 4);
    pCtx.fillRect(17, 16, 4, 4);
    pCtx.fillStyle = '#fca5a5'; // sub-pixel highlight
    pCtx.fillRect(11, 16, 1, 1);
    pCtx.fillRect(17, 16, 1, 1);
    
    // Gold Seed dots
    pCtx.fillStyle = '#fbbf24';
    pCtx.fillRect(12, 19, 1, 1.5);
    pCtx.fillRect(19, 19, 1, 1.5);
    pCtx.fillRect(15, 23, 1, 1.5);
    pCtx.fillRect(17, 25, 1, 1.5);
}

function drawWatermelonGrowing(pCtx) {
    pCtx.fillStyle = '#166534';
    pCtx.fillRect(20, 10, 24, 12);
}

function drawWatermelonMature(pCtx) {
    // Stem
    pCtx.fillStyle = '#064e3b';
    pCtx.fillRect(30, 4, 4, 6);
    pCtx.fillRect(26, 6, 8, 2);
    
    // Outer outline
    pCtx.fillStyle = '#022c22';
    pCtx.beginPath();
    pCtx.arc(22, 18, 10, 0, Math.PI * 2);
    pCtx.arc(42, 18, 10, 0, Math.PI * 2);
    pCtx.fill();
    pCtx.fillRect(22, 8, 20, 20);
    
    // Rind body
    pCtx.fillStyle = '#34d399';
    pCtx.beginPath();
    pCtx.arc(22, 18, 9, 0, Math.PI * 2);
    pCtx.arc(42, 18, 9, 0, Math.PI * 2);
    pCtx.fill();
    pCtx.fillRect(22, 9, 20, 18);
    
    // Emerald rind stripes
    pCtx.fillStyle = '#166534';
    for (let x = 16; x < 48; x += 6) {
        pCtx.fillRect(x, 11, 2.5, 14);
        pCtx.fillRect(x + 2, 9, 1.5, 4);
    }
    
    // Specular highlight on curve top
    pCtx.fillStyle = '#a7f3d0';
    pCtx.fillRect(20, 10, 24, 2);
    pCtx.fillStyle = '#ffffff'; // sub-pixel lighting
    pCtx.fillRect(22, 10, 6, 1);
}

function drawSunflowerGrowing(pCtx) {
    pCtx.fillStyle = '#047857';
    pCtx.fillRect(15, 20, 2, 30);
    pCtx.fillStyle = '#f59e0b';
    pCtx.fillRect(12, 14, 8, 8);
}

function drawSunflowerMature(pCtx) {
    // Tall stalk
    pCtx.fillStyle = '#022c22';
    pCtx.fillRect(14, 18, 4, 46);
    pCtx.fillStyle = '#10b981';
    pCtx.fillRect(15, 18, 2, 46);
    
    // Jade leaves
    pCtx.fillStyle = '#047857';
    pCtx.fillRect(8, 36, 6, 4);
    pCtx.fillRect(18, 44, 6, 4);
    pCtx.fillStyle = '#34d399'; // highlight
    pCtx.fillRect(9, 36, 4, 2);
    pCtx.fillRect(19, 44, 4, 2);
    
    // Golden Petals
    const cx = 16;
    const cy = 16;
    pCtx.fillStyle = '#d97706'; // copper shading
    pCtx.beginPath();
    pCtx.arc(cx, cy, 14, 0, Math.PI * 2);
    pCtx.fill();
    
    pCtx.fillStyle = '#fbbf24'; // bright gold
    for (let angle = 0; angle < Math.PI * 2; angle += Math.PI / 8) {
        const px = cx + Math.cos(angle) * 11;
        const py = cy + Math.sin(angle) * 11;
        pCtx.fillRect(px - 2.5, py - 2.5, 5, 5);
    }
    
    pCtx.fillStyle = '#f59e0b'; // secondary tone
    for (let angle = 0; angle < Math.PI * 2; angle += Math.PI / 4) {
        const px = cx + Math.cos(angle) * 10;
        const py = cy + Math.sin(angle) * 10;
        pCtx.fillRect(px - 1.5, py - 1.5, 3, 3);
    }
    
    // Deep Copper Core
    pCtx.fillStyle = '#451a03';
    pCtx.beginPath();
    pCtx.arc(cx, cy, 7, 0, Math.PI * 2);
    pCtx.fill();
    pCtx.fillStyle = '#78350f';
    pCtx.beginPath();
    pCtx.arc(cx, cy, 6, 0, Math.PI * 2);
    pCtx.fill();
    
    // Center seeds grid
    pCtx.fillStyle = '#b45309';
    pCtx.fillRect(cx - 3, cy - 3, 2, 2);
    pCtx.fillRect(cx + 1, cy - 3, 2, 2);
    pCtx.fillRect(cx - 3, cy + 1, 2, 2);
    pCtx.fillRect(cx + 1, cy + 1, 2, 2);
    pCtx.fillStyle = '#fbbf24'; // seed specular dots
    pCtx.fillRect(cx - 2, cy - 2, 1, 1);
    pCtx.fillRect(cx + 2, cy - 2, 1, 1);
}

function drawPumpkinGrowing(pCtx) {
    pCtx.fillStyle = '#c2410c';
    pCtx.fillRect(20, 24, 24, 24);
    pCtx.fillStyle = '#047857';
    pCtx.fillRect(28, 16, 8, 8);
}

function drawPumpkinMature(pCtx) {
    // Vine detail
    pCtx.strokeStyle = '#047857';
    pCtx.lineWidth = 2.5;
    pCtx.beginPath();
    pCtx.arc(32, 16, 12, Math.PI, Math.PI * 2);
    pCtx.stroke();
    
    // Stem
    pCtx.fillStyle = '#064e3b';
    pCtx.fillRect(30, 8, 4, 10);
    pCtx.fillStyle = '#10b981';
    pCtx.fillRect(31, 8, 2, 9);
    
    // Core round outline
    pCtx.fillStyle = '#7c2d12';
    pCtx.beginPath();
    pCtx.arc(24, 38, 18, 0, Math.PI * 2);
    pCtx.arc(40, 38, 18, 0, Math.PI * 2);
    pCtx.arc(32, 38, 20, 0, Math.PI * 2);
    pCtx.fill();
    
    // Deep orange ribs
    pCtx.fillStyle = '#ea580c';
    pCtx.beginPath();
    pCtx.arc(24, 38, 17, 0, Math.PI * 2);
    pCtx.arc(40, 38, 17, 0, Math.PI * 2);
    pCtx.arc(32, 38, 19, 0, Math.PI * 2);
    pCtx.fill();
    
    pCtx.fillStyle = '#f97316'; // orange rib segments
    pCtx.beginPath();
    pCtx.arc(24, 38, 14, 0, Math.PI * 2);
    pCtx.arc(40, 38, 14, 0, Math.PI * 2);
    pCtx.fill();
    
    pCtx.beginPath();
    pCtx.arc(32, 38, 16, 0, Math.PI * 2);
    pCtx.fill();
    
    // Rib highlights
    pCtx.fillStyle = '#fdba74';
    pCtx.fillRect(20, 26, 4, 8);
    pCtx.fillRect(30, 22, 4, 8);
    pCtx.fillRect(40, 26, 4, 8);
}

function drawAscentPipeSprite(pCtx) {
    // Steel Coupling base
    pCtx.fillStyle = '#1e293b';
    pCtx.fillRect(8, 26, 16, 6);
    pCtx.fillStyle = '#475569';
    pCtx.fillRect(9, 27, 14, 2);
    pCtx.fillStyle = '#94a3b8';
    pCtx.fillRect(10, 27, 4, 1);
    
    // Steel Coupling cap
    pCtx.fillStyle = '#1e293b';
    pCtx.fillRect(8, 0, 16, 6);
    pCtx.fillStyle = '#475569';
    pCtx.fillRect(9, 1, 14, 2);
    pCtx.fillStyle = '#94a3b8';
    pCtx.fillRect(10, 1, 4, 1);
    
    // High-contrast Glass Tube cylinder walls
    pCtx.fillStyle = 'rgba(148, 163, 184, 0.22)';
    pCtx.fillRect(10, 6, 12, 20);
    
    // Glowing cyan liquid
    pCtx.fillStyle = '#0ea5e9';
    pCtx.fillRect(11, 10, 10, 16);
    pCtx.fillStyle = '#38bdf8';
    pCtx.fillRect(12, 11, 8, 15);
    
    // Bubbles sub-pixels
    pCtx.fillStyle = '#ffffff';
    pCtx.fillRect(13, 13, 2, 2);
    pCtx.fillRect(17, 18, 1.5, 1.5);
    pCtx.fillRect(14, 22, 1, 1);
    
    // Specular sheen
    pCtx.fillStyle = 'rgba(255, 255, 255, 0.45)';
    pCtx.fillRect(11, 6, 1, 20);
    pCtx.fillRect(20, 6, 1, 20);
}

function initSprites() {
    // Generate Grass (32x32)
    sprites.grass = document.createElement('canvas');
    sprites.grass.width = 32;
    sprites.grass.height = 32;
    drawGrassSprite(sprites.grass.getContext('2d'));
    
    // Generate Dry Soil
    sprites.soilDry = document.createElement('canvas');
    sprites.soilDry.width = 32;
    sprites.soilDry.height = 32;
    drawDrySoilSprite(sprites.soilDry.getContext('2d'));
    
    // Generate Wet Soil
    sprites.soilWet = document.createElement('canvas');
    sprites.soilWet.width = 32;
    sprites.soilWet.height = 32;
    drawWetSoilSprite(sprites.soilWet.getContext('2d'));
    
    // Seed
    sprites.seed = document.createElement('canvas');
    sprites.seed.width = 32;
    sprites.seed.height = 32;
    drawSeedSprite(sprites.seed.getContext('2d'));
    
    // Sprout
    sprites.sprout = document.createElement('canvas');
    sprites.sprout.width = 32;
    sprites.sprout.height = 32;
    drawSproutSprite(sprites.sprout.getContext('2d'));
    
    // Carrot
    sprites.carrot[2] = document.createElement('canvas');
    sprites.carrot[2].width = 32;
    sprites.carrot[2].height = 32;
    drawCarrotGrowing(sprites.carrot[2].getContext('2d'));
    
    sprites.carrot[3] = document.createElement('canvas');
    sprites.carrot[3].width = 32;
    sprites.carrot[3].height = 32;
    drawCarrotMature(sprites.carrot[3].getContext('2d'));
    
    // Strawberry
    sprites.strawberry[2] = document.createElement('canvas');
    sprites.strawberry[2].width = 32;
    sprites.strawberry[2].height = 32;
    drawStrawberryGrowing(sprites.strawberry[2].getContext('2d'));
    
    sprites.strawberry[3] = document.createElement('canvas');
    sprites.strawberry[3].width = 32;
    sprites.strawberry[3].height = 32;
    drawStrawberryMature(sprites.strawberry[3].getContext('2d'));
    
    // Watermelon (64x32)
    sprites.watermelon[2] = document.createElement('canvas');
    sprites.watermelon[2].width = 64;
    sprites.watermelon[2].height = 32;
    drawWatermelonGrowing(sprites.watermelon[2].getContext('2d'));
    
    sprites.watermelon[3] = document.createElement('canvas');
    sprites.watermelon[3].width = 64;
    sprites.watermelon[3].height = 32;
    drawWatermelonMature(sprites.watermelon[3].getContext('2d'));
    
    // Sunflower (32x64)
    sprites.sunflower[2] = document.createElement('canvas');
    sprites.sunflower[2].width = 32;
    sprites.sunflower[2].height = 64;
    drawSunflowerGrowing(sprites.sunflower[2].getContext('2d'));
    
    sprites.sunflower[3] = document.createElement('canvas');
    sprites.sunflower[3].width = 32;
    sprites.sunflower[3].height = 64;
    drawSunflowerMature(sprites.sunflower[3].getContext('2d'));
    
    // Pumpkin (64x64)
    sprites.pumpkin[2] = document.createElement('canvas');
    sprites.pumpkin[2].width = 64;
    sprites.pumpkin[2].height = 64;
    drawPumpkinGrowing(sprites.pumpkin[2].getContext('2d'));
    
    sprites.pumpkin[3] = document.createElement('canvas');
    sprites.pumpkin[3].width = 64;
    sprites.pumpkin[3].height = 64;
    drawPumpkinMature(sprites.pumpkin[3].getContext('2d'));
    
    // Ascent Pipe
    sprites['ascent pipe'][2] = document.createElement('canvas');
    sprites['ascent pipe'][2].width = 32;
    sprites['ascent pipe'][2].height = 32;
    drawAscentPipeSprite(sprites['ascent pipe'][2].getContext('2d'));
    
    sprites['ascent pipe'][3] = document.createElement('canvas');
    sprites['ascent pipe'][3].width = 32;
    sprites['ascent pipe'][3].height = 32;
    drawAscentPipeSprite(sprites['ascent pipe'][3].getContext('2d'));
    
    preRenderFloorBackgrounds();
}

function preRenderFloorBackgrounds() {
    // 1. Floor 0 (Grass)
    grassPatternCanvas = document.createElement('canvas');
    grassPatternCanvas.width = 640;
    grassPatternCanvas.height = 640;
    const gCtx = grassPatternCanvas.getContext('2d');
    gCtx.imageSmoothingEnabled = false;
    for (let r = 0; r < 20; r++) {
        for (let c = 0; c < 20; c++) {
            gCtx.drawImage(sprites.grass, c * 32, r * 32, 32, 32);
        }
    }
    
    // 2. Floor 1 (Hydroponics metallic grid tiles)
    hydroBackgroundCanvas = document.createElement('canvas');
    hydroBackgroundCanvas.width = 640;
    hydroBackgroundCanvas.height = 640;
    const hCtx = hydroBackgroundCanvas.getContext('2d');
    hCtx.imageSmoothingEnabled = false;
    hCtx.fillStyle = '#0f172a'; // Deep slate steel-blue
    hCtx.fillRect(0, 0, 640, 640);
    hCtx.strokeStyle = '#334155';
    hCtx.lineWidth = 1;
    for (let x = 0; x <= 640; x += 64) {
        hCtx.beginPath();
        hCtx.moveTo(x, 0);
        hCtx.lineTo(x, 640);
        hCtx.stroke();
        
        hCtx.beginPath();
        hCtx.moveTo(0, x);
        hCtx.lineTo(640, x);
        hCtx.stroke();
    }
    
    // 3. Floor 2 (Bio-Dome Canopy starry deep sky)
    canopyBackgroundCanvas = document.createElement('canvas');
    canopyBackgroundCanvas.width = 640;
    canopyBackgroundCanvas.height = 640;
    const cCtx = canopyBackgroundCanvas.getContext('2d');
    cCtx.imageSmoothingEnabled = false;
    cCtx.fillStyle = '#020617';
    cCtx.fillRect(0, 0, 640, 640);
    cCtx.fillStyle = '#38bdf8';
    for (let x = 0; x <= 640; x += 128) {
        cCtx.beginPath();
        cCtx.arc(x, x, 2, 0, Math.PI * 2);
        cCtx.arc(640 - x, x, 2, 0, Math.PI * 2);
        cCtx.fill();
    }
    cCtx.fillStyle = '#fbbf24';
    for (let i = 0; i < 35; i++) {
        const sx = Math.random() * 640;
        const sy = Math.random() * 640;
        const size = Math.random() > 0.75 ? 2.2 : 1;
        cCtx.fillRect(sx, sy, size, size);
    }
}

function initGrid(preserveExisting = false) {
    const newGrid = [];
    for (let f = 0; f < 3; f++) {
        newGrid.push([]);
        for (let r = 0; r < gridSize; r++) {
            newGrid[f].push([]);
            for (let c = 0; c < gridSize; c++) {
                newGrid[f][r].push({
                    cropInstance: null,
                    waterLevel: 0,
                    reservedBy: null,
                    waterReserved: false
                });
            }
        }
    }
    
    if (preserveExisting && grid && grid.length > 0) {
        const oldGridSize = grid[0].length;
        for (let f = 0; f < 3; f++) {
            for (let r = 0; r < oldGridSize; r++) {
                for (let c = 0; c < oldGridSize; c++) {
                    if (r < gridSize && c < gridSize) {
                        if (grid[f] && grid[f][r] && grid[f][r][c]) {
                            newGrid[f][r][c] = grid[f][r][c];
                        }
                    }
                }
            }
        }
    }
    grid = newGrid;
}

// --- 6. BOUNDS CHECKING SAFE WRAPPER ---
function getCell(floor, row, col) {
    if (floor < 0 || floor >= 3) return null;
    if (row < 0 || row >= gridSize) return null;
    if (col < 0 || col >= gridSize) return null;
    if (!grid || !grid[floor] || !grid[floor][row]) return null;
    return grid[floor][row][col];
}

// --- 7. STATE SERIALIZATION (LocalStorage) ---

function saveGameState() {
    try {
        const activeCrops = [];
        const cropsSeen = new Set();
        for (let f = 0; f < 3; f++) {
            for (let r = 0; r < gridSize; r++) {
                for (let c = 0; c < gridSize; c++) {
                    const cell = getCell(f, r, c);
                    if (cell && cell.cropInstance && !cropsSeen.has(cell.cropInstance.id)) {
                        const crop = cell.cropInstance;
                        cropsSeen.add(crop.id);
                        activeCrops.push({
                            id: crop.id,
                            floor: crop.floor,
                            row: crop.row,
                            col: crop.col,
                            typeName: crop.cropType.name,
                            growth: crop.growth
                        });
                    }
                }
            }
        }
        
        const moistureData = [];
        for (let f = 0; f < 3; f++) {
            moistureData.push([]);
            for (let r = 0; r < gridSize; r++) {
                moistureData[f].push([]);
                for (let c = 0; c < gridSize; c++) {
                    const cell = getCell(f, r, c);
                    moistureData[f][r].push(cell ? Math.round(cell.waterLevel) : 0);
                }
            }
        }
        
        const droneData = drones.map(d => ({
            type: d.type,
            x: d.x,
            y: d.y
        }));
        
        const saveData = {
            coins,
            xp,
            level,
            harvestCount,
            gridSize,
            dayNightTime,
            upgrades: {
                gridSize: upgrades.gridSize.level,
                growthSpeed: upgrades.growthSpeed.level,
                autoSpeed: upgrades.autoSpeed.level,
                waterDuration: upgrades.waterDuration.level
            },
            crops: activeCrops,
            moisture: moistureData,
            drones: droneData
        };
        
        localStorage.setItem('nanogarden_save', JSON.stringify(saveData));
    } catch (e) {
        console.error("Auto-save error:", e);
    }
}

function loadGameState() {
    try {
        const raw = localStorage.getItem('nanogarden_save');
        if (!raw) return false;
        
        const saveData = JSON.parse(raw);
        if (!saveData) return false;
        
        coins = saveData.coins ?? 20;
        xp = saveData.xp ?? 0;
        level = saveData.level ?? 1;
        harvestCount = saveData.harvestCount ?? 0;
        gridSize = saveData.gridSize ?? 6;
        dayNightTime = saveData.dayNightTime ?? 15;
        
        // Restore upgrade records
        if (saveData.upgrades) {
            upgrades.gridSize.level = saveData.upgrades.gridSize ?? 0;
            upgrades.growthSpeed.level = saveData.upgrades.growthSpeed ?? 1;
            upgrades.growthSpeed.multiplier = upgrades.growthSpeed.multipliers[upgrades.growthSpeed.level - 1] ?? 1.0;
            
            upgrades.autoSpeed.level = saveData.upgrades.autoSpeed ?? 1;
            upgrades.autoSpeed.multiplier = upgrades.autoSpeed.multipliers[upgrades.autoSpeed.level - 1] ?? 1.0;
            
            upgrades.waterDuration.level = saveData.upgrades.waterDuration ?? 1;
            upgrades.waterDuration.value = upgrades.waterDuration.values[upgrades.waterDuration.level - 1] ?? 1.0;
        }
        
        // Re-construct grid dimensions
        initGrid(false);
        
        // Restore moisture levels
        if (saveData.moisture) {
            for (let f = 0; f < Math.min(3, saveData.moisture.length); f++) {
                const floorM = saveData.moisture[f];
                for (let r = 0; r < Math.min(gridSize, floorM.length); r++) {
                    const rowM = floorM[r];
                    for (let c = 0; c < Math.min(gridSize, rowM.length); c++) {
                        const cell = getCell(f, r, c);
                        if (cell) {
                            cell.waterLevel = rowM[c] ?? 0;
                        }
                    }
                }
            }
        }
        
        // Re-instantiate crop structures
        if (saveData.crops) {
            saveData.crops.forEach(cData => {
                const cropType = CROPS.find(cr => cr.name === cData.typeName);
                if (cropType) {
                    const cropInstance = {
                        id: cData.id ?? Math.random().toString(36).substr(2, 9),
                        cropType: cropType,
                        row: cData.row,
                        col: cData.col,
                        floor: cData.floor,
                        growth: cData.growth ?? 0,
                        isHarvestReserved: false
                    };
                    
                    // Assign to cell indices
                    for (let r = cData.row; r < cData.row + cropType.height; r++) {
                        for (let c = cData.col; c < cData.col + cropType.width; c++) {
                            const cell = getCell(cData.floor, r, c);
                            if (cell) {
                                cell.cropInstance = cropInstance;
                            }
                        }
                    }
                }
            });
        }
        
        // Re-spawn drones
        drones = [];
        harvesterCount = 0;
        planterCount = 0;
        watererCount = 0;
        if (saveData.drones) {
            saveData.drones.forEach(d => {
                drones.push(new Drone(Math.random(), d.type, d.x, d.y));
                if (d.type === 'harvester') harvesterCount++;
                if (d.type === 'planter') planterCount++;
                if (d.type === 'waterer') watererCount++;
            });
        }
        
        return true;
    } catch (e) {
        console.error("Load save error:", e);
        return false;
    }
}

// --- 8. GRID MANAGEMENT & ACTIONS ---

function resizeCanvas() {
    canvas.width = 640;
    canvas.height = 640;
    
    const gridPixelSize = 544;
    gridOffsetX = (640 - gridPixelSize) / 2;
    gridOffsetY = (640 - gridPixelSize) / 2;
    cellSize = gridPixelSize / gridSize;
    
    drones.forEach(d => {
        if (d.x < -100 || d.x > canvas.width + 100 || d.y < -1500 || d.y > 800) {
            d.x = canvas.width / 2;
            d.y = -activeFloor * 640;
            d.tx = canvas.width / 2;
            d.ty = -activeFloor * 640;
        }
    });
}

function getCellFromCoords(x, y) {
    const r = Math.floor((y - gridOffsetY) / cellSize);
    const c = Math.floor((x - gridOffsetX) / cellSize);
    if (r >= 0 && r < gridSize && c >= 0 && c < gridSize) {
        return { row: r, col: c };
    }
    return null;
}

function plantCrop(floor, row, col, cropType) {
    if (row < 0 || row + cropType.height > gridSize || col < 0 || col + cropType.width > gridSize) {
        return false;
    }
    
    // Fit space verification
    for (let r = row; r < row + cropType.height; r++) {
        for (let c = col; c < col + cropType.width; c++) {
            const cell = getCell(floor, r, c);
            if (!cell || cell.cropInstance || (cell.reservedBy && cell.reservedBy !== 'planter')) {
                return false;
            }
        }
    }
    
    const cropInstance = {
        id: Math.random().toString(36).substr(2, 9),
        cropType: cropType,
        row: row,
        col: col,
        floor: floor,
        growth: cropType.isStructure ? 100 : 0,
        isHarvestReserved: false
    };
    
    for (let r = row; r < row + cropType.height; r++) {
        for (let c = col; c < col + cropType.width; c++) {
            const cell = getCell(floor, r, c);
            if (cell) {
                cell.cropInstance = cropInstance;
            }
        }
    }
    
    SoundFX.playPlant();
    
    const px = gridOffsetX + (col + cropType.width / 2) * cellSize;
    const py = gridOffsetY + (row + cropType.height / 2) * cellSize - floor * 640;
    spawnPlantParticles(px, py);
    
    saveGameState(); // Autosave action
    return true;
}

function harvestCropAt(floor, row, col) {
    const cell = getCell(floor, row, col);
    if (!cell || !cell.cropInstance) return false;
    
    const crop = cell.cropInstance;
    
    // Remove structures
    if (crop.cropType.isStructure) {
        coins += Math.round(crop.cropType.cost / 2);
        SoundFX.playHarvest();
        
        const px = gridOffsetX + (crop.col + crop.cropType.width / 2) * cellSize;
        const py = gridOffsetY + (crop.row + crop.cropType.height / 2) * cellSize - crop.floor * 640;
        
        spawnHarvestParticles(px, py);
        spawnTextParticle(px, py, `Refunded`, 'var(--accent)');
        
        // Memory Leak Sweep: Clear drone target bindings immediately
        drones.forEach(d => {
            if (d.targetCrop === crop) {
                d.targetCrop = null;
                d.state = 'idle';
            }
            if (d.targetCell && d.targetCell.floor === floor && d.targetCell.row === crop.row && d.targetCell.col === crop.col) {
                d.targetCell = null;
                d.state = 'idle';
            }
        });
        
        for (let r = crop.row; r < crop.row + crop.cropType.height; r++) {
            for (let c = crop.col; c < crop.col + crop.cropType.width; c++) {
                const targetCell = getCell(floor, r, c);
                if (targetCell) {
                    targetCell.cropInstance = null;
                    targetCell.reservedBy = null;
                }
            }
        }
        updateUI();
        saveGameState();
        return true;
    }
    
    if (crop.growth < 100) return false;
    
    const revenue = crop.cropType.revenue;
    const xpReward = crop.cropType.xp;
    
    coins += revenue;
    addXP(xpReward);
    harvestCount++;
    
    SoundFX.playHarvest();
    
    const px = gridOffsetX + (crop.col + crop.cropType.width / 2) * cellSize;
    const py = gridOffsetY + (crop.row + crop.cropType.height / 2) * cellSize - crop.floor * 640;
    
    spawnHarvestParticles(px, py);
    spawnTextParticle(px, py - 12, `+$${revenue}`, 'var(--accent)');
    spawnTextParticle(px, py + 12, `+${xpReward} XP`, 'var(--upgrade)');
    
    // Memory Leak Sweep: Clear drone targets
    drones.forEach(d => {
        if (d.targetCrop === crop) {
            d.targetCrop = null;
            d.state = 'idle';
        }
    });
    
    for (let r = crop.row; r < crop.row + crop.cropType.height; r++) {
        for (let c = crop.col; c < crop.col + crop.cropType.width; c++) {
            const targetCell = getCell(floor, r, c);
            if (targetCell) {
                targetCell.cropInstance = null;
                targetCell.reservedBy = null;
            }
        }
    }
    
    updateUI();
    saveGameState();
    return true;
}

// --- 9. PARTICLE PHYSICS SYSTEM (Capped at 150) ---

function addParticle(p) {
    particles.push(p);
    
    // Memory Leak Sweep: Strict bounding cap
    if (particles.length > 150) {
        particles.splice(0, particles.length - 150);
    }
}

function spawnWaterParticles(x, y, count = 8) {
    for (let i = 0; i < count; i++) {
        addParticle({
            x: x,
            y: y,
            vx: (Math.random() - 0.5) * 50,
            vy: -50 - Math.random() * 60,
            size: 2.5 + Math.random() * 2.5,
            color: `rgba(${56 + Math.floor(Math.random() * 40)}, ${189 + Math.floor(Math.random() * 40)}, 248, ${0.75 + Math.random() * 0.25})`,
            life: 0.5 + Math.random() * 0.4,
            gravity: 180,
            update(dt) {
                this.x += this.vx * dt;
                this.vy += this.gravity * dt;
                this.y += this.vy * dt;
                this.life -= dt;
                
                if (this.x < -100 || this.x > 740 || this.y < -1500 || this.y > 1000) {
                    this.life = 0;
                }
            },
            draw(ctx) {
                ctx.fillStyle = this.color;
                ctx.beginPath();
                ctx.arc(this.x, this.y + currentScrollY, this.size, 0, Math.PI * 2);
                ctx.fill();
            },
            isDead() { return this.life <= 0; }
        });
    }
}

function spawnHarvestParticles(x, y, count = 12) {
    for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 50 + Math.random() * 80;
        addParticle({
            x: x,
            y: y,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed - 15,
            size: 3 + Math.random() * 3,
            color: Math.random() > 0.45 ? 'var(--accent)' : '#ffeb3b',
            life: 0.6 + Math.random() * 0.4,
            gravity: 80,
            update(dt) {
                this.x += this.vx * dt;
                this.vy += this.gravity * dt;
                this.y += this.vy * dt;
                this.vx *= 0.95;
                this.life -= dt;
                
                if (this.x < -100 || this.x > 740 || this.y < -1500 || this.y > 1000) {
                    this.life = 0;
                }
            },
            draw(ctx) {
                ctx.save();
                ctx.fillStyle = this.color;
                ctx.shadowColor = this.color;
                ctx.shadowBlur = 4;
                ctx.fillRect(this.x - this.size / 2, this.y + currentScrollY - this.size / 2, this.size, this.size);
                ctx.restore();
            },
            isDead() { return this.life <= 0; }
        });
    }
}

function spawnPlantParticles(x, y) {
    for (let i = 0; i < 8; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 25 + Math.random() * 30;
        addParticle({
            x: x,
            y: y,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed - 10,
            size: 2 + Math.random() * 2,
            color: Math.random() > 0.4 ? 'var(--primary)' : 'var(--border-glass-active)',
            life: 0.4 + Math.random() * 0.3,
            update(dt) {
                this.x += this.vx * dt;
                this.y += this.vy * dt;
                this.life -= dt;
                
                if (this.x < -100 || this.x > 740 || this.y < -1500 || this.y > 1000) {
                    this.life = 0;
                }
            },
            draw(ctx) {
                ctx.fillStyle = this.color;
                ctx.fillRect(this.x - this.size / 2, this.y + currentScrollY - this.size / 2, this.size, this.size);
            },
            isDead() { return this.life <= 0; }
        });
    }
}

function spawnTextParticle(x, y, text, color) {
    addParticle({
        x: x,
        y: y,
        vy: -35 - Math.random() * 15,
        text: text,
        color: color,
        life: 1.0,
        maxLife: 1.0,
        update(dt) {
            this.y += this.vy * dt;
            this.life -= dt;
            
            if (this.y < -1500 || this.y > 1000) {
                this.life = 0;
            }
        },
        draw(ctx) {
            ctx.save();
            ctx.font = 'bold 13px Outfit';
            ctx.fillStyle = this.color;
            ctx.textAlign = 'center';
            ctx.globalAlpha = Math.max(0, this.life / this.maxLife);
            ctx.fillText(this.text, this.x, this.y + currentScrollY);
            ctx.restore();
        },
        isDead() { return this.life <= 0; }
    });
}

function spawnLevelUpParticles() {
    const cx = canvas.width / 2;
    const cy = canvas.height / 2 - activeFloor * 640;
    for (let i = 0; i < 30; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 100 + Math.random() * 120;
        addParticle({
            x: cx,
            y: cy,
            vx: Math.cos(angle) * speed,
            vy: Math.sin(angle) * speed - 60,
            size: 4 + Math.random() * 4,
            color: Math.random() > 0.5 ? 'var(--primary)' : 'var(--upgrade)',
            life: 1.2 + Math.random() * 0.6,
            gravity: 120,
            update(dt) {
                this.x += this.vx * dt;
                this.vy += this.gravity * dt;
                this.y += this.vy * dt;
                this.vx *= 0.96;
                this.life -= dt;
                
                if (this.x < -100 || this.x > 740 || this.y < -1500 || this.y > 1000) {
                    this.life = 0;
                }
            },
            draw(ctx) {
                ctx.save();
                ctx.fillStyle = this.color;
                ctx.shadowColor = this.color;
                ctx.shadowBlur = 8;
                ctx.beginPath();
                ctx.arc(this.x, this.y + currentScrollY, this.size, 0, Math.PI * 2);
                ctx.fill();
                ctx.restore();
            },
            isDead() { return this.life <= 0; }
        });
    }
    spawnTextParticle(cx, cy - 35, "LEVEL UP!", "var(--primary)");
}

// --- 10. AUTOMATION DRONES ---
class Drone {
    constructor(id, type, x, y) {
        this.id = id;
        this.type = type;
        this.x = x;
        this.y = y;
        this.tx = x;
        this.ty = y;
        this.state = 'idle';
        this.targetCell = null;
        this.targetCrop = null;
        this.speed = 110;
        this.rotorsAngle = 0;
        this.idleTimer = Math.random() * 100;
    }
    
    update(dt) {
        this.rotorsAngle += 18 * dt;
        this.idleTimer += dt;
        
        const currentSpeed = this.speed * upgrades.autoSpeed.multiplier;
        
        if (this.state === 'idle') {
            this.findJob();
            
            const cx = gridOffsetX + (gridSize * cellSize) / 2;
            const cy = gridOffsetY - 40 - activeFloor * 640;
            const offsetDist = gridSize * cellSize * 0.4;
            this.tx = cx + Math.cos(this.idleTimer * 0.7 + this.id) * offsetDist;
            this.ty = cy + Math.sin(this.idleTimer * 1.3 + this.id) * 12;
        }
        
        if (this.state === 'moving') {
            const dx = this.tx - this.x;
            const dy = this.ty - this.y;
            const dist = Math.sqrt(dx * dx + dy * dy);
            
            if (dist < 4) {
                this.x = this.tx;
                this.y = this.ty;
                
                if (this.type === 'harvester') {
                    if (this.targetCrop) {
                        harvestCropAt(this.targetCrop.floor, this.targetCrop.row, this.targetCrop.col);
                        this.targetCrop = null;
                    }
                    this.state = 'idle';
                } else if (this.type === 'planter') {
                    if (this.targetCell) {
                        const tc = this.targetCell;
                        plantCrop(tc.floor, tc.row, tc.col, tc.cropType);
                        
                        for (let r = tc.row; r < tc.row + tc.cropType.height; r++) {
                            for (let c = tc.col; c < tc.col + tc.cropType.width; c++) {
                                const cell = getCell(tc.floor, r, c);
                                if (cell) cell.reservedBy = null;
                            }
                        }
                        this.targetCell = null;
                    }
                    this.state = 'idle';
                } else if (this.type === 'waterer') {
                    this.state = 'watering';
                }
            } else {
                const step = currentSpeed * dt;
                const angle = Math.atan2(dy, dx);
                this.x += Math.cos(angle) * Math.min(step, dist);
                this.y += Math.sin(angle) * Math.min(step, dist);
                
                if (Math.random() < 0.22) {
                    addParticle({
                        x: this.x,
                        y: this.y + 6,
                        vx: -Math.cos(angle) * 15 + (Math.random() - 0.5) * 8,
                        vy: -Math.sin(angle) * 15 + 15,
                        size: 1.5,
                        color: this.type === 'harvester' ? 'var(--secondary)' : (this.type === 'planter' ? 'var(--accent)' : 'var(--secondary)'),
                        life: 0.35,
                        update(dt) {
                            this.x += this.vx * dt;
                            this.y += this.vy * dt;
                            this.life -= dt;
                        },
                        draw(ctx) {
                            ctx.fillStyle = this.color;
                            ctx.fillRect(this.x, this.y + currentScrollY, this.size, this.size);
                        },
                        isDead() { return this.life <= 0; }
                    });
                }
            }
        }
        
        if (this.state === 'watering') {
            if (this.targetCell) {
                const cell = getCell(this.targetCell.floor, this.targetCell.row, this.targetCell.col);
                if (cell) {
                    cell.waterLevel = Math.min(100, cell.waterLevel + 160 * dt);
                    
                    if (Math.random() < 0.45) {
                        const cx = gridOffsetX + this.targetCell.col * cellSize + cellSize / 2;
                        const cy = gridOffsetY + this.targetCell.row * cellSize + cellSize / 2 - this.targetCell.floor * 640;
                        spawnWaterParticles(cx + (Math.random() - 0.5) * 15, cy - 8, 1);
                    }
                    
                    if (Math.random() < 0.08) {
                        SoundFX.playWater();
                    }
                    
                    if (cell.waterLevel >= 100) {
                        cell.waterLevel = 100;
                        cell.waterReserved = false;
                        this.targetCell = null;
                        this.state = 'idle';
                    }
                } else {
                    this.state = 'idle';
                }
            } else {
                this.state = 'idle';
            }
        }
        
        this.x = Math.max(-100, Math.min(canvas.width + 100, this.x));
        this.y = Math.max(-1480, Math.min(800, this.y));
    }
    
    findJob() {
        if (this.type === 'harvester') {
            for (let f = 2; f >= 0; f--) {
                for (let r = 0; r < gridSize; r++) {
                    for (let c = 0; c < gridSize; c++) {
                        const cell = getCell(f, r, c);
                        if (cell && cell.cropInstance && !cell.cropInstance.cropType.isStructure && cell.cropInstance.growth >= 100 && !cell.cropInstance.isHarvestReserved) {
                            const crop = cell.cropInstance;
                            crop.isHarvestReserved = true;
                            this.targetCrop = crop;
                            
                            this.tx = gridOffsetX + (crop.col + crop.cropType.width / 2) * cellSize;
                            this.ty = gridOffsetY + (crop.row + crop.cropType.height / 2) * cellSize - f * 640;
                            this.state = 'moving';
                            return;
                        }
                    }
                }
            }
        } else if (this.type === 'planter') {
            if (!selectedSeed || selectedSeed.isStructure) return;
            const cropType = selectedSeed;
            if (coins < cropType.cost) return;
            
            for (let f = 0; f < 3; f++) {
                const spot = findEmptySpotFor(f, cropType.width, cropType.height);
                if (spot) {
                    for (let r = spot.row; r < spot.row + cropType.height; r++) {
                        for (let c = spot.col; c < spot.col + cropType.width; c++) {
                            const cell = getCell(f, r, c);
                            if (cell) cell.reservedBy = 'planter';
                        }
                    }
                    
                    coins -= cropType.cost;
                    updateUI();
                    
                    this.targetCell = {
                        floor: f,
                        row: spot.row,
                        col: spot.col,
                        cropType: cropType
                    };
                    
                    this.tx = gridOffsetX + (spot.col + cropType.width / 2) * cellSize;
                    this.ty = gridOffsetY + (spot.row + cropType.height / 2) * cellSize - f * 640;
                    this.state = 'moving';
                    return;
                }
            }
        } else if (this.type === 'waterer') {
            for (let f = 0; f < 3; f++) {
                for (let r = 0; r < gridSize; r++) {
                    for (let c = 0; c < gridSize; c++) {
                        const cell = getCell(f, r, c);
                        if (cell && cell.waterLevel < 25 && !cell.waterReserved) {
                            cell.waterReserved = true;
                            this.targetCell = { floor: f, row: r, col: c };
                            
                            this.tx = gridOffsetX + c * cellSize + cellSize / 2;
                            this.ty = gridOffsetY + r * cellSize + cellSize / 2 - f * 640;
                            this.state = 'moving';
                            return;
                        }
                    }
                }
            }
        }
    }
    
    draw(ctx) {
        ctx.save();
        
        const floatOffset = Math.sin(this.idleTimer * 4.5 + this.id) * 3;
        const dx = this.x;
        const dy = this.y + floatOffset + currentScrollY;
        
        if (dy < -50 || dy > canvas.height + 50) {
            ctx.restore();
            return;
        }
        
        ctx.strokeStyle = '#64748b';
        ctx.lineWidth = 1.8;
        
        ctx.beginPath();
        const rx1 = dx - 11;
        const ry1 = dy - 2;
        ctx.moveTo(rx1 - Math.cos(this.rotorsAngle) * 7, ry1 - Math.sin(this.rotorsAngle) * 2);
        ctx.lineTo(rx1 + Math.cos(this.rotorsAngle) * 7, ry1 + Math.sin(this.rotorsAngle) * 2);
        ctx.stroke();
        
        ctx.beginPath();
        const rx2 = dx + 11;
        const ry2 = dy - 2;
        ctx.moveTo(rx2 - Math.cos(this.rotorsAngle + Math.PI / 2) * 7, ry2 - Math.sin(this.rotorsAngle + Math.PI / 2) * 2);
        ctx.lineTo(rx2 + Math.cos(this.rotorsAngle + Math.PI / 2) * 7, ry2 + Math.sin(this.rotorsAngle + Math.PI / 2) * 2);
        ctx.stroke();
        
        ctx.fillStyle = '#334155';
        ctx.strokeStyle = '#1e293b';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(dx, dy, 8, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        
        let lensColor = 'var(--primary)';
        let glowColor = 'rgba(16, 185, 129, 0.6)';
        
        if (this.type === 'harvester') {
            lensColor = 'var(--secondary)';
            glowColor = 'rgba(14, 165, 233, 0.7)';
        } else if (this.type === 'planter') {
            lensColor = 'var(--accent)';
            glowColor = 'rgba(245, 158, 11, 0.7)';
        } else if (this.type === 'waterer') {
            lensColor = '#38bdf8';
            glowColor = 'rgba(56, 189, 248, 0.7)';
        }
        
        ctx.shadowColor = glowColor;
        ctx.shadowBlur = 6;
        ctx.fillStyle = lensColor;
        ctx.beginPath();
        ctx.arc(dx, dy, 3, 0, Math.PI * 2);
        ctx.fill();
        
        ctx.restore();
    }
}

// --- 11. RENDER LOOP SYSTEM ---

function drawBackground() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function drawCropShadow(ctx, sprite, px, py, pw, ph) {
    if (!shadowSilhouetteCanvas) return;
    
    shadowSilhouetteCanvas.width = pw;
    shadowSilhouetteCanvas.height = ph;
    
    const sCtx = shadowSilhouetteCanvas.getContext('2d');
    sCtx.clearRect(0, 0, pw, ph);
    sCtx.drawImage(sprite, 0, 0, pw, ph);
    
    sCtx.globalCompositeOperation = 'source-in';
    sCtx.fillStyle = 'rgba(0, 0, 0, 0.38)';
    sCtx.fillRect(0, 0, pw, ph);
    
    ctx.save();
    ctx.translate(px + pw / 2, py + ph);
    
    const skewX = -Math.cos(theta) * 0.85;
    const scaleY = Math.abs(Math.sin(theta)) * 0.22 + 0.08;
    ctx.transform(1, 0, skewX, scaleY, 0, 0);
    
    ctx.translate(-pw / 2, -ph);
    ctx.drawImage(shadowSilhouetteCanvas, 0, 0, pw, ph);
    ctx.restore();
}

function updateSoilAndCrops(dt) {
    const growthUpgradeMultiplier = upgrades.growthSpeed.multiplier;
    const waterEvaporationMultiplier = upgrades.waterDuration.value;
    const evaporationRate = 4 / waterEvaporationMultiplier;
    
    const isNight = Math.sin(theta) <= 0;
    
    // 1. Hydraulic Ascent pipe routing
    for (let f = 0; f < 2; f++) {
        for (let r = 0; r < gridSize; r++) {
            for (let c = 0; c < gridSize; c++) {
                const cell = getCell(f, r, c);
                if (cell && cell.cropInstance && cell.cropInstance.cropType.name === 'Ascent Pipe') {
                    if (cell.waterLevel > 0) {
                        const flow = Math.min(cell.waterLevel, 15 * dt);
                        cell.waterLevel -= flow;
                        const upperCell = getCell(f + 1, r, c);
                        if (upperCell) {
                            upperCell.waterLevel = Math.min(100, upperCell.waterLevel + flow);
                        }
                        
                        if (Math.random() < 0.22) {
                            const px = gridOffsetX + c * cellSize + cellSize / 2;
                            const pyStart = gridOffsetY + r * cellSize + cellSize / 2 - f * 640;
                            addParticle({
                                x: px + (Math.random() - 0.5) * 8,
                                y: pyStart,
                                targetY: pyStart - 640,
                                vx: (Math.random() - 0.5) * 6,
                                vy: -380,
                                size: 1.5 + Math.random() * 2,
                                color: 'rgba(56, 189, 248, 0.9)',
                                life: 1.8,
                                update(dt) {
                                    this.y += this.vy * dt;
                                    this.x += this.vx * dt;
                                    this.life -= dt;
                                },
                                draw(ctx) {
                                    ctx.fillStyle = this.color;
                                    ctx.beginPath();
                                    ctx.arc(this.x, this.y + currentScrollY, this.size, 0, Math.PI * 2);
                                    ctx.fill();
                                },
                                isDead() { return this.life <= 0 || this.y <= this.targetY; }
                            });
                        }
                    }
                }
            }
        }
    }
    
    // 2. Loop over levels
    for (let f = 0; f < 3; f++) {
        const floorYOffset = currentScrollY - f * 640;
        const isFloorVisible = (floorYOffset > -640 && floorYOffset < 640);
        
        if (isFloorVisible) {
            let bgCanvas = grassPatternCanvas;
            if (f === 1) bgCanvas = hydroBackgroundCanvas;
            else if (f === 2) bgCanvas = canopyBackgroundCanvas;
            
            if (bgCanvas) {
                ctx.drawImage(bgCanvas, 0, floorYOffset);
            }
            
            // Floor 1 metallic reflection sheen
            if (f === 1) {
                const sheenOffset = ((sunX / 2) + 320) % 640;
                ctx.save();
                ctx.strokeStyle = 'rgba(255, 255, 255, 0.045)';
                ctx.lineWidth = 20;
                ctx.beginPath();
                ctx.moveTo(sheenOffset - 120, floorYOffset);
                ctx.lineTo(sheenOffset + 120, floorYOffset + 640);
                ctx.stroke();
                ctx.restore();
            }
            
            // Floor 2 dome reflections
            if (f === 2) {
                ctx.save();
                ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
                ctx.lineWidth = 3;
                ctx.beginPath();
                ctx.arc(gridOffsetX + 120, gridOffsetY + 120 + floorYOffset, 90, Math.PI, Math.PI * 1.5);
                ctx.stroke();
                ctx.restore();
            }
            
            const startX = gridOffsetX - 8;
            const startY = gridOffsetY - 8 + floorYOffset;
            const bedWidth = gridSize * cellSize + 16;
            const bedHeight = gridSize * cellSize + 16;
            
            ctx.save();
            ctx.fillStyle = '#451a03';
            ctx.strokeStyle = '#1c0a00';
            ctx.lineWidth = 3.5;
            ctx.fillRect(startX, startY, bedWidth, bedHeight);
            ctx.strokeRect(startX, startY, bedWidth, bedHeight);
            
            ctx.fillStyle = '#1c1917';
            ctx.fillRect(gridOffsetX, gridOffsetY + floorYOffset, gridSize * cellSize, gridSize * cellSize);
            ctx.restore();
        }
        
        // Soils
        for (let r = 0; r < gridSize; r++) {
            for (let c = 0; c < gridSize; c++) {
                const cell = getCell(f, r, c);
                if (cell) {
                    if (cell.waterLevel > 0) {
                        cell.waterLevel = Math.max(0, cell.waterLevel - evaporationRate * dt);
                    }
                    
                    if (isFloorVisible) {
                        const px = gridOffsetX + c * cellSize;
                        const py = gridOffsetY + r * cellSize + floorYOffset;
                        
                        ctx.drawImage(sprites.soilDry, px, py, cellSize, cellSize);
                        if (cell.waterLevel > 0) {
                            ctx.globalAlpha = cell.waterLevel / 100;
                            ctx.drawImage(sprites.soilWet, px, py, cellSize, cellSize);
                            ctx.globalAlpha = 1.0;
                        }
                    }
                }
            }
        }
        
        // Crops
        const drawnCrops = new Set();
        for (let r = 0; r < gridSize; r++) {
            for (let c = 0; c < gridSize; c++) {
                const cell = getCell(f, r, c);
                if (cell && cell.cropInstance && !drawnCrops.has(cell.cropInstance.id)) {
                    const crop = cell.cropInstance;
                    drawnCrops.add(crop.id);
                    
                    let totalWater = 0;
                    let cellCount = 0;
                    for (let tr = crop.row; tr < crop.row + crop.cropType.height; tr++) {
                        for (let tc = crop.col; tc < crop.col + crop.cropType.width; tc++) {
                            const innerCell = getCell(f, tr, tc);
                            if (innerCell) {
                                totalWater += innerCell.waterLevel;
                                cellCount++;
                            }
                        }
                    }
                    const avgWater = cellCount > 0 ? (totalWater / cellCount) : 0;
                    
                    if (!crop.cropType.isStructure && crop.growth < 100) {
                        const waterBonus = 1 + (avgWater / 100) * 1.5;
                        const baseGrowthRate = 100 / crop.cropType.growthTime;
                        crop.growth = Math.min(100, crop.growth + baseGrowthRate * growthUpgradeMultiplier * waterBonus * dt);
                    }
                    
                    if (isFloorVisible) {
                        const px = gridOffsetX + crop.col * cellSize;
                        const py = gridOffsetY + crop.row * cellSize + floorYOffset;
                        const pw = crop.cropType.width * cellSize;
                        const ph = crop.cropType.height * cellSize;
                        
                        let stage = 0;
                        if (crop.growth >= 100) stage = 3;
                        else if (crop.growth >= 55) stage = 2;
                        else if (crop.growth >= 18) stage = 1;
                        else stage = 0;
                        
                        // LOD sprites scaling
                        let sprite = null;
                        if (f === activeFloor) {
                            // LOD 0 (Detailed)
                            if (stage === 0) sprite = sprites.seed;
                            else if (stage === 1) sprite = sprites.sprout;
                            else {
                                const nameLower = crop.cropType.name.toLowerCase();
                                sprite = sprites[nameLower] ? sprites[nameLower][stage] : null;
                            }
                        } else {
                            // LOD 1 (Simplified)
                            if (crop.growth < 55) {
                                sprite = sprites.sprout;
                            } else {
                                const nameLower = crop.cropType.name.toLowerCase();
                                sprite = sprites[nameLower] ? sprites[nameLower][2] : sprites.sprout;
                            }
                        }
                        
                        if (sprite) {
                            drawCropShadow(ctx, sprite, px, py, pw, ph);
                            ctx.drawImage(sprite, px, py, pw, ph);
                        }
                        
                        if (f === activeFloor && !crop.cropType.isStructure && crop.growth < 100) {
                            drawGrowthBar(px, py, pw, ph, crop.growth);
                        }
                        
                        // Emissive glows at night
                        if (isNight && crop.growth >= 100) {
                            const nameLower = crop.cropType.name.toLowerCase();
                            ctx.save();
                            
                            if (nameLower === 'strawberry') {
                                ctx.fillStyle = '#fde047';
                                ctx.shadowColor = '#fde047';
                                ctx.shadowBlur = 4;
                                ctx.fillRect(px + pw / 3, py + ph / 2, 1.5, 1.5);
                                ctx.fillRect(px + 2 * pw / 3, py + ph / 3, 1.5, 1.5);
                                ctx.fillRect(px + pw / 2, py + 2 * ph / 3, 1.5, 1.5);
                            } else if (nameLower === 'watermelon') {
                                ctx.strokeStyle = '#4ade80';
                                ctx.shadowColor = '#4ade80';
                                ctx.shadowBlur = 4;
                                ctx.lineWidth = 1.8;
                                ctx.beginPath();
                                ctx.moveTo(px + pw / 4, py + ph / 3);
                                ctx.lineTo(px + pw / 4, py + 2 * ph / 3);
                                ctx.moveTo(px + pw / 2, py + ph / 4);
                                ctx.lineTo(px + pw / 2, py + 3 * ph / 4);
                                ctx.moveTo(px + 3 * pw / 4, py + ph / 3);
                                ctx.lineTo(px + 3 * pw / 4, py + 2 * ph / 3);
                                ctx.stroke();
                            } else if (nameLower === 'sunflower') {
                                ctx.strokeStyle = 'rgba(245, 158, 11, 0.85)';
                                ctx.shadowColor = '#f59e0b';
                                ctx.shadowBlur = 8;
                                ctx.lineWidth = 1.5;
                                ctx.beginPath();
                                ctx.arc(px + pw / 2, py + ph / 4, pw / 3.2, 0, Math.PI * 2);
                                ctx.stroke();
                            } else if (nameLower === 'pumpkin') {
                                ctx.fillStyle = '#f97316';
                                ctx.shadowColor = '#ea580c';
                                ctx.shadowBlur = 10;
                                
                                ctx.beginPath();
                                ctx.moveTo(px + pw / 3 - 1, py + ph / 2.8);
                                ctx.lineTo(px + pw / 3 - 5, py + ph / 2.8 + 6);
                                ctx.lineTo(px + pw / 3 + 3, py + ph / 2.8 + 6);
                                ctx.closePath();
                                ctx.fill();
                                
                                ctx.beginPath();
                                ctx.moveTo(px + 2 * pw / 3 - 1, py + ph / 2.8);
                                ctx.lineTo(px + 2 * pw / 3 - 5, py + ph / 2.8 + 6);
                                ctx.lineTo(px + 2 * pw / 3 + 3, py + ph / 2.8 + 6);
                                ctx.closePath();
                                ctx.fill();
                                
                                ctx.beginPath();
                                ctx.moveTo(px + pw / 3.8, py + ph / 2 + 3);
                                ctx.lineTo(px + pw / 3, py + ph / 2 + 7);
                                ctx.lineTo(px + pw / 2, py + ph / 2 + 3);
                                ctx.lineTo(px + 2 * pw / 3, py + ph / 2 + 7);
                                ctx.lineTo(px + 3 * pw / 4.2, py + ph / 2 + 3);
                                ctx.lineTo(px + pw / 2, py + ph / 2 + 11);
                                ctx.closePath();
                                ctx.fill();
                            }
                            ctx.restore();
                        }
                    }
                }
            }
        }
    }
}

function drawGrowthBar(x, y, w, h, growth) {
    const barW = w - 16;
    const barH = 5;
    const barX = x + 8;
    const barY = y + h - 8;
    
    ctx.save();
    ctx.fillStyle = 'var(--bg-dark)';
    ctx.fillRect(barX, barY, barW, barH);
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.12)';
    ctx.lineWidth = 1;
    ctx.strokeRect(barX, barY, barW, barH);
    
    ctx.fillStyle = 'var(--primary)';
    ctx.fillRect(barX + 0.5, barY + 0.5, (barW - 1) * (growth / 100), barH - 1);
    ctx.restore();
}

function drawHoverPreview() {
    const hoverCell = getCellFromCoords(mouseX, mouseY);
    if (!hoverCell) return;
    
    const r = hoverCell.row;
    const c = hoverCell.col;
    
    const floorYOffset = currentScrollY - activeFloor * 640;
    
    if (selectedSeed) {
        const cropType = selectedSeed;
        
        let fits = true;
        if (r + cropType.height > gridSize || c + cropType.width > gridSize) {
            fits = false;
        } else {
            for (let tr = r; tr < r + cropType.height; tr++) {
                for (let tc = c; tc < c + cropType.width; tc++) {
                    const cell = getCell(activeFloor, tr, tc);
                    if (!cell || cell.cropInstance || cell.reservedBy) {
                        fits = false;
                        break;
                    }
                }
                if (!fits) break;
            }
        }
        
        const px = gridOffsetX + c * cellSize;
        const py = gridOffsetY + r * cellSize + floorYOffset;
        const pw = cropType.width * cellSize;
        const ph = cropType.height * cellSize;
        
        ctx.save();
        if (fits) {
            ctx.strokeStyle = 'rgba(52, 211, 153, 0.85)';
            ctx.fillStyle = 'rgba(52, 211, 153, 0.18)';
            ctx.shadowColor = 'rgba(52, 211, 153, 0.45)';
        } else {
            ctx.strokeStyle = 'rgba(239, 68, 68, 0.85)';
            ctx.fillStyle = 'rgba(239, 68, 68, 0.18)';
            ctx.shadowColor = 'rgba(239, 68, 68, 0.45)';
        }
        ctx.shadowBlur = 8;
        ctx.lineWidth = 2.5;
        ctx.strokeRect(px + 2, py + 2, pw - 4, ph - 4);
        ctx.fillRect(px + 2, py + 2, pw - 4, ph - 4);
        
        const cropSprites = sprites[cropType.name.toLowerCase()];
        const sprite = cropSprites ? (cropSprites[3] || cropSprites[2]) : sprites.sprout;
        if (sprite) {
            ctx.globalAlpha = 0.4;
            ctx.drawImage(sprite, px, py, pw, ph);
        }
        ctx.restore();
    } else {
        const cellData = getCell(activeFloor, r, c);
        if (!cellData) return;
        
        if (selectedTool === 'water') {
            const px = gridOffsetX + c * cellSize;
            const py = gridOffsetY + r * cellSize + floorYOffset;
            ctx.save();
            ctx.strokeStyle = 'rgba(14, 165, 233, 0.8)';
            ctx.fillStyle = 'rgba(14, 165, 233, 0.12)';
            ctx.shadowColor = 'rgba(14, 165, 233, 0.4)';
            ctx.shadowBlur = 8;
            ctx.lineWidth = 2;
            ctx.strokeRect(px + 2, py + 2, cellSize - 4, cellSize - 4);
            ctx.fillRect(px + 2, py + 2, cellSize - 4, cellSize - 4);
            ctx.restore();
        } else if (selectedTool === 'harvest') {
            if (cellData.cropInstance) {
                const crop = cellData.cropInstance;
                const px = gridOffsetX + crop.col * cellSize;
                const py = gridOffsetY + crop.row * cellSize + (currentScrollY - crop.floor * 640);
                const pw = crop.cropType.width * cellSize;
                const ph = crop.cropType.height * cellSize;
                
                ctx.save();
                if (crop.growth >= 100 || crop.cropType.isStructure) {
                    ctx.strokeStyle = 'rgba(245, 158, 11, 0.85)';
                    ctx.fillStyle = 'rgba(245, 158, 11, 0.18)';
                    ctx.shadowColor = 'rgba(245, 158, 11, 0.45)';
                } else {
                    ctx.strokeStyle = 'rgba(239, 68, 68, 0.85)';
                    ctx.fillStyle = 'rgba(239, 68, 68, 0.18)';
                    ctx.shadowColor = 'rgba(239, 68, 68, 0.45)';
                }
                ctx.shadowBlur = 8;
                ctx.lineWidth = 2.5;
                ctx.strokeRect(px + 2, py + 2, pw - 4, ph - 4);
                ctx.fillRect(px + 2, py + 2, pw - 4, ph - 4);
                ctx.restore();
            }
        } else if (selectedTool === 'inspect') {
            let px = gridOffsetX + c * cellSize;
            let py = gridOffsetY + r * cellSize + floorYOffset;
            let pw = cellSize;
            let ph = cellSize;
            
            if (cellData.cropInstance) {
                const crop = cellData.cropInstance;
                px = gridOffsetX + crop.col * cellSize;
                py = gridOffsetY + crop.row * cellSize + (currentScrollY - crop.floor * 640);
                pw = crop.cropType.width * cellSize;
                ph = crop.cropType.height * cellSize;
            }
            
            ctx.save();
            ctx.strokeStyle = 'rgba(248, 250, 252, 0.7)';
            ctx.setLineDash([4, 4]);
            ctx.lineWidth = 2;
            ctx.strokeRect(px + 2, py + 2, pw - 4, ph - 4);
            ctx.restore();
        }
    }
}

function drawDiagnostics() {
    if (!noclipEnabled) return;
    
    ctx.save();
    ctx.font = 'bold 9px monospace';
    
    for (let f = 0; f < 3; f++) {
        const floorYOffset = currentScrollY - f * 640;
        if (floorYOffset > -640 && floorYOffset < 640) {
            const drawnCrops = new Set();
            for (let r = 0; r < gridSize; r++) {
                for (let c = 0; c < gridSize; c++) {
                    const cell = getCell(f, r, c);
                    if (cell) {
                        if (cell.cropInstance && !drawnCrops.has(cell.cropInstance.id)) {
                            const crop = cell.cropInstance;
                            drawnCrops.add(crop.id);
                            
                            const px = gridOffsetX + crop.col * cellSize;
                            const py = gridOffsetY + crop.row * cellSize + floorYOffset;
                            const pw = crop.cropType.width * cellSize;
                            const ph = crop.cropType.height * cellSize;
                            
                            ctx.strokeStyle = '#ec4899';
                            ctx.lineWidth = 1.5;
                            ctx.strokeRect(px + 1, py + 1, pw - 2, ph - 2);
                            
                            const rootX = px + pw / 2;
                            const rootYStart = py + ph - 4;
                            const rootDepth = crop.cropType.isStructure ? 4 : (25 * (crop.growth / 100) + 4);
                            ctx.strokeStyle = '#22c55e';
                            ctx.beginPath();
                            ctx.moveTo(rootX, rootYStart);
                            ctx.lineTo(rootX, rootYStart + rootDepth);
                            ctx.stroke();
                            
                            ctx.fillStyle = '#ec4899';
                            ctx.fillText(`${crop.cropType.name.replace(' ', '')} (F${f})`, px + 4, py + 12);
                            ctx.fillStyle = '#22c55e';
                            ctx.fillText(`Root:${Math.round(rootDepth)}px`, px + 4, py + ph - 6);
                        }
                        
                        if (cell.reservedBy) {
                            const px = gridOffsetX + c * cellSize;
                            const py = gridOffsetY + r * cellSize + floorYOffset;
                            ctx.strokeStyle = '#eab308';
                            ctx.strokeRect(px + 3, py + 3, cellSize - 6, cellSize - 6);
                            ctx.fillStyle = '#eab308';
                            ctx.fillText(`RSV:${cell.reservedBy}`, px + 6, py + 14);
                        }
                    }
                }
            }
        }
    }
    
    drones.forEach(d => {
        const drawY = d.y + currentScrollY;
        
        if (d.state === 'moving') {
            ctx.strokeStyle = '#a855f7';
            ctx.setLineDash([2, 4]);
            ctx.beginPath();
            ctx.moveTo(d.x, drawY);
            ctx.lineTo(d.tx, d.ty + currentScrollY);
            ctx.stroke();
            ctx.setLineDash([]);
        }
        
        ctx.strokeStyle = '#06b6d4';
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.arc(d.x, drawY, 12, 0, Math.PI * 2);
        ctx.stroke();
        
        ctx.fillStyle = '#06b6d4';
        ctx.fillText(`${d.type.toUpperCase()}:${d.state}`, d.x - 24, drawY - 16);
    });
    
    ctx.restore();
}

function drawLightmap() {
    if (!lightmapCtx) return;
    const lCtx = lightmapCtx;
    
    lCtx.fillStyle = ambientColor;
    lCtx.fillRect(0, 0, 160, 160);
    
    lCtx.globalCompositeOperation = 'screen';
    
    const lSunX = (sunX / 640) * 160;
    const lSunY = (sunY / 640) * 160;
    const isNight = Math.sin(theta) <= 0;
    
    const sunGlow = lCtx.createRadialGradient(lSunX, lSunY, 5, lSunX, lSunY, 80);
    if (!isNight) {
        sunGlow.addColorStop(0, 'rgba(253, 224, 71, 0.45)');
        sunGlow.addColorStop(1, 'rgba(253, 224, 71, 0)');
    } else {
        sunGlow.addColorStop(0, 'rgba(186, 230, 253, 0.32)');
        sunGlow.addColorStop(1, 'rgba(186, 230, 253, 0)');
    }
    lCtx.fillStyle = sunGlow;
    lCtx.beginPath();
    lCtx.arc(lSunX, lSunY, 80, 0, Math.PI * 2);
    lCtx.fill();
    
    drones.forEach(d => {
        const ldX = (d.x / 640) * 160;
        const ldY = ((d.y + currentScrollY) / 640) * 160;
        
        if (ldY > -20 && ldY < 180) {
            let color = 'rgba(16, 185, 129, 0.8)';
            if (d.type === 'harvester') color = 'rgba(6, 182, 212, 0.9)';
            else if (d.type === 'planter') color = 'rgba(245, 158, 11, 0.9)';
            else if (d.type === 'waterer') color = 'rgba(56, 189, 248, 0.9)';
            
            const droneGlow = lCtx.createRadialGradient(ldX, ldY, 2, ldX, ldY, 22);
            droneGlow.addColorStop(0, color);
            droneGlow.addColorStop(0.3, color.replace('0.9', '0.4').replace('0.8', '0.4'));
            droneGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
            
            lCtx.fillStyle = droneGlow;
            lCtx.beginPath();
            lCtx.arc(ldX, ldY, 22, 0, Math.PI * 2);
            lCtx.fill();
        }
    });
    
    if (mouseX >= 0 && mouseX <= 640 && mouseY >= 0 && mouseY <= 640) {
        const lmX = (mouseX / 640) * 160;
        const lmY = (mouseY / 640) * 160;
        
        const mouseGlow = lCtx.createRadialGradient(lmX, lmY, 2, lmX, lmY, 28);
        mouseGlow.addColorStop(0, 'rgba(255, 255, 255, 0.7)');
        mouseGlow.addColorStop(0.3, 'rgba(255, 255, 255, 0.2)');
        mouseGlow.addColorStop(1, 'rgba(0, 0, 0, 0)');
        
        lCtx.fillStyle = mouseGlow;
        lCtx.beginPath();
        lCtx.arc(lmX, lmY, 28, 0, Math.PI * 2);
        lCtx.fill();
    }
    
    lCtx.globalCompositeOperation = 'source-over';
}

// --- 12. MAIN SYSTEM LOOP ---
let lastTime = performance.now();

function gameLoop(currentTime) {
    requestAnimationFrame(gameLoop);
    
    let dt = (currentTime - lastTime) / 1000;
    if (dt > 0.1) dt = 0.1;
    lastTime = currentTime;
    
    dayNightTime = (dayNightTime + dt) % 60;
    theta = (dayNightTime / 60) * Math.PI * 2;
    
    sunX = canvas.width / 2 + Math.cos(theta) * 320;
    sunY = canvas.height / 2 + Math.sin(theta) * 320;
    
    if (Math.sin(theta) > 0) {
        const factor = Math.sin(theta);
        const r = Math.floor(180 + factor * 75);
        const g = Math.floor(180 + factor * 75);
        const b = Math.floor(190 + factor * 65);
        ambientColor = `rgb(${r}, ${g}, ${b})`;
    } else {
        const factor = Math.abs(Math.sin(theta));
        const r = Math.floor(30 - factor * 15);
        const g = Math.floor(30 - factor * 15);
        const b = Math.floor(65 - factor * 25);
        ambientColor = `rgb(${r}, ${g}, ${b})`;
    }
    
    currentScrollY += (activeFloor * 640 - currentScrollY) * 9 * dt;
    
    drawBackground();
    
    updateSoilAndCrops(dt);
    
    drawHoverPreview();
    
    drawDiagnostics();
    
    particles.forEach(p => p.update(dt));
    particles = particles.filter(p => !p.isDead());
    particles.forEach(p => p.draw(ctx));
    
    drones.forEach(d => {
        d.update(dt);
        d.draw(ctx);
    });
    
    drawLightmap();
    ctx.save();
    ctx.imageSmoothingEnabled = true;
    ctx.globalCompositeOperation = 'multiply';
    ctx.drawImage(lightmapCanvas, 0, 0, 640, 640);
    ctx.restore();
}

// --- 13. STATS & PROGRESSION UPDATES ---

function addXP(amount) {
    xp += amount;
    const xpNeeded = level * 100;
    
    if (xp >= xpNeeded) {
        xp -= xpNeeded;
        level++;
        SoundFX.playUpgrade();
        spawnLevelUpParticles();
        
        let msg = `Level UP! You reached level ${level}!`;
        CROPS.forEach(c => {
            if (level === c.unlockLevel) {
                msg += ` Unlocked ${c.name}!`;
            }
        });
        
        showTicker(msg);
        
        buildCropShop();
        buildUpgrades();
    }
    updateUI();
    saveGameState();
}

function updateUI() {
    document.getElementById('coin-balance').innerText = `$${coins}`;
    document.getElementById('harvest-count').innerText = harvestCount;
    document.getElementById('level-num').innerText = level;
    
    const xpNeeded = level * 100;
    const progressPercent = Math.min(100, (xp / xpNeeded) * 100);
    document.getElementById('xp-progress').style.width = `${progressPercent}%`;
    
    document.getElementById('harvester-count').innerText = harvesterCount;
    document.getElementById('planter-count').innerText = planterCount;
    document.getElementById('waterer-count').innerText = watererCount;
    
    const hCost = getHarvesterCost();
    const pCost = getPlanterCost();
    const wCost = getWatererCost();
    
    document.getElementById('harvester-cost').innerText = `$${hCost}`;
    document.getElementById('planter-cost').innerText = `$${pCost}`;
    document.getElementById('waterer-cost').innerText = `$${wCost}`;
    
    document.getElementById('buy-harvester').disabled = coins < hCost;
    document.getElementById('buy-planter').disabled = coins < pCost;
    document.getElementById('buy-waterer').disabled = coins < wCost;
    
    const isNight = Math.sin(theta) <= 0;
    const timeIcon = document.getElementById('time-icon');
    const timeText = document.getElementById('time-text');
    if (timeIcon && timeText) {
        timeIcon.innerText = isNight ? '🌙' : '☀️';
        timeText.innerText = isNight ? 'Night' : 'Day';
        timeText.style.color = isNight ? '#a5b4fc' : '#fde047';
        timeText.style.textShadow = isNight ? '0 0 8px rgba(165, 180, 252, 0.55)' : '0 0 8px rgba(253, 224, 71, 0.55)';
    }
    
    let hasAnyCrop = false;
    for (let f = 0; f < 3; f++) {
        for (let r = 0; r < gridSize; r++) {
            for (let c = 0; c < gridSize; c++) {
                const cell = getCell(f, r, c);
                if (cell && cell.cropInstance) {
                    hasAnyCrop = true;
                    break;
                }
            }
            if (hasAnyCrop) break;
        }
        if (hasAnyCrop) break;
    }
    
    const overlay = document.getElementById('canvas-overlay-text');
    if (!hasAnyCrop && drones.length === 0) {
        overlay.classList.remove('hidden');
    } else {
        overlay.classList.add('hidden');
    }
}

function getHarvesterCost() { return Math.round(50 * Math.pow(1.6, harvesterCount)); }
function getPlanterCost() { return Math.round(80 * Math.pow(1.6, planterCount)); }
function getWatererCost() { return Math.round(120 * Math.pow(1.6, watererCount)); }

function showTicker(text) {
    document.getElementById('ticker-text').innerText = text;
}

// --- 14. SHOP & TOOL UI BUILDERS ---

function buildCropShop() {
    const shopList = document.getElementById('crop-shop');
    shopList.innerHTML = '';
    
    CROPS.forEach(crop => {
        const isLocked = level < crop.unlockLevel;
        const card = document.createElement('div');
        card.className = `crop-card ${isLocked ? 'locked' : ''} ${selectedSeed === crop ? 'selected' : ''}`;
        
        card.innerHTML = `
            <div class="crop-preview-container">
                <canvas class="crop-preview-canvas" width="${crop.width * 16}" height="${crop.height * 16}"></canvas>
            </div>
            <div class="crop-details">
                <div class="crop-name-row">
                    <span class="crop-name">${crop.name}</span>
                    <span class="crop-size-badge">${crop.width}x${crop.height}</span>
                </div>
                <div class="crop-info-row">
                    <span class="crop-cost">Buy: $${crop.cost}</span>
                    <span class="crop-sell">${crop.isStructure ? 'Refund 50%' : `Sell: $${crop.revenue}`}</span>
                </div>
            </div>
            ${isLocked ? `<div class="lock-overlay">🔒 Lvl ${crop.unlockLevel}</div>` : ''}
        `;
        
        if (!isLocked) {
            card.addEventListener('click', () => {
                SoundFX.playClick();
                selectSeed(crop);
            });
        }
        
        shopList.appendChild(card);
        
        const previewCanvas = card.querySelector('.crop-preview-canvas');
        if (previewCanvas) {
            const pCtx = previewCanvas.getContext('2d');
            pCtx.imageSmoothingEnabled = false;
            pCtx.fillStyle = '#064e3b';
            pCtx.fillRect(0, 0, previewCanvas.width, previewCanvas.height);
            
            const nameLower = crop.name.toLowerCase();
            const cropSprites = sprites[nameLower];
            const sprite = cropSprites ? (cropSprites[3] || cropSprites[2]) : sprites.sprout;
            if (sprite) {
                pCtx.drawImage(sprite, 0, 0, previewCanvas.width, previewCanvas.height);
            }
        }
    });
}

function buildUpgrades() {
    const container = document.getElementById('upgrades-container');
    container.innerHTML = '';
    
    // 1. Grid Size
    {
        const currentLvl = upgrades.gridSize.level;
        const maxLvl = upgrades.gridSize.maxLevel;
        const isMax = currentLvl >= maxLvl;
        const cost = isMax ? 0 : upgrades.gridSize.costs[currentLvl];
        const nextSize = isMax ? 0 : upgrades.gridSize.sizes[currentLvl + 1];
        
        const item = document.createElement('div');
        item.className = 'upgrade-item';
        item.innerHTML = `
            <div class="upgrade-details">
                <span class="upgrade-name">Expand Garden</span>
                <span class="upgrade-desc">${isMax ? 'Maximum Grid Size reached.' : `Expand gardening grid to ${nextSize}x${nextSize}.`}</span>
            </div>
            <button class="buy-upgrade-btn" ${isMax || coins < cost ? 'disabled' : ''}>
                ${isMax ? 'MAX' : `$${cost}`}
            </button>
        `;
        
        if (!isMax && coins >= cost) {
            item.querySelector('button').addEventListener('click', () => {
                SoundFX.playClick();
                buyGridUpgrade(cost, nextSize);
            });
        }
        container.appendChild(item);
    }
    
    // 2. Growth Speed
    {
        const currentLvl = upgrades.growthSpeed.level;
        const maxLvl = upgrades.growthSpeed.maxLevel;
        const isMax = currentLvl >= maxLvl;
        const cost = isMax ? 0 : upgrades.growthSpeed.costs[currentLvl - 1];
        const nextMultiplier = isMax ? 0 : upgrades.growthSpeed.multipliers[currentLvl];
        
        const item = document.createElement('div');
        item.className = 'upgrade-item';
        item.innerHTML = `
            <div class="upgrade-details">
                <span class="upgrade-name">Growth Speed Multiplier</span>
                <span class="upgrade-desc">${isMax ? 'Maximum Upgrade reached.' : `Boost overall crop growth rate to ${nextMultiplier}x.`}</span>
            </div>
            <button class="buy-upgrade-btn" ${isMax || coins < cost ? 'disabled' : ''}>
                ${isMax ? 'MAX' : `$${cost}`}
            </button>
        `;
        
        if (!isMax && coins >= cost) {
            item.querySelector('button').addEventListener('click', () => {
                SoundFX.playClick();
                buyGrowthUpgrade(cost);
            });
        }
        container.appendChild(item);
    }
    
    // 3. Automation Speed
    {
        const currentLvl = upgrades.autoSpeed.level;
        const maxLvl = upgrades.autoSpeed.maxLevel;
        const isMax = currentLvl >= maxLvl;
        const cost = isMax ? 0 : upgrades.autoSpeed.costs[currentLvl - 1];
        const nextMultiplier = isMax ? 0 : upgrades.autoSpeed.multipliers[currentLvl];
        
        const item = document.createElement('div');
        item.className = 'upgrade-item';
        item.innerHTML = `
            <div class="upgrade-details">
                <span class="upgrade-name">Drone Flying Thrust</span>
                <span class="upgrade-desc">${isMax ? 'Maximum Upgrade reached.' : `Increase drone flight speeds to ${nextMultiplier}x.`}</span>
            </div>
            <button class="buy-upgrade-btn" ${isMax || coins < cost ? 'disabled' : ''}>
                ${isMax ? 'MAX' : `$${cost}`}
            </button>
        `;
        
        if (!isMax && coins >= cost) {
            item.querySelector('button').addEventListener('click', () => {
                SoundFX.playClick();
                buyAutoSpeedUpgrade(cost);
            });
        }
        container.appendChild(item);
    }
    
    // 4. Moisture Retention
    {
        const currentLvl = upgrades.waterDuration.level;
        const maxLvl = upgrades.waterDuration.maxLevel;
        const isMax = currentLvl >= maxLvl;
        const cost = isMax ? 0 : upgrades.waterDuration.costs[currentLvl - 1];
        const nextValue = isMax ? 0 : upgrades.waterDuration.values[currentLvl];
        
        const item = document.createElement('div');
        item.className = 'upgrade-item';
        item.innerHTML = `
            <div class="upgrade-details">
                <span class="upgrade-name">Moisture Retention</span>
                <span class="upgrade-desc">${isMax ? 'Maximum Upgrade reached.' : `Slow down water evaporation rates by ${nextValue}x.`}</span>
            </div>
            <button class="buy-upgrade-btn" ${isMax || coins < cost ? 'disabled' : ''}>
                ${isMax ? 'MAX' : `$${cost}`}
            </button>
        `;
        
        if (!isMax && coins >= cost) {
            item.querySelector('button').addEventListener('click', () => {
                SoundFX.playClick();
                buyWaterDurationUpgrade(cost);
            });
        }
        container.appendChild(item);
    }
}

// --- 15. UPGRADE ACTIONS ---

function buyGridUpgrade(cost, nextSize) {
    coins -= cost;
    upgrades.gridSize.level += 1;
    gridSize = nextSize;
    initGrid(true);
    SoundFX.playUpgrade();
    showTicker(`Expanded garden plots grid to ${nextSize}x${nextSize}!`);
    updateUI();
    buildUpgrades();
    saveGameState();
}

function buyGrowthUpgrade(cost) {
    coins -= cost;
    upgrades.growthSpeed.level += 1;
    upgrades.growthSpeed.multiplier = upgrades.growthSpeed.multipliers[upgrades.growthSpeed.level - 1];
    SoundFX.playUpgrade();
    showTicker(`Crops growth speed boosted to ${upgrades.growthSpeed.multiplier}x!`);
    updateUI();
    buildUpgrades();
    saveGameState();
}

function buyAutoSpeedUpgrade(cost) {
    coins -= cost;
    upgrades.autoSpeed.level += 1;
    upgrades.autoSpeed.multiplier = upgrades.autoSpeed.multipliers[upgrades.autoSpeed.level - 1];
    SoundFX.playUpgrade();
    showTicker(`Automation drones speed increased to ${upgrades.autoSpeed.multiplier}x!`);
    updateUI();
    buildUpgrades();
    saveGameState();
}

function buyWaterDurationUpgrade(cost) {
    coins -= cost;
    upgrades.waterDuration.level += 1;
    upgrades.waterDuration.value = upgrades.waterDuration.values[upgrades.waterDuration.level - 1];
    SoundFX.playUpgrade();
    showTicker(`Soil water evaporation speed divided by ${upgrades.waterDuration.value}x!`);
    updateUI();
    buildUpgrades();
    saveGameState();
}

// --- 16. SELECTIONS ---

function selectTool(toolName) {
    selectedSeed = null;
    selectedTool = toolName;
    
    document.querySelectorAll('.crop-card').forEach(card => card.classList.remove('selected'));
    document.querySelectorAll('.tool-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.tool === toolName);
    });
    
    showTicker(`Tool selected: ${toolName.toUpperCase()}`);
    SoundFX.playClick();
}

function selectSeed(crop) {
    selectedSeed = crop;
    selectedTool = null;
    
    document.querySelectorAll('.tool-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.crop-card').forEach((card, index) => {
        card.classList.toggle('selected', CROPS[index] === crop);
    });
    
    showTicker(`Seed selected: ${crop.name} | Cost: $${crop.cost} | Grid footprint: ${crop.width}x${crop.height}`);
}

function deselectAll() {
    selectedSeed = null;
    selectedTool = 'inspect';
    
    document.querySelectorAll('.crop-card').forEach(card => card.classList.remove('selected'));
    document.querySelectorAll('.tool-btn').forEach(btn => {
        btn.classList.toggle('active', btn.dataset.tool === 'inspect');
    });
    
    showTicker(`Seed cleared. Inspection tool active.`);
    SoundFX.playClick();
}

function cycleSeed(direction) {
    const unlockedCrops = CROPS.filter(c => level >= c.unlockLevel);
    if (unlockedCrops.length === 0) return;
    
    let index = -1;
    if (selectedSeed) {
        index = unlockedCrops.findIndex(c => c.name === selectedSeed.name);
    }
    
    let nextIndex = index + direction;
    if (nextIndex < 0) {
        nextIndex = unlockedCrops.length - 1;
    } else if (nextIndex >= unlockedCrops.length) {
        nextIndex = 0;
    }
    
    selectSeed(unlockedCrops[nextIndex]);
}

function switchFloor(floor) {
    if (floor < 0 || floor > 2) return;
    activeFloor = floor;
    
    for (let f = 0; f < 3; f++) {
        const btn = document.getElementById(`btn-floor-${f}`);
        if (btn) {
            btn.classList.toggle('active', f === floor);
        }
    }
    
    SoundFX.playClick();
    showTicker(`Elevator shifted to Floor ${floor}: ${floor === 0 ? 'F0: Ground Bed' : (floor === 1 ? 'F1: Hydroponics' : 'F2: Bio-Dome Canopy')}`);
}

// --- 17. INITIALIZATION & BINDINGS ---

function init() {
    canvas = document.getElementById('gameCanvas');
    ctx = canvas.getContext('2d');
    ctx.imageSmoothingEnabled = false;
    
    lightmapCanvas = document.createElement('canvas');
    lightmapCanvas.width = 160;
    lightmapCanvas.height = 160;
    lightmapCtx = lightmapCanvas.getContext('2d');
    
    shadowSilhouetteCanvas = document.createElement('canvas');
    
    // Generate Procedural texture sheets
    initSprites();
    
    // Grid memory allocation
    initGrid(false);
    
    // Load Game State if exists
    const hasSave = loadGameState();
    
    buildCropShop();
    buildUpgrades();
    updateUI();
    
    // Default tool
    selectTool('inspect');
    
    // Auto-save interval (every 5 seconds)
    setInterval(saveGameState, 5000);
    
    // Elevator selectors
    for (let f = 0; f < 3; f++) {
        const btn = document.getElementById(`btn-floor-${f}`);
        if (btn) {
            btn.addEventListener('click', () => {
                switchFloor(f);
            });
        }
    }
    
    // Window Resize event listeners leak sweep
    window.removeEventListener('resize', resizeCanvas);
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    
    // --- Mouse listeners ---
    canvas.addEventListener('mousedown', (e) => {
        SoundFX.init();
        
        const rect = canvas.getBoundingClientRect();
        const x = (e.clientX - rect.left) * (canvas.width / rect.width);
        const y = (e.clientY - rect.top) * (canvas.height / rect.height);
        
        const hoverCell = getCellFromCoords(x, y);
        if (!hoverCell) return;
        
        const r = hoverCell.row;
        const c = hoverCell.col;
        
        if (selectedSeed) {
            if (coins < selectedSeed.cost) {
                triggerShakeEffect();
                showTicker(`Insufficient funds to plant ${selectedSeed.name}! Seed cost is $${selectedSeed.cost}.`);
                return;
            }
            
            const success = plantCrop(activeFloor, r, c, selectedSeed);
            if (success) {
                coins -= selectedSeed.cost;
                updateUI();
                buildUpgrades();
            } else {
                triggerShakeEffect();
                showTicker(`Invalid placement space! ${selectedSeed.name} requires a clear ${selectedSeed.width}x${selectedSeed.height} spot.`);
            }
        } else {
            if (selectedTool === 'inspect') {
                const cellData = getCell(activeFloor, r, c);
                if (cellData && cellData.cropInstance) {
                    const crop = cellData.cropInstance;
                    
                    let timeLeft = 0;
                    if (!crop.cropType.isStructure) {
                        timeLeft = Math.max(0, crop.cropType.growthTime * (1 - crop.growth / 100));
                    }
                    
                    let totalWater = 0;
                    let count = 0;
                    for (let tr = crop.row; tr < crop.row + crop.cropType.height; tr++) {
                        for (let tc = crop.col; tc < crop.col + crop.cropType.width; tc++) {
                            const innerCell = getCell(activeFloor, tr, tc);
                            if (innerCell) {
                                totalWater += innerCell.waterLevel;
                                count++;
                            }
                        }
                    }
                    const avgWater = count > 0 ? Math.round(totalWater / count) : 0;
                    
                    if (crop.cropType.isStructure) {
                        showTicker(`[Inspect] ${crop.cropType.name} (F${activeFloor}) | Structure is fully active | Soil Moisture: ${avgWater}%`);
                    } else {
                        showTicker(`[Inspect] ${crop.cropType.name} (F${activeFloor}) | Growth: ${Math.round(crop.growth)}% (${crop.growth >= 100 ? 'Mature' : timeLeft.toFixed(1) + 's remaining'}) | Soil Moisture: ${avgWater}%`);
                    }
                } else {
                    const moistureVal = cellData ? Math.round(cellData.waterLevel) : 0;
                    showTicker(`[Inspect] Empty garden plot on F${activeFloor}. Soil Moisture: ${moistureVal}%`);
                }
                SoundFX.playClick();
            } else if (selectedTool === 'water') {
                const cellData = getCell(activeFloor, r, c);
                if (cellData && cellData.waterLevel < 100) {
                    cellData.waterLevel = Math.min(100, cellData.waterLevel + 45);
                    SoundFX.playWater();
                    
                    const yGlobal = y - activeFloor * 640;
                    spawnWaterParticles(x, yGlobal, 6);
                    showTicker(`Watered soil plot!`);
                    saveGameState();
                }
            } else if (selectedTool === 'harvest') {
                const success = harvestCropAt(activeFloor, r, c);
                if (!success) {
                    triggerShakeEffect();
                    showTicker(`This crop isn't mature yet! Wait for it to fully grow.`);
                }
            }
        }
    });
    
    canvas.addEventListener('mousemove', (e) => {
        const rect = canvas.getBoundingClientRect();
        mouseX = (e.clientX - rect.left) * (canvas.width / rect.width);
        mouseY = (e.clientY - rect.top) * (canvas.height / rect.height);
    });
    
    canvas.addEventListener('mouseleave', () => {
        mouseX = -999;
        mouseY = -999;
    });
    
    // --- Keyboard shortcuts ---
    window.addEventListener('keydown', (e) => {
        SoundFX.init();
        
        if (e.key === '1') {
            selectTool('inspect');
        } else if (e.key === '2') {
            selectTool('water');
        } else if (e.key === '3') {
            selectTool('harvest');
        } else if (e.key.toLowerCase() === 'q') {
            cycleSeed(-1);
        } else if (e.key.toLowerCase() === 'e') {
            cycleSeed(1);
        } else if (e.key.toLowerCase() === 'w') {
            if (activeFloor < 2) switchFloor(activeFloor + 1);
        } else if (e.key.toLowerCase() === 's') {
            if (activeFloor > 0) switchFloor(activeFloor - 1);
        } else if (e.key.toLowerCase() === 'n') {
            noclipEnabled = !noclipEnabled;
            document.getElementById('btn-noclip').classList.toggle('active', noclipEnabled);
            SoundFX.playClick();
        } else if (e.key === 'Escape') {
            deselectAll();
        }
    });
    
    // --- Drone Purchases ---
    document.getElementById('buy-harvester').addEventListener('click', () => {
        const cost = getHarvesterCost();
        if (coins >= cost) {
            coins -= cost;
            harvesterCount++;
            drones.push(new Drone(Math.random(), 'harvester', -40, -activeFloor * 640));
            SoundFX.playUpgrade();
            showTicker(`Acquired Harvester Drone!`);
            updateUI();
            buildUpgrades();
            saveGameState();
        }
    });
    
    document.getElementById('buy-planter').addEventListener('click', () => {
        const cost = getPlanterCost();
        if (coins >= cost) {
            coins -= cost;
            planterCount++;
            drones.push(new Drone(Math.random(), 'planter', canvas.width + 40, -activeFloor * 640));
            SoundFX.playUpgrade();
            showTicker(`Acquired Planter Drone!`);
            updateUI();
            buildUpgrades();
            saveGameState();
        }
    });
    
    document.getElementById('buy-waterer').addEventListener('click', () => {
        const cost = getWatererCost();
        if (coins >= cost) {
            coins -= cost;
            watererCount++;
            drones.push(new Drone(Math.random(), 'waterer', canvas.width / 2, canvas.height + 40 - activeFloor * 640));
            SoundFX.playUpgrade();
            showTicker(`Acquired Waterer Drone!`);
            updateUI();
            buildUpgrades();
            saveGameState();
        }
    });
    
    // --- Utility clickers ---
    const muteBtn = document.getElementById('mute-btn');
    muteBtn.addEventListener('click', () => {
        const isMuted = SoundFX.toggleMute();
        muteBtn.innerText = isMuted ? '🔇 Muted' : '🔊 Sound On';
        muteBtn.style.borderColor = isMuted ? 'var(--error)' : 'rgba(255,255,255,0.1)';
        SoundFX.playClick();
    });
    
    // Reset Progress action
    document.getElementById('reset-btn').addEventListener('click', () => {
        if (confirm("Are you sure you want to reset your garden progress? This will delete all coins, crops, upgrades, and drones.")) {
            localStorage.removeItem('nanogarden_save');
            location.reload();
        }
    });
    
    document.getElementById('btn-noclip').addEventListener('click', () => {
        noclipEnabled = !noclipEnabled;
        document.getElementById('btn-noclip').classList.toggle('active', noclipEnabled);
        SoundFX.playClick();
    });
    
    document.querySelectorAll('.tool-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            selectTool(btn.dataset.tool);
        });
    });
    
    // Start main game loop
    requestAnimationFrame(gameLoop);
}

// Auto kickstart
window.addEventListener('DOMContentLoaded', init);
