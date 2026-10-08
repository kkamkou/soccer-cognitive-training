<script>

import NumberDisplay from './components/NumberDisplay.js';
import ConeDisplay from './components/ConeDisplay.js';
import ZoneDisplay from './components/ZoneDisplay.js';
import SettingsTrigger from './components/SettingsTrigger.js';
import SettingsPanel from './components/SettingsPanel.js';

const TYPE_KEYS = {
    number: { enabled: 'showNumbersEnabled', probability: 'numberProbability' },
    cone: { enabled: 'showConesEnabled', probability: 'coneProbability' },
    zone: { enabled: 'showZonesEnabled', probability: 'zoneProbability' }
};
const TYPE_LIST = Object.keys(TYPE_KEYS);
const NUMBER_POOL = Array.from({ length: 10 }, (_, i) => i);

export default {
    components: {
        NumberDisplay,
        ConeDisplay,
        ZoneDisplay,
        SettingsTrigger,
        SettingsPanel
    },
    data() {
        return {
            currentNumber: 0,
            previousNumber: null,
            currentColor: '#FF0000',
            previousColor: null,
            textColor: '#FFFFFF',
            textShadow: '',
            intervalSeconds: 3,
            intervalId: null,
            settingsOpen: false,
            contentType: null,

            showNumbersEnabled: true,
            showConesEnabled: true,
            showZonesEnabled: true,
            numberProbability: 70,
            coneProbability: 30,
            zoneProbability: 0,

            currentConeColor: '#FFFFFF',
            previousConeColor: null,
            currentZone: null,
            currentZoneColor: null,

            coneColors: ['#FFFFFF', '#0000FF', '#FF0000', '#ffc400ff'],
            rainbowColors: ['#FF0000', '#FF7F00', '#FFFF00', '#00FF00', '#0000FF', '#000000'],
            zoneColors: ['#FF0000', '#0000FF', '#00FF00', '#FF00FF', '#FFA500', '#00FFFF'],
            zones: [
                { name: 'Top left', style: { top: 0, left: 0, width: '33%', height: '50%' } },
                { name: 'Top right', style: { top: 0, right: 0, width: '33%', height: '50%' } },
                { name: 'Bottom left', style: { bottom: 0, left: 0, width: '33%', height: '50%' } },
                { name: 'Bottom right', style: { bottom: 0, right: 0, width: '33%', height: '50%' } },
                { name: 'Inside the top of the goal', style: { top: 0, left: '50%', transform: 'translateX(-50%)', width: '33%', height: '33%' } },
                { name: 'Directly at the goalkeeper', style: { top: '50%', left: '50%', transform: 'translate(-50%, -50%)', width: '33%', height: '33%' } }
            ]
        }
    },
    mounted() {
        this.generateContent();
        this.startInterval();
    },
    methods: {
        generateContent() {
            const enabled = TYPE_LIST
                .filter(type => this[TYPE_KEYS[type].enabled])
                .map(type => ({ type, weight: this[TYPE_KEYS[type].probability] }));

            if (enabled.length === 0) {
                this.contentType = null;
                this.setBackground('#FFFFFF');
                return;
            }

            const total = enabled.reduce((sum, entry) => sum + entry.weight, 0);
            let type = enabled[0].type;
            if (total > 0) {
                const roll = Math.random() * total;
                let cumulative = 0;
                for (const entry of enabled) {
                    cumulative += entry.weight;
                    if (roll < cumulative) {
                        type = entry.type;
                        break;
                    }
                }
            }

            this.contentType = type;
            if (type === 'number') {
                this.generateNumberDisplay();
            } else if (type === 'cone') {
                this.generateCone();
            } else {
                this.generateZone();
            }
        },
        generateNumberDisplay() {
            const number = this.pickUnique(NUMBER_POOL, [this.previousNumber, this.currentNumber]);
            this.previousNumber = this.currentNumber;
            this.currentNumber = number;

            const color = this.pickUnique(this.rainbowColors, [this.previousColor, this.currentColor]);
            this.previousColor = this.currentColor;
            this.currentColor = color;

            this.textColor = this.getContrastColor(color);
            this.setBackground(color);
        },
        generateCone() {
            const color = this.pickUnique(this.coneColors, [this.previousConeColor, this.currentConeColor]);
            this.previousConeColor = this.currentConeColor;
            this.currentConeColor = color;

            this.setBackground(color === '#FFFFFF' ? '#000000' : '#FFFFFF');
        },
        generateZone() {
            this.currentZoneColor = this.pickUnique(this.zoneColors, [this.currentZoneColor]);
            this.currentZone = this.zones[Math.floor(Math.random() * this.zones.length)];

            this.setBackground('#FFFFFF');
        },
        pickUnique(list, exclude) {
            let item;
            do {
                item = list[Math.floor(Math.random() * list.length)];
            } while (exclude.includes(item));
            return item;
        },
        getContrastColor(hex) {
            const r = parseInt(hex.substring(1, 3), 16);
            const g = parseInt(hex.substring(3, 5), 16);
            const b = parseInt(hex.substring(5, 7), 16);
            const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
            return luminance > 0.5 ? '#000000' : '#FFFFFF';
        },
        setBackground(color) {
            document.getElementById('app').style.backgroundColor = color;
        },
        startInterval() {
            if (this.intervalId) {
                clearInterval(this.intervalId);
            }
            this.intervalId = setInterval(() => {
                this.generateContent();
            }, this.intervalSeconds * 1000);
        },
        updateInterval(newValue) {
            if (newValue < 1) {
                this.intervalSeconds = 1;
            } else if (newValue > 60) {
                this.intervalSeconds = 60;
            } else {
                this.intervalSeconds = newValue;
            }
            this.startInterval();
        },
        toggleType(type, value) {
            const { enabled, probability } = TYPE_KEYS[type];
            this[enabled] = value;
            this[probability] = 0;
            this.generateContent();
        },
        updateProbability(type, value) {
            const { enabled, probability } = TYPE_KEYS[type];
            this[probability] = this[enabled] ? this.clampProbability(value) : 0;

            const others = TYPE_LIST.filter(other => other !== type && this[TYPE_KEYS[other].enabled]);
            let excess = this.numberProbability + this.coneProbability + this.zoneProbability - 100;
            for (const other of others) {
                if (excess <= 0) {
                    break;
                }
                const key = TYPE_KEYS[other].probability;
                const reduction = Math.min(this[key], excess);
                this[key] -= reduction;
                excess -= reduction;
            }

            this.generateContent();
        },
        clampProbability(value) {
            if (typeof value !== 'number' || isNaN(value)) {
                return 0;
            }
            return Math.max(0, Math.min(100, value));
        },
        toggleFullscreen() {
            if (!document.fullscreenElement) {
                document.documentElement.requestFullscreen().catch(err => {
                    console.log('Error attempting to enable fullscreen:', err);
                });
            } else if (document.exitFullscreen) {
                document.exitFullscreen();
            }
        }
    }
}
</script>
