const NumberDisplay = {
    name: 'NumberDisplay',
    props: {
        number: {
            type: Number,
            required: true
        },
        textColor: {
            type: String,
            required: true
        },
        textShadow: {
            type: String,
            required: true
        }
    },
    emits: ['toggle-fullscreen'],
    template: '#number-display-template'
};