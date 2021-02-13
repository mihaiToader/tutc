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
            component.onMount()
          }
      })
    };

    update = (componentID) => {
        document.getElementById(componentID).parentElement.innerHTML = this.components[componentID].render();
        this.components[componentID].onMount();
        this.components[componentID].updateChildren();
    }
}

const virtualDoom = new VirtualDoom();
export default virtualDoom;
