import virtualDoom from './virtualDoom';

class Component {
    constructor(props = {}, state = {}) {
        this.id = Math.random().toString(36).substr(2, 9);
        virtualDoom.pushComponent(this);

        this.state = state;
        this.props = props;

        this.children = {};
    }

    setState = (newState) => {
        if (this.state === newState) {
            return;
        }

        this.state = newState;
        this.update();
    };

    addChild = (name, component) => {
        this.children[name] = component;
    };

    getChild = (name) => this.children[name];

    child = (name) => (this.children[name] ? this.children[name].render() : '');

    updateChildProps = (name, newProp) => {
        const child = this.children[name];
        child.props = { ...child.props, ...newProp };
    };

    root = () => {
        return document.getElementById(this.id);
    };

    isMounted = () => {
        return !!this.root();
    };

    addEventByClassName = (className, eventName, listener) => {
        const element = this.root().getElementsByClassName(className)[0];
        if (!element) {
            return;
        }
        element.addEventListener(eventName, listener);
    };

    addEvent = (eventName, listener) => {
        const root = this.root();
        if (!root) {
            return;
        }
        root.addEventListener(eventName, listener);
    };

    onMount = () => {};

    updateChildren = () => {
        Object.entries(this.children).forEach(([_, component]) => {
            if (component.isMounted()) {
                component.onMount();
                component.updateChildren();
            }
        });
    };

    update = () => {
        virtualDoom.update(this.id);
    };

    render = () => {};
}

export default Component;
