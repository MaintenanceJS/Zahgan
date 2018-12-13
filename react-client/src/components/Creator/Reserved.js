import React from "react";
import $ from "jquery";
import Reservedcreat from "./Reservedcreat";

class Reserved extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      items: []
    };
  }
  componentDidMount() {
    $.ajax({
      url: "/create",
      success: data => {
        console.log(data);
        this.setState({
          items: data
        });
      },
      error: err => {
        console.log("err", err);
      }
    });
  }
  render() {
    return (
      <div>
        <div>
          {this.state.items.map(item => {
            return (
              <div>
                <Reservedcreat item={item} />
              </div>
            );
          })}
        </div>
      </div>
    );
  }
}
export default Reserved;
