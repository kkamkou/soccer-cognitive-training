export default {
    name: 'SettingsPanel',
    props: {
        intervalSeconds: {
            type: Number,
            required: true
        },
        showConesEnabled: {
            type: Boolean,
            required: true
        }
    },
    emits: ['close', 'update-interval', 'toggle-cones'],
    template: '#settings-panel-template'
};
