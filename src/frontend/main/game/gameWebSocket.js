class GameWebSocket {
    supportsWebSockets = !!window.WebSocket;

    init = () => {
        this.connection = new WebSocket('ws://127.0.0.1:3000');
        this.connection.onopen = this.onOpen;
        this.connection.onerror = this.onError;
        this.connection.onmessage = this.onMessage;
    };

    onOpen = () => {};

    onError = () => {};

    onMessage = (data) => {
        console.log(data);
    };

    sendMessage = (data) => {
        if (this.connection.readyState === 1) {
            this.connection.send(data);
        }
    };
}

const gameWebSocket = new GameWebSocket();
export default gameWebSocket;
