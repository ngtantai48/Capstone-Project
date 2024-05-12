import React, { Component } from 'react';
import { connect } from 'react-redux';
import { push } from "connected-react-router";
import * as actions from "../../store/actions";
import './Login.scss';
import { FormattedMessage } from 'react-intl';

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: '',
      password: '',
      isShowPassword: false
    }
  }

  handleOnChangeUsername = (event) => {
    this.setState({
      username: event.target.value
    })
    // console.log(event.target.value)
  }

  handleOnChangePassword = (event) => {
    this.setState({
      password: event.target.value
    })
    // console.log(event.target.value)
  }

  handleLogin = () => {
    console.log('username: ' + this.state.username, ' || ', 'password: ' + this.state.password)
    console.log('all state', this.state)
  }

  handleShowHidePassword = () => {
    this.setState({
      isShowPassword: !this.state.isShowPassword
    })
  }

  render() {
    //JSX
    return (
      <div className='login-background'>
        <div className='login-container'>
          <div className='login-content row'>
            <div className='col-12 text-login'>Sign In</div>
            <div className='col-12 form-group login-input'>
              <label>Username: </label>
              <input type='text' className='form-control' placeholder='Enter your username' onChange={(event) => this.handleOnChangeUsername(event)}></input>
            </div>
            <div className='col-12 form-group login-input'>
              <label>Password: </label>
              <div className='custom-input-password'>
                <input type={this.state.isShowPassword ? 'text' : 'password'} className='form-control' placeholder='Enter your password' onChange={(event) => this.handleOnChangePassword(event)}></input>
                <span onClick={() => this.handleShowHidePassword()}>
                  <i className={this.state.isShowPassword ? "fa-solid fa-eye-slash" : "fa-solid fa-eye"}></i>
                </span>
              </div>
            </div>
            <div className='col-12 text-center'>
              <button className='btn-login' onClick={() => this.handleLogin()}>Log In</button>
            </div>
            <div className='col-12'>
              <span className='forgot-password'>Forgot your password?</span>
            </div>
            <div className='col-12 text-center mt-4'>
              <span className='text-other-login'>Or login with: </span>
            </div>
            <div className='col-12 social-login'>
              <i className="fa-brands fa-google-plus-g google"></i>
              <i className="fa-brands fa-facebook facebook"></i>
            </div>
          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => {
  return {
    language: state.app.language
  };
};

const mapDispatchToProps = dispatch => {
  return {
    navigate: (path) => dispatch(push(path)),
    adminLoginSuccess: (adminInfo) => dispatch(actions.adminLoginSuccess(adminInfo)),
    adminLoginFail: () => dispatch(actions.adminLoginFail()),
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Login);