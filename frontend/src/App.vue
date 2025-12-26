<script>

import NumberDisplay from './components/NumberDisplay.js';
import ConeDisplay from './components/ConeDisplay.js';
import SettingsTrigger from './components/SettingsTrigger.js';
import SettingsPanel from './components/SettingsPanel.js';

export default {
    components: {
        NumberDisplay,
        ConeDisplay,
        SettingsTrigger,
        SettingsPanel
    },
    data() {
        return {
            currentNumber: 0,
            currentColor: '#FF0000',
            textColor: '#FFFFFF',
            textShadow: '',
            previousNumber: null,
            previousColor: null,
            intervalSeconds: 3,
            intervalId: null,
            settingsOpen: false,
            showConesEnabled: true,
            showCone: false,
            currentConeColor: '#FFFFFF',
            previousConeColor: null,
            coneColors: ['#FFFFFF', '#0000FF', '#FF0000', '#ffc400ff'],
            rainbowColors: ['#FF0000', '#FF7F00', '#FFFF00', '#00FF00', '#0000FF', '#000000']
        }
    },
    mounted() {
        this.generateContent();
        this.startInterval();
    },
    methods: {
        generateContent() {
            if (this.showConesEnabled && Math.random() < 0.3) {
                this.showCone = true;
                this.generateCone();
                return;
            }
            this.showCone = false;
            this.generateNumberDisplay();
        },
        generateCone() {
            let newColor;
            do {
                const randomIndex = Math.floor(Math.random() * this.coneColors.length);
                newColor = this.coneColors[randomIndex];
            } while (newColor === this.previousConeColor && newColor === this.currentConeColor);

            this.previousConeColor = this.currentConeColor;
            this.currentConeColor = newColor;

            document.getElementById('app').style.backgroundColor =
                (newColor === '#FFFFFF') ? '#000000' : '#FFFFFF';
        },
        generateNumberDisplay() {
            let newNumber;
            do {
                newNumber = Math.floor(Math.random() * 10);
            } while (newNumber === this.previousNumber || newNumber === this.currentNumber);

            this.previousNumber = this.currentNumber;
            this.currentNumber = newNumber;

            let newColor;
            do {
                const randomIndex = Math.floor(Math.random() * this.rainbowColors.length);
                newColor = this.rainbowColors[randomIndex];
            } while (newColor === this.previousColor || newColor === this.currentColor);

            this.previousColor = this.currentColor;
            this.currentColor = newColor;

            this.textColor = this.getContrastColor(newColor);

            document.getElementById('app').style.backgroundColor = this.currentColor;
        },
        getContrastColor(hexColor) {
            const r = parseInt(hexColor.substr(1, 2), 16);
            const g = parseInt(hexColor.substr(3, 2), 16);
            const b = parseInt(hexColor.substr(5, 2), 16);
            const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
            return luminance > 0.5 ? '#000000' : '#FFFFFF';
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
        toggleFullscreen() {
            if (!document.fullscreenElement) {
                document.documentElement.requestFullscreen().catch(err => {
                    console.log('Error attempting to enable fullscreen:', err);
                });
            } else {
                if (document.exitFullscreen) {
                    document.exitFullscreen();
                }
            }
        }
    }
}
</script>
