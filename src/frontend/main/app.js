import { Homepage } from 'main/homepage';
import Component from './component';

class App extends Component {
    constructor() {
        super();
    }

    render = () => {
        const homePage = new Homepage();
        return `
      <div id='${this.id}' class='app-container'>
        ${homePage.render()}
      </div>
    `;
    };
}

export default App;
