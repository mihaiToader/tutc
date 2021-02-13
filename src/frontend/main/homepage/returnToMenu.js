import Component from 'main/component';

class ReturnToMenu extends Component {
    constructor(props) {
        super(props);
    }

    onMount = () => {
        this.addEvent('click', this.props.onClick);
    };

    render = () => {
        return `
            <div id='${this.id}' class='return-to-menu'>Return to menu</div>
        `;
    };
}

export default ReturnToMenu;
