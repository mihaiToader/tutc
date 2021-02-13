import Component from 'main/component';

class Input extends Component {
    constructor(props) {
        super(props);
    }

    onMount = () => {
        this.addEventByClassName('form-field', 'input',
            (event) => this.props.onChange(event.target.value)
        );
    };

    render = () => {
        return `
            <div id='${this.id}' class='form-group'>
                <span>${this.props.label}</span>
                <input class='form-field' value='${this.props.initialValue || ''}'/>
            </div>
        `;
    };
}

export default Input;
