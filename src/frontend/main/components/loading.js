import Component from 'main/component';

class Loading extends Component {
    constructor(props) {
        super(props);
    }

    render = () =>
        this.props.loading
            ? `
        <div class="loading-container">
            <div class="loading-spinner"></div>
            <div class="loading-text">Loading</div>
        </div>
    `
            : '';
}

export default Loading;
