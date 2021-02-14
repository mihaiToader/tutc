import Component from 'main/component';

class GameField extends Component {
    constructor(props) {
        super(props, {
            started: false,
        });
    }

    onMount = () => {
        this.addEventByClassName('start-game', 'click', this.startGame);
    };

    startGame = () => {
        alert('start game!');
    };

    renderGameContent = () => {
        if (!this.state.started) {
            if (this.props.admin) {
                return `<div class="start-game">Start the game</div>`;
            } else {
                return `<div class="wait-for-admin">Wait for admin to start the game</div>`;
            }
        }
    };

    render = () => `
        <div id='${this.id}' class="game-field-container">
            ${this.renderGameContent()}
        </div>
    `;
}

export default GameField;
