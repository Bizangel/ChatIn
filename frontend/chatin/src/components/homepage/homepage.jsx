
import React from 'react';
import ChatinLogo from '../assets/ChatIN_Full.svg';

export class HomePage extends React.Component {
  render () {
    return (
      <div className='grid-container'>
        <img src={ChatinLogo} className='logo-container' alt='ChatIn Logo' />
        <div id='title-container'> Chat with people all over the world! </div>
        <div id='chat-button' onClick={this.handleButtonOnClick}>
          <span id='chat-button-text'> Chat!</span>
        </div>

      </div>

    );
  }

  handleButtonOnClick () {
    console.log('nice');
  }
}
