import Component from 'main/component';
import gameWebSocket from './gameWebSocket';

class GameTimer extends Component {
    interval = null;
    seconds = 0;

    constructor() {
        super();

        gameWebSocket.registerCallback('new-question', () => this.onStart(15));
    }

    setTimerSeconds = (seconds) => {
        this.root().getElementsByClassName('timer')[0].innerHTML = '' + seconds;
    };

    onStart = (seconds) => {
        if (!this.isMounted()) {
            return;
        }
        if (this.interval) {
            clearInterval(this.interval);
        }
        this.seconds = seconds;
        this.setTimerSeconds(this.seconds);
        this.interval = setInterval(() => {
            this.seconds -= 1;
            this.setTimerSeconds(this.seconds);
            if (this.seconds === 0) {
                clearInterval(this.interval);
                this.setTimerSeconds('');
            }
        }, 1000);
    };

    render = () => `
        <div id='${this.id}'>
            <div class="timer"></div>
        </div>
    `;
}

export default GameTimer;
