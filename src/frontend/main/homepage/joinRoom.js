import Component from 'main/component';
import { Input, ErrorsContainer, Loading } from 'main/components';

import ReturnToMenu from './returnToMenu';
import HttpApi from '../httpApi';

const ERRORS = {
    roomEmpty: 'Room can not be empty!',
    usernameEmpty: 'Username can not be empty! Please add something ^_^',
    roomNotFound: 'Room not found :(',
    usernameUnavailable: 'Username already exists in that room...',
};

class JoinRoom extends Component {
    constructor(props) {
        super(props, {
            error: null,
            loading: false,
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
        this.addChild(
            'loading',
            new Loading({
                loading: false,
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

    setLoading = (loading) => {
        this.setState({
            ...this.state,
            loading,
        });
    };

    onJoin = () => {
        const errors = [];
        if (!this.roomName) {
            errors.push(ERRORS.roomEmpty);
        }
        if (!this.username) {
            errors.push(ERRORS.usernameEmpty);
        }
        if (!!errors.length) {
            this.setError(errors);
            return;
        }

        this.setLoading(true);
        HttpApi.checkIfRoomAvailable(this.roomName, this.username).then(
            (response) => {
                this.setLoading(false);
                const errors = [];
                if (!response.available) {
                    errors.push(ERRORS.roomNotFound);
                } else if (!response.usernameAvailable) {
                    errors.push(ERRORS.usernameUnavailable);
                }
                if (!!errors.length) {
                    this.setError(errors);
                    return;
                }
                this.props.onStartGame({
                    room: this.roomName,
                    username: this.username,
                    admin: false,
                });
            },
            () => this.setLoading(false)
        );
    };

    renderErrors = () =>
        this.state.error
            ? `
        <div class='create-room-errors'>
            ${this.child('errors', { errors: this.state.error })}
        </div>
    `
            : '';

    render = () => {
        return `
            <div id='${this.id}' class="join-room-container">
                <span class="title">Join room</span>
                ${this.child('roomInput', { initialValue: this.roomName })}
                ${this.child('usernameInput', { initialValue: this.username })}
                <div class="join">Join</div>
                ${this.renderErrors()}
                ${this.child('returnToMenu')}
                ${this.child('loading', { loading: this.state.loading })}
            </div>
        `;
    };
}

export default JoinRoom;
