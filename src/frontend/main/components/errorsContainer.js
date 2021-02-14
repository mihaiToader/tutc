import Component from 'main/component';

class ErrorsContainer extends Component {
    constructor(props) {
        super(props);
    }

    onMount = () => {
        this.addEventByClassName('close', 'click', this.props.onClose);
    };

    renderErrors = () =>
        this.props.errors.reduce((acc, error) => {
            acc += `
           <span>${error}</span> 
        `;
            return acc;
        }, '');

    render = () =>
        !!this.props.errors
            ? `
        <div id='${this.id}' class='errors-container'>
            <div class="close">x</div>
            ${this.renderErrors()}        
        </div>
    `
            : '';
}

export default ErrorsContainer;
