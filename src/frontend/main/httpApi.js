class HttpApi {
    static post = (path, body) => {
        return fetch(path, {
            method: 'POST',
            body: JSON.stringify(body),
            headers: {
                'Content-Type': 'application/json',
            },
        }).then((res) => res.json());
    };

    static get = (path) => {
        return fetch(path, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        }).then((res) => res.json());
    };

    static createRoom = (username) => {
        return this.post('/createRoom', { username });
    };

    static checkIfRoomAvailable = (roomName, username) => {
        return this.get(`/room/available/${roomName}/${username}`);
    };
}

export default HttpApi;
