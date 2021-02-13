import Component from 'main/component';
import { Input, ErrorsContainer } from 'main/components';

import ReturnToMenu from './returnToMenu';

const ROOM_ERROR = 'Room not found! :(';

class CreateRoom extends Component {
    constructor(props) {
        super(props, {
            error: false,
        });
        this.initChildComponents();

        this.roomName = '';
    }

    initChildComponents = () => {
        this.addChild(
            'returnToMenu',
            new ReturnToMenu({ onClick: this.props.onBack })
        );
        this.addChild(
            'roomInput',
            new Input({
                onChange: this.onNameChange,
                label: 'Room',
                initialValue: this.roomName,
            })
        );
        this.addChild(
            'errors',
            new ErrorsContainer({
                errors: [ROOM_ERROR],
                onClose: () => this.setError(false),
            })
        );
    };

    onMount = () => {
        this.addEventByClassName('join', 'click', this.onJoin);
    };

    onNameChange = (username) => {
        this.username = username;
    };

    setError = (isError) => {
        this.setState({
            ...this.state,
            error: isError,
        });
    };

    onJoin = () => {
        if (!this.roomName) {
            this.setError(true);
        }
    };

    renderErrors = () =>
        this.state.error
            ? `
        <div class='create-room-errors'>
            ${this.child('errors').render()}
        </div>
    `
            : '';

    render = () => {
        return `
            <div id='${this.id}' class="join-room-container">
                <span class="title">Join room</span>
                ${this.child('roomInput').render()}
                <div class="join">Join</div>
                ${this.renderErrors()}
                ${this.child('returnToMenu').render()}
            </div>
        `;
    };
}

export default CreateRoom;
