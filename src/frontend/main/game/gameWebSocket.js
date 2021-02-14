class GameWebSocket {
    supportsWebSockets = !!window.WebSocket;

    callbacks = {};

    init = () => {
        this.connection = new WebSocket('ws://127.0.0.1:3000');
        this.connection.onopen = this.onOpen;
        this.connection.onerror = this.onError;
        this.connection.onmessage = this.onMessage;
    };

    registerCallback = (eventName, callback) => {
        if (!this.callbacks[eventName]) {
            this.callbacks[eventName] = [callback];
            return;
        }
        this.callbacks[eventName].push(callback);
    };

    onOpen = () => {};

    onError = () => {};

    onMessage = (messageEvent) => {
        const { event, data } = JSON.parse(messageEvent.data);
        if (!this.callbacks[event]) {
            return;
        }

        this.callbacks[event].forEach((callback) => callback(data));
    };

    sendMessage = (data) => {
        if (this.connection.readyState === 1) {
            this.connection.send(JSON.stringify(data));
        }
    };

    onUserJoined = (roomData) => {
        this.sendMessage({
            event: 'user-joined',
            data: roomData,
        });
    };

    onUserLeft = () => {
        this.sendMessage({
            event: 'user-left',
        });
    };
}

const gameWebSocket = new GameWebSocket();
export default gameWebSocket;
