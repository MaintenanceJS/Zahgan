import React from "react";
import $ from "jquery";
import EventClassNew from "../Home/EventClassNew";
import Eventcreatsets from "./Eventcreatsets";

class Eventcreatshow extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      items: []
    };
  }
  componentDidMount() {
    $("#home").hide();
    $.ajax({
      url: "/create",
      success: data => {
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
                <EventClassNew item={item} />
                <Eventcreatsets item={item} />
              </div>
            );
          })}
        </div>
      </div>
    );
  }
}
export default Eventcreatshow;
