
import React from 'react';
import Menu from '../assets/menu.svg';

export class Chat extends React.Component {
  render () {
    return (
      <div className='grid-container'>
        <div className='menubutton-container'>
          <div />
          <img className='menubutton' src={Menu} />

        </div>

        <div className='chatlog'>
          <chat-bubble timestamp='[18:19]' message='Lol' />
          <chat-bubble />
        </div>
        <div className='keyboardinput-container'>
          <input className='keyboardinput' placeholder='Message...' />
        </div>

      </div>
    );
  }

  handleButtonOnClick () {
    console.log('nice');
  }
}
