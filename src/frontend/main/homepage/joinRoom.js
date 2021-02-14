import Component from 'main/component';
import { Input, ErrorsContainer } from 'main/components';

import ReturnToMenu from './returnToMenu';

const ROOM_ERROR = 'Room not found! :(';
const USERNAME_ERROR = 'Username can not be empty! Please add something ^_^';

class JoinRoom extends Component {
    constructor(props) {
        super(props, {
            error: null,
        });
        this.initChildComponents();

        this.roomName = '';
        this.username = '';
    }

    initChildComponents = () => {
        this.addChild(
            'returnToMenu',
            new ReturnToMenu({ onClick: this.props.onBack })
        );
        this.addChild(
            'roomInput',
            new Input({
                onChange: this.onRoomNameChange,
                label: 'Room',
                initialValue: this.roomName,
            })
        );
        this.addChild(
            'usernameInput',
            new Input({
                onChange: this.onUsernameNameChange,
                label: 'Username',
                initialValue: this.username,
                className: 'join-room-username-form',
            })
        );
        this.addChild(
            'errors',
            new ErrorsContainer({
                errors: null,
                onClose: () => this.setError(false),
            })
        );
    };

    onMount = () => {
        this.addEventByClassName('join', 'click', this.onJoin);
    };

    onRoomNameChange = (roomName) => {
        this.roomName = roomName;
    };

    onUsernameNameChange = (username) => {
        this.username = username;
    };

    setError = (error) => {
        this.setState({
            ...this.state,
            error: error,
        });
    };

    onJoin = () => {
        const errors = [];
        if (!this.roomName) {
            errors.push(ROOM_ERROR);
        }
        if (!this.username) {
            errors.push(USERNAME_ERROR);
        }
        if (errors.length > 0) {
            this.setError(errors);
            return;
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

    updateChildrenProps = () => {
        this.updateChildProps('errors', { errors: this.state.error });
        this.updateChildProps('roomInput', { initialValue: this.roomName });
        this.updateChildProps('usernameInput', { initialValue: this.username });
    };

    render = () => {
        this.updateChildrenProps();
        return `
            <div id='${this.id}' class="join-room-container">
                <span class="title">Join room</span>
                ${this.child('roomInput').render()}
                ${this.child('usernameInput').render()}
                <div class="join">Join</div>
                ${this.renderErrors()}
                ${this.child('returnToMenu').render()}
            </div>
        `;
    };
}

export default JoinRoom;
