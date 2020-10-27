import React, { Component, useState } from "react";
import ReactDOM from "react-dom";
import { HubConnectionBuilder } from '@microsoft/signalr';

export class Messenger extends Component {
  
  constructor(props) {
    super(props);
    this.state = { Users: [], Messages: [], message: "" };
    this.scrollToBottom = () =>
      this.bottomElem.scrollIntoView({ behavior: "smooth" });

    this.dispatchState = (state) => this.vm.$dispatch(state);

    this.connection = new HubConnectionBuilder()
      .withUrl('https://localhost:5001/messengerhub')
      .withAutomaticReconnect()
      .build();

    if (this.connection) {
      this.connection.start()
        .then(result => {
          console.log('Connected!');

          this.connection.on('ReceiveMessage', (user, message) => {
            const updatedChat = [...latestChat.current];
            var encodedMsg = user + ':' + message
            updatedChat.push(encodedMsg);

            setChat(updatedChat);
          });
        })
        .catch(e => console.log('Connection failed: ', e));
    }
  }



  sendMessage(user, message) {
    const chatMessage = {
      user: user,
      message: message
    }

    console.log("Send message : " + chatMessage );

    if (this.connection.connectionStarted) {
      try {
        this.connection.send('SendMessage', 'UserInput', chatMessage);
      }
      catch (e) {
        console.log(e);
      }
    }
    else {
      alert('No connection to server yet.');
    }
  }

  componentDidMount() {
    // this.correlationId = `${Math.random()}`;
    // this.dispatchState({ AddUser: this.correlationId });
    this.scrollToBottom();
  }

  componentDidUpdate() {
    this.scrollToBottom();
    if (this.state.PrivateMessage) {
      let message = this.state.PrivateMessage;
      message.Text = "(private) " + message.Text;
      message.private = true;
      this.setState({ Messages: this.state.Messages.concat(message) });
      this.setState({ PrivateMessage: null });
    }
  }

  componentWillUnmount() {
    this.dispatchState({ RemoveUser: null });
    this.vm.$destroy();
  }

  getUserName(userId) {
    const user = this.state.Users.find((x) => x.Id === userId);
    return user ? user.Name : null;
  }

  sendMessage(text) {
    var match = /name is ([A-z]+)/i.exec(text);
    console.log("Send message!" );
    this.dispatchState({
      SendMessage: {
        Text: text,
        Date: new Date(),
        UserName: match ? match[1] : "",
      },
    });
    this.setState({ message: "" });
  }

  render() {
    return (
      <div>
        <div className="chatPanel">
          <nav>
            {" "}
            {this.state.Users.map((user) => (
              <p key={user.Id}>
                <b
                  className={
                    user.CorrelationId === this.correlationId ? "myself" : ""
                  }
                >
                  {" "}
                  {user.Name}{" "}
                </b>{" "}
                <span> {user.IpAddress} </span> <span> {user.Browser} </span>{" "}
              </p>
            ))}{" "}
          </nav>{" "}
          <section>
            <div>
              {" "}
              {this.state.Messages.map((msg, idx) => (
                <div key={idx}>
                  <div>
                    <span>
                      {" "}
                      {this.getUserName(msg.UserId) || msg.UserName}{" "}
                    </span>{" "}
                    <span> {new Date(msg.Date).toLocaleString()} </span>{" "}
                  </div>{" "}
                  <div className={msg.private ? "private" : ""}>
                    {" "}
                    {msg.Text}{" "}
                  </div>{" "}
                </div>
              ))}{" "}
              <div
                style={{ float: "left", clear: "both" }}
                ref={(el) => (this.bottomElem = el)}
              />{" "}
            </div>{" "}
            <input
              onChange={(value) => this.setState({ message: value })}
              onUpdate={(value) => this.sendMessage(value)}
            />{" "}
          </section>{" "}
        </div>{" "}
        <footer>
          <div> * Hint: </div>{" "}
          <ul>
            <li> type 'my name is ___' to introduce yourself </li>{" "}
            <li> type '&lt;username&gt;: ___' to send private message </li>{" "}
          </ul>{" "}
        </footer>{" "}
      </div>
    );
  }
}

export function RenderMessenger(elementId) {
  const element = <Messenger></Messenger>;
  var target = document.getElementById(elementId);
  console.log('Element! ' + element);
  console.log('Target! ' + target);
  ReactDOM.render(element, target);
}

