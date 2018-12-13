import React from "react";
import $ from "jquery";

class Logout extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};

    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleSubmit(event) {
    $.ajax({
      type: "POST",
      url: "/account/signout",
      headers: {
        token: localStorage.getItem("token")
      },
      success: function(res) {
        console.log(res);
        alert(res.message);
      }
    });

    event.preventDefault();
  }

  render() {
    return (
      <div id="zz" className="container-fluid">
        <form onSubmit={this.handleSubmit}>
          <button>Logout</button>
        </form>
      </div>
    );
  }
}
export default Logout;
