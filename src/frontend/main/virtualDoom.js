class VirtualDoom {
    components = {};

    pushComponent = (component) => {
        this.components[component.id] = component;
    };

    render = (rootElement, startNode) => {
        this.rootElement = rootElement;
        this.startNode = startNode;
        this.rootElement.innerHTML = this.startNode.render();
        this.onMount();
    };

    onMount = () => {
        Object.entries(this.components).forEach(([_, component]) => {
            if (component.isMounted()) {
                component.onMount();
            }
        });
    };

    update = (componentID) => {
        const element = document.getElementById(componentID);
        const newElement = document.createElement('div');
        newElement.innerHTML = this.components[componentID].render();
        element.replaceWith(newElement);

        // This is a big hack. To replace the node in place I create a new div with
        // the new content, replace the initial content with it, and delete the div after :facepalm:
        const initialElement = document.getElementById(componentID);
        initialElement.parentElement.replaceWith(initialElement);

        this.components[componentID].onMount();
        this.components[componentID].updateChildren();
    };
}

const virtualDoom = new VirtualDoom();
export default virtualDoom;
