import React from "react";
import { CSSTransition } from "react-transition-group";

const ESC = 27;
const ENTER = 13;

const ModalContainer = class extends React.Component {
  static defaultProps = {
    transitionName: "modal",
    duration: 190,
    exitButtons: [ESC],
  };

  constructor(props) {
    super(props);

    this.onKeyDown = (event) => {
      console.log(event.keyCode);
      console.log(props.exitButtons.indexOf(event.keyCode));
      if (this.props.exitButtons.indexOf(event.keyCode) !== -1) {
        props.close();
      }
    };
  }

  componentDidMount() {
    document.addEventListener("keydown", this.onKeyDown);
  }

  componentWillUnmount() {
    document.removeEventListener("keydown", this.onKeyDown);
  }

  render() {
    const content = this.props.currentModal ? (
      <div className="fixed top-0 left-0 bottom-0 right-0">
        <div
          className="absolute top-0 left-0 w-100 h-100 bg-black-50"
          onClick={this.props.close}
        />
        <div className="w-100 h-100 flex items-center justify-center">
          {this.props.currentModal(this.props)}
        </div>
      </div>
    ) : null;

    return content != null ? (
      <CSSTransition
        in={true}
        classNames={this.props.transitionName}
        timeout={this.props.duration}
        unmountOnExit
      >
        {content}
      </CSSTransition>
    ) : null;
  }
};

export { ESC, ENTER };
export default ModalContainer;
