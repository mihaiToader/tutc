import { Homepage } from 'main/homepage';
import Component from './component';
import { Game, gameWebSocket } from 'main/game';

class App extends Component {
    constructor() {
        super(null, {
            gameData: null,
        });
        gameWebSocket.init();
        this.initChildComponents();
    }

    initChildComponents() {
        this.addChild(
            'homepage',
            new Homepage({ onStartGame: this.onStartGame })
        );
        this.addChild('game', new Game({ onBack: this.onBackToMenu }));
    }

    onStartGame = (gameData) => {
        console.log(gameData);
        this.setState({
            ...this.state,
            gameData,
        });
    };

    onBackToMenu = () => {
        this.setState({
            ...this.state,
            gameData: null,
        });
    };

    renderContent = () => {
        if (this.state.gameData) {
            this.updateChildProps('game', this.state.gameData);
            return this.child('game');
        }

        return this.child('homepage');
    };

    render = () => {
        return `
          <div id='${this.id}' class='app-container'>
            ${this.renderContent()}
          </div>
        `;
    };
}

export default App;
