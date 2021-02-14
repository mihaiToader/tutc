import Component from 'main/component';
import { Input, ErrorsContainer, Loading } from 'main/components';

import ReturnToMenu from './returnToMenu';
import HttpApi from '../httpApi';

const USERNAME_ERROR = 'Username can not be empty! Please add something ^_^';

class CreateRoom extends Component {
    constructor(props) {
        super(props, {
            error: false,
            loading: false,
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
        this.addChild(
            'loading',
            new Loading({
                loading: false,
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

    setLoading = (loading) => {
        this.setState({
            ...this.state,
            loading,
        });
    };

    onCreate = () => {
        if (!this.username) {
            this.setError(true);
        }

        this.setLoading(true);
        HttpApi.createRoom(this.username).then(
            (response) => {
                this.setLoading(false);
                if (response.room) {
                    this.props.onStartGame({
                        username: this.username,
                        room: response.room,
                    });
                }
            },
            () => this.setLoading(false)
        );
    };

    renderErrors = () =>
        this.state.error
            ? `
        <div class='create-room-errors'>
            ${this.child('errors')}
        </div>
    `
            : '';

    render = () => {
        return `
            <div id='${this.id}' class="create-room-container">
                <span class="title">Create room</span>
                ${this.child('nameInput', { initialValue: this.username })}
                <div class="create">Create</div>
                ${this.renderErrors()}
                ${this.child('returnToMenu')}
                ${this.child('loading', { loading: this.state.loading })}
            </div>
        `;
    };
}

export default CreateRoom;
