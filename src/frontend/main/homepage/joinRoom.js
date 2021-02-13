import Component from 'main/component';
import ReturnToMenu from './returnToMenu';

class JoinRoom extends Component {
    constructor(props) {
        super(props);
        this.initChildComponents();
    }

    initChildComponents = () => {
        this.addChild('returnToMenu', new ReturnToMenu({onClick: this.props.onBack}));
    };

    isMounted = () => {
        return this.child('returnToMenu').isMounted();
    };

    render = () => {
        return `${this.child('returnToMenu').render()}`
    }
}

export default JoinRoom;
