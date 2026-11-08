// Presets and configurations for Digital Crackers

export const FIREWORK_COLORS = {
  red: {
    name: 'Ruby Red',
    label: 'Red',
    primary: '#ff2a55',
    palette: ['#ff1744', '#ff5252', '#ff8a80', '#ff0055', '#ff6b81'],
    glow: 'rgba(255, 42, 85, 0.8)',
    shadow: '#ff2a55'
  },
  blue: {
    name: 'Sapphire Blue',
    label: 'Blue',
    primary: '#00b4d8',
    palette: ['#0077b6', '#0096c7', '#00b4d8', '#48cae4', '#90e0ef', '#caf0f8'],
    glow: 'rgba(0, 180, 216, 0.8)',
    shadow: '#00b4d8'
  },
  pink: {
    name: 'Neon Pink',
    label: 'Pink',
    primary: '#ff4d94',
    palette: ['#f72585', '#ff4d94', '#ff70a6', '#ff85a1', '#ffc2d4'],
    glow: 'rgba(255, 77, 148, 0.8)',
    shadow: '#ff4d94'
  },
  purple: {
    name: 'Mystic Purple',
    label: 'Purple',
    primary: '#b5179e',
    palette: ['#7209b7', '#9d4edd', '#b5179e', '#c77dff', '#e0aaff'],
    glow: 'rgba(181, 23, 158, 0.8)',
    shadow: '#b5179e'
  },
  green: {
    name: 'Emerald Green',
    label: 'Green',
    primary: '#06d6a0',
    palette: ['#06d6a0', '#2ec4b6', '#38b000', '#70e000', '#a7c957'],
    glow: 'rgba(6, 214, 160, 0.8)',
    shadow: '#06d6a0'
  },
  golden: {
    name: 'Golden Glow',
    label: 'Golden',
    primary: '#ffbe0b',
    palette: ['#ffaa00', '#ffbe0b', '#ffd166', '#ffe066', '#fff3b0'],
    glow: 'rgba(255, 190, 11, 0.85)',
    shadow: '#ffbe0b'
  },
  rainbow: {
    name: 'Cosmic Rainbow',
    label: 'Rainbow',
    primary: 'linear-gradient(135deg, #ff0055, #ffaa00, #00ff88, #00bfff, #9d4edd)',
    isRainbow: true,
    palette: [
      '#ff0055', '#ff3366', '#ff8800', '#ffcc00', 
      '#00f076', '#00d2ff', '#3a86ff', '#8338ec', '#ff006e'
    ],
    glow: 'rgba(255, 255, 255, 0.9)',
    shadow: '#ffffff'
  }
};

export const FIREWORK_PATTERNS = [
  { id: 'circle', name: 'Circle Burst', icon: 'Circle', description: 'Classic spherical radial explosion' },
  { id: 'star', name: 'Star Burst', icon: 'Star', description: 'Geometric 5-pointed star formation' },
  { id: 'heart', name: 'Heart Shaped', icon: 'Heart', description: 'Romantic glowing heart contour' },
  { id: 'spiral', name: 'Spiral Burst', icon: 'Disc3', description: 'Hypnotic rotating spiral arms' },
  { id: 'rainbow', name: 'Rainbow Explosion', icon: 'Sun', description: 'Multi-tiered vibrant color spectrum' },
  { id: 'willow', name: 'Golden Willow', icon: 'Sparkles', description: 'Cascading long weeping golden trails' }
];

export const PRESET_MESSAGES = [
  { text: 'Happy Diwali! 🪔', theme: 'golden' },
  { text: 'Happy Birthday! 🎂', theme: 'rainbow' },
  { text: 'Happy New Year! 🎆', theme: 'blue' },
  { text: 'Congratulations! 🎉', theme: 'purple' },
  { text: 'Best Wishes! ✨', theme: 'pink' },
  { text: 'I Love You! ❤️', theme: 'red' }
];

export const MESSAGE_COLORS = [
  { id: 'match', name: 'Match Firework', color: 'match', display: 'linear-gradient(135deg, #ffbe0b, #ff2a55, #00b4d8)' },
  { id: 'gold', name: 'Royal Gold', color: '#ffd700', display: '#ffd700' },
  { id: 'white', name: 'Pure Starlight', color: '#ffffff', display: '#ffffff' },
  { id: 'cyan', name: 'Neon Cyan', color: '#00f7ff', display: '#00f7ff' },
  { id: 'pink', name: 'Vibrant Magenta', color: '#ff2a85', display: '#ff2a85' },
  { id: 'emerald', name: 'Luminous Green', color: '#39ff14', display: '#39ff14' },
  { id: 'amber', name: 'Warm Amber', color: '#ff8800', display: '#ff8800' }
];
