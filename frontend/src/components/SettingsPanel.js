export default {
    name: 'SettingsPanel',
    props: {
        intervalSeconds: {
            type: Number,
            required: true
        },
        showNumbersEnabled: {
            type: Boolean,
            required: true
        },
        showConesEnabled: {
            type: Boolean,
            required: true
        },
        showZonesEnabled: {
            type: Boolean,
            required: true
        },
        numberProbability: {
            type: Number,
            required: true
        },
        coneProbability: {
            type: Number,
            required: true
        },
        zoneProbability: {
            type: Number,
            required: true
        }
    },
    emits: ['close', 'update-interval', 'toggle-numbers', 'toggle-cones', 'toggle-zones', 'update-number-probability', 'update-cone-probability', 'update-zone-probability'],
    template: '#settings-panel-template'
};
