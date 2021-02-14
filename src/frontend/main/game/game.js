import Component from 'main/component';

class Game extends Component {
    constructor(props) {
        super(props);
        this.initChildComponents();
    }

    initChildComponents = () => {};

    onMount = () => {
        this.addEventByClassName('back-to-menu', 'click', this.onLeave);
    };

    onLeave = () => {
        this.props.onBack();
    };

    render = () => `
        <div id='${this.id}' class='game-container'>
            <div class="top-content">
                <div class="game-details">
                    <div>Username: ${this.props.username}</div>
                    <div>Room: ${this.props.room}</div>
                </div>
                <div class="back-to-menu">
                    Return to menu
                </div>
            </div>
        </div>
    `;
}

export default Game;
