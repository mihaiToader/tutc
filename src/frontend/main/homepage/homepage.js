import Component from 'main/component';
import JoinRoom from './joinRoom';
import CreateRoom from './createRoom';

class HomePage extends Component {
    constructor(props) {
        super(props, {
            display: {
                start: true,
                createRoom: false,
                joinRoom: false,
            },
        });
        this.initChildComponents();
    }

    initChildComponents() {
        this.addChild(
            'joinRoom',
            new JoinRoom({
                onBack: this.onStartMenu,
                onStartGame: this.onStartGame,
            })
        );
        this.addChild(
            'createRoom',
            new CreateRoom({
                onBack: this.onStartMenu,
                onStartGame: this.onStartGame,
            })
        );
    }

    onStartGame = (gameData) => {
        this.props.onStartGame(gameData);
    };

    onCreateRoom = () => {
        this.setState({
            ...this.state,
            display: {
                start: false,
                createRoom: true,
                joinRoom: false,
            },
        });
    };

    onJoinRoom = () => {
        this.setState({
            ...this.state,
            display: {
                start: false,
                createRoom: false,
                joinRoom: true,
            },
        });
    };

    onStartMenu = () => {
        this.setState({
            ...this.state,
            display: {
                start: true,
                createRoom: false,
                joinRoom: false,
            },
        });
    };

    onMount = () => {
        this.addEventByClassName('create-room', 'click', this.onCreateRoom);
        this.addEventByClassName('join-room', 'click', this.onJoinRoom);
    };

    renderStartMenu = () => {
        if (!this.state.display.start) {
            return '';
        }
        return `
        <div class='create-room'>Create Room</div>
        <div class='join-room'>Join Room</div>
      `;
    };

    renderJoinRoom = () => {
        if (!this.state.display.joinRoom) {
            return '';
        }

        return this.child('joinRoom');
    };

    renderCreateRoom = () => {
        if (!this.state.display.createRoom) {
            return '';
        }

        return this.child('createRoom');
    };

    render = () => `
        <div id='${this.id}' class='homepage-container'>
            <div class='title'>The Ultimate Trivia Challenge</div>
            ${this.renderStartMenu()}      
            ${this.renderJoinRoom()}      
            ${this.renderCreateRoom()}      
        </div>
      `;
}

export default HomePage;
