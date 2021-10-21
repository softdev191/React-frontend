import 'react-app-polyfill/ie11';
import 'react-app-polyfill/stable';
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';

import '@material/card/dist/mdc.card.css';
import '@material/button/dist/mdc.button.css';
import '@material/icon-button/dist/mdc.icon-button.css';
import '@material/textfield/dist/mdc.textfield.css';
import '@material/floating-label/dist/mdc.floating-label.css';
import '@material/notched-outline/dist/mdc.notched-outline.css';
import '@material/line-ripple/dist/mdc.line-ripple.css';
import '@material/typography/dist/mdc.typography.css';
import '@material/top-app-bar/dist/mdc.top-app-bar.css';
import '@rmwc/icon/icon.css';
import '@material/drawer/dist/mdc.drawer.css';
import '@material/list/dist/mdc.list.css';
import '@rmwc/data-table/data-table.css';
import '@rmwc/circular-progress/circular-progress.css';
import '@rmwc/circular-progress/styles';
import '@material/snackbar/dist/mdc.snackbar.css';
import '@material/menu/dist/mdc.menu.css';
import '@material/menu-surface/dist/mdc.menu-surface.css';
import '@material/dialog/dist/mdc.dialog.css';
import '@rmwc/data-table/styles';
import '@material/ripple/dist/mdc.ripple.css';
import '@rmwc/select/select.css';
import '@material/select/dist/mdc.select.css';
import '@material/elevation/dist/mdc.elevation.css';
import '@material/checkbox/dist/mdc.checkbox.css';
import '@material/form-field/dist/mdc.form-field.css';
import '@rmwc/checkbox/styles';
import '@material/radio/dist/mdc.radio.css';
import '@rmwc/avatar/styles';
import '@rmwc/linear-progress/styles';

ReactDOM.render(<App />, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
