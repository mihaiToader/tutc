import Component from 'main/component';
import gameWebSocket from './gameWebSocket';

class Players extends Component {
    constructor() {
        super(null, {
            players: [],
        });

        gameWebSocket.registerCallback('update-player-list', (data) => {
            this.setState({
                ...this.state,
                players: data.players,
            });
        });
    }

    renderPlayers = () => {
        if (!this.state.players) {
            return '';
        }
        return this.state.players.reduce((acc, player) => {
            acc += `
                <div class="player">
                    <div>${player.username}</div>
                    <div>${player.correctAnswers}</div>
                </div>
            `;
            return acc;
        }, '');
    };

    render = () => `
        <div id='${this.id}' class='players-container'>
            <div class="top-description">
                <div>
                    Player
                </div>
                <div>
                    Correct answers
                </div>
            </div>
            ${this.renderPlayers()}
        </div>
        
    `;
}

export default Players;
