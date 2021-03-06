import Component from 'main/component';
import gameWebSocket from './gameWebSocket';
import Players from './players';
import GameField from './gameField';
import GameTimer from './gameTimer';

class Game extends Component {
    constructor(props) {
        super(props);
        this.initChildComponents();

        gameWebSocket.registerCallback('admin-left', this.props.onBack);
    }

    initChildComponents = () => {
        this.addChild('players', new Players());
        this.addChild('gameField', new GameField(this.props));
        this.addChild('timer', new GameTimer());
    };

    onMount = () => {
        this.addEventByClassName('back-to-menu', 'click', this.onLeave);
    };

    onOpen = () => {
        gameWebSocket.onUserJoined({
            username: this.props.username,
            room: this.props.room,
        });
    };

    onLeave = () => {
        gameWebSocket.onUserLeft();
        this.props.onBack();
    };

    render = () => `
        <div id='${this.id}' class='game-container'>
            <div class="top-content">
                <div class="game-details">
                    <div>Username: ${this.props.username}</div>
                    <div>Room: ${this.props.room}</div>
                </div>
                ${this.child('timer')}
                <div class="back-to-menu">
                    Return to menu
                </div>
            </div>
            ${this.child('gameField', this.props)}
            ${this.child('players')}
        </div>
    `;
}

export default Game;
