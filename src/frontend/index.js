
import './index.scss';
import App from 'main/app'
import virtualDoom from 'main/virtualDoom';

const app = new App();
virtualDoom.render(document.getElementById('root'), app);
