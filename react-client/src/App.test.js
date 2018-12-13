import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import Signup from './components/UserSignIn/Signup'
import Signin from './components/UserSignIn/Signin'
// import About from './components/About'
import SignInCreator from './components/Creator/SigninCreator'
//import EventClassNew from './components/EventClassNew'
import SimpleMap from './components/Creator/map'
import { configure } from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';
import { mount, shallow, render } from 'enzyme';
configure({ adapter: new Adapter() });


it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<App />, div);
  ReactDOM.unmountComponentAtNode(div);
});

it('renders Signup component without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<Signup />, div);
  ReactDOM.unmountComponentAtNode(div);
});

it('renders Singin without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<Signin />, div);
  ReactDOM.unmountComponentAtNode(div);
});

// it('renders About without crashing', () => {
//   const div = document.createElement('div');
//   ReactDOM.render(<About />, div);
//   ReactDOM.unmountComponentAtNode(div);
// });

it('renders SignInCreator without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<SignInCreator />, div);
  ReactDOM.unmountComponentAtNode(div);
});

// it('renders EventClassNew without crashing', () => {
//   const div = document.createElement('div');
//   ReactDOM.render(<EventClassNew />, div);
//   ReactDOM.unmountComponentAtNode(div);
// });

it('renders SimpleMap without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<SimpleMap />, div);
  ReactDOM.unmountComponentAtNode(div);
});

describe('Testing the Signup component', () => {
  it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<Signup />, div);
  });
  it('should render correctly in "debug" mode', () => {
	 	// In debug mode, Chainer checks values of variables on runtime and shows more detailed error messages.
	 	// It helps you to debug your programs. However, it requires some additional overhead time.
    const component = shallow(<Signup debug />);
    expect(component).toMatchSnapshot();
  });
  it('should render correctly with no props', () => {
    const component = shallow(<Signup/>);
    expect(component).toMatchSnapshot();
  });
  it('should render banner text correctly with given strings', () => {
    const strings = ['one', 'two'];
    const component = shallow(<Signup list={strings} />);
    expect(component).toMatchSnapshot();
  });
});

describe('Testing the Signin component', () => {
	it('renders without crashing', () => {
    const div = document.createElement('div');
    ReactDOM.render(<Signin />, div);
  });
	it('should render correctly in "debug" mode', () => {
	 	// In debug mode, Chainer checks values of variables on runtime and shows more detailed error messages.
	 	// It helps you to debug your programs. However, it requires some additional overhead time.
    const component = shallow(<Signin debug />);
  
    expect(component).toMatchSnapshot();
  });
  it('should render correctly with no props', () => {
    const component = shallow(<Signin/>);
    expect(component).toMatchSnapshot();
  });
  it('should render banner text correctly with given strings', () => {
    const strings = ['one', 'two'];
    const component = shallow(<Signin list={strings} />);
    expect(component).toMatchSnapshot();
  });
});


