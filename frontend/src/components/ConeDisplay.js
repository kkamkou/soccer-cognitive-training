export default {
    name: 'ConeDisplay',
    props: {
        color: {
            type: String,
            required: true
        }
    },
    emits: ['toggle-fullscreen'],
    template: '#cone-display-template'
};
