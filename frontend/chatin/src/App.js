import './App.css';
import { HomePage } from './components/homepage/index';
import { Chat } from './components/chat/index';
const React = require('react');

class App extends React.Component {
  // constructor (props) {
  //   super(props);
  // }

  render () {
    return <HomePage />;
  }
}

export default App;
