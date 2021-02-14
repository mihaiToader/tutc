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

    child = (name, props = null) => {
        const child = this.children[name];
        if (!child) {
            return '';
        }
        if (props) {
            this.updateChildProps(name, props);
        }
        return this.children[name].render();
    };

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

    addEventsByClassName = (className, eventName, listener) => {
        const elements = this.root().getElementsByClassName(className);
        if (!elements) {
            return;
        }
        Array.from(elements).forEach((element) =>
            element.addEventListener(eventName, listener)
        );
    };

    addClassToElementByID = (elementID, newClassName) => {
        const element = document.getElementById(elementID);
        if (!element) {
            return;
        }
        element.classList.add(newClassName);
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
