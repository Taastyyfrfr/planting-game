/* ==========================================================================
   NanoGarden - Core Game System (Vertical Gardening & Diagnostics Expansion)
   ========================================================================== */

// --- 1. GAME DATA & CONFIGURATION ---

// Color palette definitions for procedural pixel art
const PALETTE = {
    '.': 'transparent',
    '#': '#1e293b', // Dark outline
    
    // Grass & Foliage Greens
    'g': '#10b981', // Medium Green (active neon green)
    'G': '#064e3b', // Dark Forest Green
    'l': '#34d399', // Light Sprout Green
    'L': '#a7f3d0', // Pastel Mint Green
    
    // Soil & Seed Browns
    'b': '#78350f', // Rich soil brown
    'B': '#451a03', // Deep soil border
    's': '#b45309', // Moist clay speckles
    'w': '#1c1917', // Wet soil base (nearly black-brown)
    'W': '#0c0a09', // Wet soil border (ultra dark)
    'u': '#0ea5e9', // Water droplet speckle (blue)
    'c': '#b45309', // Dry seed hull
    'C': '#78350f', // Dark seed highlight
    
    // Crop Specific Colors
    'o': '#f97316', // Carrot Orange
    'O': '#ea580c', // Carrot Deep Orange shadow
    
    'r': '#ef4444', // Strawberry Red
    'R': '#b91c1c', // Strawberry Dark Shadow Red
    'y': '#fbbf24', // Yellow petals / Seeds
    'Y': '#d97706', // Gold outline / Dark petal shade
    
    'm': '#15803d', // Watermelon Rind Light Green
    'M': '#166534', // Watermelon Rind Dark Green
    'p': '#fda4af', // Watermelon Inside Pink (not visible on whole melon)
    
    'd': '#78350f', // Plant Stem Brown
    
    'P': '#f97316', // Pumpkin Light Orange
    'k': '#c2410c', // Pumpkin Rib/Shadow Dark Orange
};

// Raw Pixel Art Matrix Strings (16x16 or grid ratios)
const GRASS_PIXELS = [
    "GGGGGGGGGGGGGGGG",
    "GGGGGGGGGGGGGGGG",
    "GGGGGGgGGGGGGGGG",
    "GGGGGGGGGGGGGGGG",
    "GGGGGGGGGGGGGGGG",
    "GGGGGGGGGGGGGgGG",
    "GGgGGGGGGGGGGGGG",
    "GGGGGGGGGGGGGGGG",
    "GGGGGGGGGGGGGGGG",
    "GGGGGGGGGGGGGGGG",
    "GGGGGGgGGGGGGGGG",
    "GGGGGGGGGGGGGGGG",
    "GGGGGGGGGGGGGGGG",
    "GGGGGGGGGGGGGgGG",
    "GGGGGGGGGGGGGGGG",
    "GGGGGGGGGGGGGGGG"
];

const SOIL_DRY_PIXELS = [
    "BBBBBBBBBBBBBBBB",
    "BssssssssssssssB",
    "BsbbbbbbbbbbbbsB",
    "BsbbbbbbbbbbbbsB",
    "BsbbbsbbbbbbbbsB",
    "BsbbbbbbbbbbbbsB",
    "BsbbbbbbbbbbbbsB",
    "BsbbbbbsbbbbbbsB",
    "BsbbbbbbbbbbbbsB",
    "BsbbbbbbbbbbbbsB",
    "BsbbbsbbbbbbbbsB",
    "BsbbbbbbbbbbbbsB",
    "BsbbbbbbbbbbbbsB",
    "BsbbbbbbbbbbbbsB",
    "BssssssssssssssB",
    "BBBBBBBBBBBBBBBB"
];

const SOIL_WET_PIXELS = [
    "WWWWWWWWWWWWWWWW",
    "WuuuuuuuuuuuuuuW",
    "WuwWWWWWWWWWWwuW",
    "WuwWWWWWWWWWWwuW",
    "WuwWWWWuWWWWwuuW",
    "WuwWWWWWWWWWWwuW",
    "WuwWWWWWWWWWWwuW",
    "WuwWWWWWWuWWwuuW",
    "WuwWWWWWWWWWWwuW",
    "WuwWWWWWWWWWWwuW",
    "WuwWWWWuWWWWwuuW",
    "WuwWWWWWWWWWWwuW",
    "WuwWWWWWWWWWWwuW",
    "WuwWWWWWWWWWWwuW",
    "WuuuuuuuuuuuuuuW",
    "WWWWWWWWWWWWWWWW"
];

const SEED_PIXELS = [
    "................",
    "................",
    "................",
    "................",
    "................",
    "................",
    ".......cc.......",
    "......cCCc......",
    ".....cbbbbBc....",
    "....cbbbbbbBc...",
    "....bbbbbbbbb...",
    "....bbbbbbbbb...",
    "....bbbbbbbbb...",
    "................",
    "................",
    "................"
];

const SPROUT_PIXELS = [
    "................",
    "................",
    "................",
    "......l..l......",
    "......gl.lg.....",
    ".......g.g......",
    ".......ggg......",
    "........g.......",
    ".....cbbbbBc....",
    "....cbbbbbbBc...",
    "....bbbbbbbbb...",
    "....bbbbbbbbb...",
    "....bbbbbbbbb...",
    "................",
    "................",
    "................"
];

// Carrot: 1x1 size
const CARROT_GROWING = [
    "................",
    "................",
    "........g.......",
    "......g.g.g.....",
    "......gg.gg.....",
    ".......ggg......",
    "........o.......",
    ".......oOo......",
    ".....cbbbbBc....",
    "....cbbbbbbBc...",
    "....bbbbbbbbb...",
    "....bbbbbbbbb...",
    "....bbbbbbbbb...",
    "................",
    "................",
    "................"
];

const CARROT_MATURE = [
    "........g.......",
    "......g.l.g.....",
    ".....g.g.g.g....",
    "......g.g.g.....",
    ".......ggg......",
    "......oooo......",
    ".....ooOOoo.....",
    ".....ooOOoo.....",
    ".....cOObbBc....",
    "....c.oO.bbBc...",
    "......oO.bbbb...",
    "......oO........",
    "......o.........",
    "......o.........",
    "................",
    "................"
];

// Strawberry: 1x1 size
const STRAWBERRY_GROWING = [
    "................",
    "................",
    "................",
    ".......g........",
    ".....ggggg......",
    "....ggggggg.....",
    ".....ggggg......",
    "......rrr.......",
    ".....cbbbbBc....",
    "....cbbbbbbBc...",
    "....bbbbbbbbb...",
    "....bbbbbbbbb...",
    "....bbbbbbbbb...",
    "................",
    "................",
    "................"
];

const STRAWBERRY_MATURE = [
    "................",
    "......gggg......",
    "....gggggggg....",
    "..gggggggggggg..",
    ".ggggrggrgggrgg.",
    "ggggrrrgrrgrrrgg",
    "gggyrrryrrryrrrg",
    "gggyrrryrrryrrrg",
    ".ggggrggrgggrgg.",
    "..cbbbbbbbbBc...",
    ".cbbbbbbbbbbBc..",
    ".cbbbbbbbbbbBc..",
    "..bbbbbbbbbbb...",
    "................",
    "................",
    "................"
];

// Watermelon: 2x1 size (32x16 pixels)
const WATERMELON_GROWING = [
    "................................",
    "................................",
    "................................",
    "................................",
    "............mmmmmmmm............",
    "..........mmmmmmmmmmmm..........",
    "..........mmmmmmmmmmmm..........",
    "............mmmmmmmm............",
    "..........cbbbbbbbbBc...........",
    ".........cbbbbbbbbbbBc..........",
    ".........bbbbbbbbbbbbb..........",
    ".........bbbbbbbbbbbbb..........",
    "................................",
    "................................",
    "................................",
    "................................"
];

const WATERMELON_MATURE = [
    "................................",
    "................dd..............",
    "...............dggd.............",
    "..........mmmmMllMmmmm..........",
    "........mmmmmMMlllMMmmmmm.......",
    "......mmmMlllMlllMlllMlllMmm....",
    ".....mmMMlllllMlllllMlllllMMm...",
    "....mMMlllllllMlllllllMllllllMm.",
    "....mMMlllllllMlllllllMllllllMm.",
    ".....mmMMlllllMlllllMlllllMMm...",
    "......mmmMlllMlllMlllMlllMmm....",
    "........mmmmmMMlllMMmmmmm.......",
    "        cbbbbbbbbbbbbbbBc       ",
    "       cbbbbbbbbbbbbbbbbBc      ",
    "       bbbbbbbbbbbbbbbbbbb      ",
    "................................"
];

// Sunflower: 1x2 size (16x32 pixels)
const SUNFLOWER_GROWING = [
    "................",
    "................",
    "................",
    "................",
    "................",
    "................",
    "................",
    "................",
    "................",
    "................",
    "................",
    "................",
    "........yy......",
    ".......yyyy.....",
    ".......YyyY.....",
    "........gg......",
    "........gg......",
    "......g.gg.g....",
    ".......ggg......",
    "........gg......",
    "........gg......",
    "........gg......",
    ".....cbbbbBc....",
    "....cbbbbbbBc...",
    "....bbbbbbbbb...",
    "....bbbbbbbbb...",
    "....bbbbbbbbb...",
    "................",
    "................",
    "................",
    "................",
    "................"
];

const SUNFLOWER_MATURE = [
    "......yyyy......",
    "....yyyyyyyy....",
    "...yyyYccYyyy...",
    "..yyyYcCCcYyyy..",
    "..yyYcCCCCCcYy..",
    "..yyYcCCCCCcYy..",
    "..yyyYcCCcYyyy..",
    "...yyyYccYyyy...",
    "....yyyyyyyy....",
    "......yyyy......",
    "........gg......",
    "........gg......",
    "......g.gg.g....",
    ".....gg.gg.gg...",
    "........gg......",
    "........gg......",
    "........gg......",
    "........gg......",
    "......g.gg.g....",
    ".....gg.gg.gg...",
    "........gg......",
    "........gg......",
    "........gg......",
    "........gg......",
    ".....cbbbbBc....",
    "....cbbbbbbBc...",
    "....bbbbbbbbb...",
    "....bbbbbbbbb...",
    "....bbbbbbbbb...",
    "................",
    "................",
    "................"
];

// Pumpkin: 2x2 size (32x32 pixels)
const PUMPKIN_GROWING = [
    "................................",
    "................................",
    "................................",
    "................................",
    "................................",
    "................................",
    "................................",
    "................................",
    "................................",
    "................................",
    "................................",
    "................................",
    "..............dd................",
    ".............dggd...............",
    "...........pppppppp.............",
    "..........pppppppppp............",
    ".........pppppppppppp...........",
    ".........pppppppppppp...........",
    ".........pppppppppppp...........",
    "..........pppppppppp............",
    "...........pppppppp.............",
    "..........cbbbbbbBc.............",
    ".........cbbbbbbbbBc............",
    ".........bbbbbbbbbbb............",
    ".........bbbbbbbbbbb............",
    "................................",
    "................................",
    "................................",
    "................................",
    "................................",
    "................................",
    "................................"
];

const PUMPKIN_MATURE = [
    "................................",
    "................................",
    "................................",
    "................dd..............",
    "...............dggd.............",
    ".............g.d.d.g............",
    "............gg.....gg...........",
    "..........ppppppkkpppppp........",
    "........ppppppkkkkkkpppppp......",
    "      pppppppkkkkkkkkppppppp    ",
    "     ppppppppkkkkkkkkpppppppp   ",
    "    pppppppppkkkkkkkkppppppppp  ",
    "   ppppppkkppkkkkkkkkppkkpppppp ",
    "   pppppkkkppkkkkkkkkppkkkppppp ",
    "  ppppppkkkppkkkkkkkkppkkkpppppp",
    "  ppppppkkkppkkkkkkkkppkkkpppppp",
    "  ppppppkkkppkkkkkkkkppkkkpppppp",
    "   pppppkkkppkkkkkkkkppkkkppppp ",
    "   ppppppkkppkkkkkkkkppkkpppppp ",
    "    pppppppppkkkkkkkkppppppppp  ",
    "     ppppppppkkkkkkkkpppppppp   ",
    "      pppppppkkkkkkkkppppppp    ",
    "        ppppppkkkkkkpppppp      ",
    "          ppppppkkpppppp        ",
    "          cbbbbbbbbbbBc         ",
    "         cbbbbbbbbbbbbBc        ",
    "        cbbbbbbbbbbbbbbBc       ",
    "        bbbbbbbbbbbbbbbbb       ",
    "................................",
    "................................",
    "................................",
    "................................"
];

// Hydraulic Ascent Pipe: 1x1 size (16x16 pixels)
const ASCENT_PIPE_PIXELS = [
    "....##uu##......",
    "....##uu##......",
    "....##uu##......",
    "....##uu##......",
    "....##uu##......",
    "....##uu##......",
    "....##uu##......",
    "....##uu##......",
    "....##uu##......",
    "....##uu##......",
    "....##uu##......",
    "....##uu##......",
    "....##uu##......",
    "....##uu##......",
    "....##uu##......",
    "....##uu##......"
];

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

// --- 5. PROCEDURAL TEXTURE GENERATION ---

function initSprites() {
    // Generate Grass
    sprites.grass = createOffscreenSprite(GRASS_PIXELS, 16, 16);
    // Generate soils
    sprites.soilDry = createOffscreenSprite(SOIL_DRY_PIXELS, 16, 16);
    sprites.soilWet = createOffscreenSprite(SOIL_WET_PIXELS, 16, 16);
    // Generate Shared growth steps
    sprites.seed = createOffscreenSprite(SEED_PIXELS, 16, 16);
    sprites.sprout = createOffscreenSprite(SPROUT_PIXELS, 16, 16);
    
    // Crops Specific
    sprites.carrot[2] = createOffscreenSprite(CARROT_GROWING, 16, 16);
    sprites.carrot[3] = createOffscreenSprite(CARROT_MATURE, 16, 16);
    
    sprites.strawberry[2] = createOffscreenSprite(STRAWBERRY_GROWING, 16, 16);
    sprites.strawberry[3] = createOffscreenSprite(STRAWBERRY_MATURE, 16, 16);
    
    sprites.watermelon[2] = createOffscreenSprite(WATERMELON_GROWING, 32, 16);
    sprites.watermelon[3] = createOffscreenSprite(WATERMELON_MATURE, 32, 16);
    
    sprites.sunflower[2] = createOffscreenSprite(SUNFLOWER_GROWING, 16, 32);
    sprites.sunflower[3] = createOffscreenSprite(SUNFLOWER_MATURE, 16, 32);
    
    sprites.pumpkin[2] = createOffscreenSprite(PUMPKIN_GROWING, 32, 32);
    sprites.pumpkin[3] = createOffscreenSprite(PUMPKIN_MATURE, 32, 32);
    
    sprites['ascent pipe'][2] = createOffscreenSprite(ASCENT_PIPE_PIXELS, 16, 16);
    sprites['ascent pipe'][3] = createOffscreenSprite(ASCENT_PIPE_PIXELS, 16, 16);
    
    // Pre-render floor backgrounds once
    preRenderFloorBackgrounds();
}

function createOffscreenSprite(pixelData, w, h) {
    const c = document.createElement('canvas');
    c.width = w;
    c.height = h;
    const ctx = c.getContext('2d');
    ctx.imageSmoothingEnabled = false;
    renderSpriteData(ctx, pixelData);
    return c;
}

function renderSpriteData(ctx, data) {
    for (let r = 0; r < data.length; r++) {
        const row = data[r];
        for (let c = 0; c < row.length; c++) {
            const char = row[c];
            const color = PALETTE[char];
            if (color && color !== 'transparent') {
                ctx.fillStyle = color;
                ctx.fillRect(c, r, 1, 1);
            }
        }
    }
}

function preRenderFloorBackgrounds() {
    // 1. Floor 0 (Ground bed grass)
    grassPatternCanvas = document.createElement('canvas');
    grassPatternCanvas.width = 640;
    grassPatternCanvas.height = 640;
    const gCtx = grassPatternCanvas.getContext('2d');
    gCtx.imageSmoothingEnabled = false;
    const gSize = 64;
    for (let r = 0; r < 10; r++) {
        for (let c = 0; c < 10; c++) {
            gCtx.drawImage(sprites.grass, c * gSize, r * gSize, gSize, gSize);
        }
    }
    
    // 2. Floor 1 (Hydroponics metallic grid tiles)
    hydroBackgroundCanvas = document.createElement('canvas');
    hydroBackgroundCanvas.width = 640;
    hydroBackgroundCanvas.height = 640;
    const hCtx = hydroBackgroundCanvas.getContext('2d');
    hCtx.imageSmoothingEnabled = false;
    hCtx.fillStyle = '#0f172a'; // Deep slate metal base
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
    cCtx.fillStyle = '#38bdf8'; // Pale blue dots for dome nodes
    for (let x = 0; x <= 640; x += 128) {
        cCtx.beginPath();
        cCtx.arc(x, x, 2, 0, Math.PI * 2);
        cCtx.arc(640 - x, x, 2, 0, Math.PI * 2);
        cCtx.fill();
    }
    cCtx.fillStyle = '#fbbf24'; // Glowing stars
    for (let i = 0; i < 35; i++) {
        const sx = Math.random() * 640;
        const sy = Math.random() * 640;
        const size = Math.random() > 0.75 ? 2.2 : 1;
        cCtx.fillRect(sx, sy, size, size);
    }
}

// --- 6. GRID MANAGEMENT & PHYSICS ---

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
    
    if (preserveExisting && grid) {
        const oldFloors = grid.length;
        const oldSize = grid[0].length;
        for (let f = 0; f < Math.min(3, oldFloors); f++) {
            for (let r = 0; r < oldSize; r++) {
                for (let c = 0; c < oldSize; c++) {
                    if (r < gridSize && c < gridSize && r < oldSize && c < oldSize) {
                        newGrid[f][r][c] = grid[f][r][c];
                    }
                }
            }
        }
    }
    grid = newGrid;
}

function resizeCanvas() {
    canvas.width = 640;
    canvas.height = 640;
    
    const gridPixelSize = 544;
    gridOffsetX = (640 - gridPixelSize) / 2;
    gridOffsetY = (640 - gridPixelSize) / 2;
    cellSize = gridPixelSize / gridSize;
    
    // Safety check for drones out of bounds
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
    // Bounds verify
    if (row < 0 || row + cropType.height > gridSize || col < 0 || col + cropType.width > gridSize) {
        return false;
    }
    
    // Fit verify
    for (let r = row; r < row + cropType.height; r++) {
        for (let c = col; c < col + cropType.width; c++) {
            if (grid[floor][r][c].cropInstance || (grid[floor][r][c].reservedBy && grid[floor][r][c].reservedBy !== 'planter')) {
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
        growth: cropType.isStructure ? 100 : 0, // Structures are fully built immediately
        isHarvestReserved: false
    };
    
    // Populate cell pointers
    for (let r = row; r < row + cropType.height; r++) {
        for (let c = col; c < col + cropType.width; c++) {
            grid[floor][r][c].cropInstance = cropInstance;
        }
    }
    
    SoundFX.playPlant();
    
    const px = gridOffsetX + (col + cropType.width / 2) * cellSize;
    const py = gridOffsetY + (row + cropType.height / 2) * cellSize - floor * 640;
    spawnPlantParticles(px, py);
    
    return true;
}

function harvestCropAt(floor, row, col) {
    const cell = grid[floor] && grid[floor][row] ? grid[floor][row][col] : null;
    if (!cell || !cell.cropInstance) return false;
    
    const crop = cell.cropInstance;
    
    // Hydraulic Ascent Pipe (and future structures) removal refund
    if (crop.cropType.isStructure) {
        coins += Math.round(crop.cropType.cost / 2);
        SoundFX.playHarvest();
        
        const px = gridOffsetX + (crop.col + crop.cropType.width / 2) * cellSize;
        const py = gridOffsetY + (crop.row + crop.cropType.height / 2) * cellSize - crop.floor * 640;
        
        spawnHarvestParticles(px, py);
        spawnTextParticle(px, py, `Refunded`, 'var(--accent)');
        
        for (let r = crop.row; r < crop.row + crop.cropType.height; r++) {
            for (let c = crop.col; c < crop.col + crop.cropType.width; c++) {
                grid[floor][r][c].cropInstance = null;
                grid[floor][r][c].reservedBy = null;
            }
        }
        updateUI();
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
    
    // Reset occupied cells
    for (let r = crop.row; r < crop.row + crop.cropType.height; r++) {
        for (let c = crop.col; c < crop.col + crop.cropType.width; c++) {
            grid[floor][r][c].cropInstance = null;
            grid[floor][r][c].reservedBy = null;
        }
    }
    
    updateUI();
    return true;
}

function findEmptySpotFor(floor, width, height) {
    for (let r = 0; r <= gridSize - height; r++) {
        for (let c = 0; c <= gridSize - width; c++) {
            let isFit = true;
            for (let tr = r; tr < r + height; tr++) {
                for (let tc = c; tc < c + width; tc++) {
                    if (grid[floor][tr][tc].cropInstance || grid[floor][tr][tc].reservedBy) {
                        isFit = false;
                        break;
                    }
                }
                if (!isFit) break;
            }
            if (isFit) {
                return { row: r, col: c };
            }
        }
    }
    return null;
}

function triggerShakeEffect() {
    const wrapper = document.querySelector('.canvas-wrapper');
    wrapper.classList.remove('shake');
    void wrapper.offsetWidth; // Force reflow
    wrapper.classList.add('shake');
}

// --- 7. PARTICLE PHYSICS SYSTEM ---

function spawnWaterParticles(x, y, count = 8) {
    for (let i = 0; i < count; i++) {
        particles.push({
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
                
                // Out-of-bounds entity recycle check
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

function spawnHarvestParticles(x, y, count = 15) {
    for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 50 + Math.random() * 80;
        particles.push({
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
                this.vx *= 0.95; // drag
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
        particles.push({
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
    particles.push({
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
    for (let i = 0; i < 40; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 100 + Math.random() * 120;
        particles.push({
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

// --- 8. AUTOMATION DRONES AGENT CLASS ---
class Drone {
    constructor(id, type, x, y) {
        this.id = id;
        this.type = type; // 'harvester', 'planter', 'waterer'
        this.x = x;
        this.y = y; // Drone Y coordinates are tracked in global vertical space
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
            
            // Hover home orbiting centers slide up or down dynamically depending on active floor
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
                
                // Arrived
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
                                grid[tc.floor][r][c].reservedBy = null;
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
                
                // Thrust sparks trailing behind
                if (Math.random() < 0.22) {
                    particles.push({
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
                const cell = grid[this.targetCell.floor][this.targetCell.row][this.targetCell.col];
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
        
        // Robust Bounds Clamping snap back
        this.x = Math.max(-100, Math.min(canvas.width + 100, this.x));
        this.y = Math.max(-1480, Math.min(800, this.y));
    }
    
    findJob() {
        if (this.type === 'harvester') {
            // Scan Z-axis floors starting from top to bottom
            for (let f = 2; f >= 0; f--) {
                for (let r = 0; r < gridSize; r++) {
                    for (let c = 0; c < gridSize; c++) {
                        const cell = grid[f][r][c];
                        if (cell.cropInstance && !cell.cropInstance.cropType.isStructure && cell.cropInstance.growth >= 100 && !cell.cropInstance.isHarvestReserved) {
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
            if (!selectedSeed || selectedSeed.isStructure) return; // Prevent bots from auto-plumbing hydraulic lines
            const cropType = selectedSeed;
            if (coins < cropType.cost) return;
            
            for (let f = 0; f < 3; f++) {
                const spot = findEmptySpotFor(f, cropType.width, cropType.height);
                if (spot) {
                    for (let r = spot.row; r < spot.row + cropType.height; r++) {
                        for (let c = spot.col; c < spot.col + cropType.width; c++) {
                            grid[f][r][c].reservedBy = 'planter';
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
                        const cell = grid[f][r][c];
                        // Ascent Pipes and standard dry soils
                        if (cell.waterLevel < 25 && !cell.waterReserved) {
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
        const dy = this.y + floatOffset + currentScrollY; // Map to camera scroll
        
        // Cull drawing if fully offscreen
        if (dy < -50 || dy > canvas.height + 50) {
            ctx.restore();
            return;
        }
        
        ctx.strokeStyle = '#64748b';
        ctx.lineWidth = 1.8;
        
        // Rotors
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
        
        // Drone core shell
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

// --- 9. RENDER LOOP FUNCTIONS ---

function drawBackground() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

function updateSoilAndCrops(dt) {
    const growthUpgradeMultiplier = upgrades.growthSpeed.multiplier;
    const waterEvaporationMultiplier = upgrades.waterDuration.value;
    const evaporationRate = 4 / waterEvaporationMultiplier;
    
    // 1. Water pumping logic for Hydraulic Ascent Pipes (Floor N -> Floor N+1)
    for (let f = 0; f < 2; f++) {
        for (let r = 0; r < gridSize; r++) {
            for (let c = 0; c < gridSize; c++) {
                const cell = grid[f][r][c];
                if (cell.cropInstance && cell.cropInstance.cropType.name === 'Ascent Pipe') {
                    if (cell.waterLevel > 0) {
                        const flow = Math.min(cell.waterLevel, 15 * dt); // pumps at 15%/sec
                        cell.waterLevel -= flow;
                        grid[f + 1][r][c].waterLevel = Math.min(100, grid[f + 1][r][c].waterLevel + flow);
                        
                        // Spawn upward bubble flow particles
                        if (Math.random() < 0.22) {
                            const px = gridOffsetX + c * cellSize + cellSize / 2;
                            const pyStart = gridOffsetY + r * cellSize + cellSize / 2 - f * 640;
                            particles.push({
                                x: px + (Math.random() - 0.5) * 8,
                                y: pyStart,
                                targetY: pyStart - 640,
                                vx: (Math.random() - 0.5) * 6,
                                vy: -380, // upward velocity
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
    
    // 2. Loop over Z-axis floors for updates & rendering
    for (let f = 0; f < 3; f++) {
        const floorYOffset = currentScrollY - f * 640;
        const isFloorVisible = (floorYOffset > -640 && floorYOffset < 640);
        
        // Preemptive rendering / offset based on scroll velocity (Frustum Culling)
        if (isFloorVisible) {
            let bgCanvas = grassPatternCanvas;
            if (f === 1) bgCanvas = hydroBackgroundCanvas;
            else if (f === 2) bgCanvas = canopyBackgroundCanvas;
            
            if (bgCanvas) {
                ctx.drawImage(bgCanvas, 0, floorYOffset);
            }
            
            // Raised wooden garden bed border frame
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
            
            // Soil cutout base
            ctx.fillStyle = '#1c1917';
            ctx.fillRect(gridOffsetX, gridOffsetY + floorYOffset, gridSize * cellSize, gridSize * cellSize);
            ctx.restore();
        }
        
        // Soil cell updates
        for (let r = 0; r < gridSize; r++) {
            for (let c = 0; c < gridSize; c++) {
                const cell = grid[f][r][c];
                if (cell.waterLevel > 0) {
                    cell.waterLevel = Math.max(0, cell.waterLevel - evaporationRate * dt);
                }
                
                // Draw soil tiles only if visible
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
        
        // Crop rendering & growth simulation
        const drawnCrops = new Set();
        for (let r = 0; r < gridSize; r++) {
            for (let c = 0; c < gridSize; c++) {
                const cell = grid[f][r][c];
                if (cell.cropInstance && !drawnCrops.has(cell.cropInstance.id)) {
                    const crop = cell.cropInstance;
                    drawnCrops.add(crop.id);
                    
                    // Bounding average soil water moisture
                    let totalWater = 0;
                    let cellCount = 0;
                    for (let tr = crop.row; tr < crop.row + crop.cropType.height; tr++) {
                        for (let tc = crop.col; tc < crop.col + crop.cropType.width; tc++) {
                            totalWater += grid[f][tr][tc].waterLevel;
                            cellCount++;
                        }
                    }
                    const avgWater = totalWater / cellCount;
                    
                    // Simulate growth cycle if not static structure
                    if (!crop.cropType.isStructure && crop.growth < 100) {
                        const waterBonus = 1 + (avgWater / 100) * 1.5;
                        const baseGrowthRate = 100 / crop.cropType.growthTime;
                        crop.growth = Math.min(100, crop.growth + baseGrowthRate * growthUpgradeMultiplier * waterBonus * dt);
                    }
                    
                    // Draw crop shapes only if floor is visible
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
                        
                        let sprite = null;
                        if (stage === 0) sprite = sprites.seed;
                        else if (stage === 1) sprite = sprites.sprout;
                        else {
                            const nameLower = crop.cropType.name.toLowerCase();
                            sprite = sprites[nameLower] ? sprites[nameLower][stage] : null;
                        }
                        
                        if (sprite) {
                            ctx.drawImage(sprite, px, py, pw, ph);
                        }
                        
                        if (!crop.cropType.isStructure && crop.growth < 100) {
                            drawGrowthBar(px, py, pw, ph, crop.growth);
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
                    if (grid[activeFloor][tr][tc].cropInstance || grid[activeFloor][tr][tc].reservedBy) {
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
        const cellData = grid[activeFloor][r][c];
        
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
    
    // 1. Render Magenta Wireframes around all placed Crops & root intersections
    for (let f = 0; f < 3; f++) {
        const floorYOffset = currentScrollY - f * 640;
        if (floorYOffset > -640 && floorYOffset < 640) {
            const drawnCrops = new Set();
            for (let r = 0; r < gridSize; r++) {
                for (let c = 0; c < gridSize; c++) {
                    const cell = grid[f][r][c];
                    if (cell.cropInstance && !drawnCrops.has(cell.cropInstance.id)) {
                        const crop = cell.cropInstance;
                        drawnCrops.add(crop.id);
                        
                        const px = gridOffsetX + crop.col * cellSize;
                        const py = gridOffsetY + crop.row * cellSize + floorYOffset;
                        const pw = crop.cropType.width * cellSize;
                        const ph = crop.cropType.height * cellSize;
                        
                        // Bounding collision meshes
                        ctx.strokeStyle = '#ec4899';
                        ctx.lineWidth = 1.5;
                        ctx.strokeRect(px + 1, py + 1, pw - 2, ph - 2);
                        
                        // Root depth intersection wireframe
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
    
    // 2. Drone flight paths & action circle radii
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

// --- 10. MAIN SYSTEM LOOP ---
let lastTime = performance.now();

function gameLoop(currentTime) {
    requestAnimationFrame(gameLoop);
    
    let dt = (currentTime - lastTime) / 1000;
    if (dt > 0.1) dt = 0.1;
    lastTime = currentTime;
    
    // Animate elevator viewport scrolling offsets
    currentScrollY += (activeFloor * 640 - currentScrollY) * 9 * dt;
    
    // Clear canvas
    drawBackground();
    
    // Update grid soil values & crops growth states (includes water elevator routing)
    updateSoilAndCrops(dt);
    
    // Draw selection highlights under the pointer
    drawHoverPreview();
    
    // Render diagnostics if active
    drawDiagnostics();
    
    // Update & render active particles (drawn with viewport scroll offset)
    particles.forEach(p => p.update(dt));
    particles = particles.filter(p => !p.isDead());
    particles.forEach(p => p.draw(ctx));
    
    // Update & render active drones
    drones.forEach(d => {
        d.update(dt);
        d.draw(ctx);
    });
}

// --- 11. STATS & PROGRESSION UPDATES ---

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
    
    let hasAnyCrop = false;
    for (let f = 0; f < 3; f++) {
        for (let r = 0; r < gridSize; r++) {
            for (let c = 0; c < gridSize; c++) {
                if (grid[f][r][c].cropInstance) {
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

// --- 12. SHOP & TOOL UI BUILDERS ---

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
                pCtx.drawImage(sprite, 0, 0);
            }
        }
    });
}

function buildUpgrades() {
    const container = document.getElementById('upgrades-container');
    container.innerHTML = '';
    
    // 1. Grid Size Upgrade
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
    
    // 2. Growth Speed Upgrade
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
    
    // 3. Automation Speed Upgrade
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
    
    // 4. Moisture Retention Upgrade
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

// --- 13. UPGRADE PURCHASE EVENT HANDLERS ---

function buyGridUpgrade(cost, nextSize) {
    coins -= cost;
    upgrades.gridSize.level += 1;
    gridSize = nextSize;
    initGrid(true); // copies old crops across floors
    SoundFX.playUpgrade();
    showTicker(`Expanded garden plots grid to ${nextSize}x${nextSize}!`);
    updateUI();
    buildUpgrades();
}

function buyGrowthUpgrade(cost) {
    coins -= cost;
    upgrades.growthSpeed.level += 1;
    upgrades.growthSpeed.multiplier = upgrades.growthSpeed.multipliers[upgrades.growthSpeed.level - 1];
    SoundFX.playUpgrade();
    showTicker(`Crops growth speed boosted to ${upgrades.growthSpeed.multiplier}x!`);
    updateUI();
    buildUpgrades();
}

function buyAutoSpeedUpgrade(cost) {
    coins -= cost;
    upgrades.autoSpeed.level += 1;
    upgrades.autoSpeed.multiplier = upgrades.autoSpeed.multipliers[upgrades.autoSpeed.level - 1];
    SoundFX.playUpgrade();
    showTicker(`Automation drones speed increased to ${upgrades.autoSpeed.multiplier}x!`);
    updateUI();
    buildUpgrades();
}

function buyWaterDurationUpgrade(cost) {
    coins -= cost;
    upgrades.waterDuration.level += 1;
    upgrades.waterDuration.value = upgrades.waterDuration.values[upgrades.waterDuration.level - 1];
    SoundFX.playUpgrade();
    showTicker(`Soil water evaporation speed divided by ${upgrades.waterDuration.value}x!`);
    updateUI();
    buildUpgrades();
}

// --- 14. SELECTION CONTROL FUNCTIONS ---

function selectTool(toolName) {
    selectedSeed = null;
    selectedTool = toolName;
    
    document.querySelectorAll('.crop-card').forEach(card => card.classList.remove('selected'));
    
    document.querySelectorAll('.tool-btn').forEach(btn => {
        if (btn.dataset.tool === toolName) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });
    
    showTicker(`Tool selected: ${toolName.toUpperCase()}`);
    SoundFX.playClick();
}

function selectSeed(crop) {
    selectedSeed = crop;
    selectedTool = null;
    
    document.querySelectorAll('.tool-btn').forEach(btn => btn.classList.remove('active'));
    
    document.querySelectorAll('.crop-card').forEach((card, index) => {
        if (CROPS[index] === crop) {
            card.classList.add('selected');
        } else {
            card.classList.remove('selected');
        }
    });
    
    showTicker(`Seed selected: ${crop.name} | Cost: $${crop.cost} | Grid footprint: ${crop.width}x${crop.height}`);
}

function deselectAll() {
    selectedSeed = null;
    selectedTool = 'inspect';
    
    document.querySelectorAll('.crop-card').forEach(card => card.classList.remove('selected'));
    document.querySelectorAll('.tool-btn').forEach(btn => {
        if (btn.dataset.tool === 'inspect') {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
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

// --- 15. INITIALIZATION & LISTENERS ---

function init() {
    canvas = document.getElementById('gameCanvas');
    ctx = canvas.getContext('2d');
    ctx.imageSmoothingEnabled = false;
    
    // Render procedural sprite sheets & backgrounds
    initSprites();
    
    // Create grid layouts
    initGrid(false);
    
    // Build lists & elements
    buildCropShop();
    buildUpgrades();
    updateUI();
    
    // Default tool state
    selectTool('inspect');
    
    // Elevator buttons click registration
    for (let f = 0; f < 3; f++) {
        const btn = document.getElementById(`btn-floor-${f}`);
        if (btn) {
            btn.addEventListener('click', () => {
                switchFloor(f);
            });
        }
    }
    
    // Canvas dimensions setup
    window.addEventListener('resize', resizeCanvas);
    resizeCanvas();
    
    // --- Mouse listeners ---
    canvas.addEventListener('mousedown', (e) => {
        SoundFX.init(); // Autoplay unlock
        
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
                const cellData = grid[activeFloor][r][c];
                if (cellData.cropInstance) {
                    const crop = cellData.cropInstance;
                    
                    let timeLeft = 0;
                    if (!crop.cropType.isStructure) {
                        timeLeft = Math.max(0, crop.cropType.growthTime * (1 - crop.growth / 100));
                    }
                    
                    let totalWater = 0;
                    let count = 0;
                    for (let tr = crop.row; tr < crop.row + crop.cropType.height; tr++) {
                        for (let tc = crop.col; tc < crop.col + crop.cropType.width; tc++) {
                            totalWater += grid[activeFloor][tr][tc].waterLevel;
                            count++;
                        }
                    }
                    const avgWater = Math.round(totalWater / count);
                    
                    if (crop.cropType.isStructure) {
                        showTicker(`[Inspect] ${crop.cropType.name} (F${activeFloor}) | Structure is fully active | Soil Moisture: ${avgWater}%`);
                    } else {
                        showTicker(`[Inspect] ${crop.cropType.name} (F${activeFloor}) | Growth: ${Math.round(crop.growth)}% (${crop.growth >= 100 ? 'Mature' : timeLeft.toFixed(1) + 's remaining'}) | Soil Moisture: ${avgWater}%`);
                    }
                } else {
                    showTicker(`[Inspect] Empty garden plot on F${activeFloor}. Soil Moisture: ${Math.round(grid[activeFloor][r][c].waterLevel)}%`);
                }
                SoundFX.playClick();
            } else if (selectedTool === 'water') {
                const cellData = grid[activeFloor][r][c];
                if (cellData.waterLevel < 100) {
                    cellData.waterLevel = Math.min(100, cellData.waterLevel + 45);
                    SoundFX.playWater();
                    
                    // Map local canvas coordinate to global Z-axis stack
                    const yGlobal = y - activeFloor * 640;
                    spawnWaterParticles(x, yGlobal, 6);
                    showTicker(`Watered soil plot!`);
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
    
    // Run loop
    requestAnimationFrame(gameLoop);
}

// Auto kickstart
window.addEventListener('DOMContentLoaded', init);
