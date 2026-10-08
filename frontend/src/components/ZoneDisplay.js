export default {
    name: 'ZoneDisplay',
    props: {
        color: {
            type: String,
            required: true
        },
        position: {
            type: Object,
            required: true
        }
    },
    emits: ['toggle-fullscreen'],
    computed: {
        rectangleStyle() {
            return {
                ...this.position,
                backgroundColor: this.color
            };
        }
    },
    template: '#zone-display-template'
};
