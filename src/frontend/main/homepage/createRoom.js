import Component from 'main/component';
import { Input, ErrorsContainer } from 'main/components';

import ReturnToMenu from './returnToMenu';
import HttpApi from '../httpApi';

const USERNAME_ERROR = 'Username can not be empty! Please add something ^_^';

class CreateRoom extends Component {
    constructor(props) {
        super(props, {
            error: false,
        });
        this.initChildComponents();

        this.username = '';
    }

    initChildComponents = () => {
        this.addChild(
            'returnToMenu',
            new ReturnToMenu({ onClick: this.props.onBack })
        );
        this.addChild(
            'nameInput',
            new Input({
                onChange: this.onNameChange,
                label: 'Username',
                initialValue: this.username,
            })
        );
        this.addChild(
            'errors',
            new ErrorsContainer({
                errors: [USERNAME_ERROR],
                onClose: () => this.setError(false),
            })
        );
    };

    onMount = () => {
        this.addEventByClassName('create', 'click', this.onCreate);
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

    onCreate = () => {
        if (!this.username) {
            this.setError(true);
        }
        HttpApi.createRoom(this.username).then(response => {
            if (response.room) {
                this.props.onStartGame({username: this.username, room: response.room})
            }
        })
    };

    renderErrors = () =>
        this.state.error
            ? `
        <div class='create-room-errors'>
            ${this.child('errors')}
        </div>
    `
            : '';

    updateChildrenProps = () => {
        this.updateChildProps('nameInput', { initialValue: this.username });
    };

    render = () => {
        this.updateChildrenProps();
        return `
            <div id='${this.id}' class="create-room-container">
                <span class="title">Create room</span>
                ${this.child('nameInput')}
                <div class="create">Create</div>
                ${this.renderErrors()}
                ${this.child('returnToMenu')}
            </div>
        `;
    };
}

export default CreateRoom;
