const chatEntry = document.querySelector('.keyboardinput');

function sendMessageInput () {
  /* Sends current stored message input */
  console.log(chatEntry.value);

  chatEntry.value = '';
}

chatEntry.addEventListener('keypress',
  (event) => {
    if (event.key === 'Enter') {
      sendMessageInput();
    }
  }
);

class ChatBubble extends HTMLElement {
  constructor () {
    super();
    this.status = 0;
    this.nivel = null;
  }

  connectedCallback () {
    this.setAttribute('class', 'chat-bubble');

    this.TimeStamp = document.createElement('span');
    this.TimeStamp.setAttribute('class', 'timestamp');

    this.TimeStamp.innerText = this.getAttribute('timestamp');

    this.appendChild(this.TimeStamp);

    this.TextSpan = document.createElement('span');
    this.TextSpan.setAttribute('class', 'chat-bubble-text');
    this.TextSpan.innerText = this.getAttribute('message');

    this.appendChild(this.TextSpan);
  }

  attributeChangedCallback (atri, oldatri, newatri) {

  }

  static get observedAttributes () {
    return ['timestamp', 'message'];
  }
}

window.customElements.define('chat-bubble', ChatBubble);
