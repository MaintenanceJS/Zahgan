import React from "react";

class Modal extends React.Component {
  onClose = e => {
    this.props.onClose && this.props.onClose(e);
  };
  render() {
    if (!this.props.show) {
      return null;
    }
    return (
      <div className="backdropStyle">
        <div className="modalStyle">
          {this.props.children}
          <div>
            <button
              onClick={e => {
                this.onClose(e);
              }}
            >
              {" "}
              Close{" "}
            </button>
          </div>
        </div>
      </div>
    );
  }
}

export default Modal;
