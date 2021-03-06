import React from 'react'
import {connect} from 'react-redux'
import {signup} from '../store/user'
import {createCartThunk} from '../store/cart'
import {Link} from 'react-router-dom'

class Signup extends React.Component {
  constructor() {
    super()
    this.state = {
      firstName: '',
      lastName: '',
      email: '',
      password: '',
      error: false
    }
  }

  handleChange = event => {
    this.setState({
      [event.target.name]: event.target.value
    })
  }

  validateEmail = email => {
    var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    if (this.state.email.length && re.test(email)) {
      return true
    } else return false
  }

  handleSubmit = async event => {
    event.preventDefault()
    if (
      this.validateEmail(this.state.email) &&
      this.state.password &&
      this.state.firstName &&
      this.state.lastName
    ) {
      await this.props.signup(
        this.state.email,
        this.state.password,
        this.state.firstName,
        this.state.lastName
      )
      if (this.props.error) {
        this.setState({error: true})
      } else {
        await this.props.createCartThunk(this.state.userId)
      }
    }
  }

  render() {
    return (
      <div className="auth-grid">
        <div className="auth-card">
          <h2>Create Account</h2>
          <div className="google-icon">
            <a href="/auth/google">
              <i className="fab fa-google-plus-g" />
            </a>
          </div>
          <p>or use your email for registration</p>
          {this.state.error && (
            <small className="error"> {this.props.error.response.data} </small>
          )}
          <form onSubmit={this.handleSubmit} name={name}>
            {!this.state.firstName && (
              <small className="validations">First Name is Required</small>
            )}
            <input
              name="firstName"
              type="text"
              placeholder="First Name"
              onChange={this.handleChange}
            />
            {!this.state.lastName && (
              <small className="validations">Last Name is Required</small>
            )}
            <input
              name="lastName"
              type="text"
              placeholder="Last Name"
              onChange={this.handleChange}
            />
            {!this.validateEmail(this.state.email) && (
              <small className="validations">Valid Email is Required</small>
            )}
            <input
              name="email"
              type="text"
              placeholder="Email"
              onChange={this.handleChange}
            />
            {!this.state.password && (
              <small className="validations">Password is Required</small>
            )}
            <input
              name="password"
              type="password"
              placeholder="Password"
              onChange={this.handleChange}
            />
            <div>
              <button className="button" type="submit">
                Sign up
              </button>
            </div>
          </form>
          <small className="auth-question">
            <Link to="/login">Already have an account? Login here.</Link>
          </small>
        </div>
        <div className="auth-card">
          <img
            className="auth-img"
            src="https://www.datocms-assets.com/25216/1600280578-homepage-trio-1.jpg?q=40&auto=format&w=1136"
          />
        </div>
      </div>
    )
  }
}

const mapSignup = state => {
  return {
    userId: state.user.id,
    error: state.user.error
  }
}

const mapDispatch = dispatch => ({
  signup: (email, password, firstName, lastName) =>
    dispatch(signup(email, password, firstName, lastName)),
  createCartThunk: userId => dispatch(createCartThunk(userId))
})

export default connect(mapSignup, mapDispatch)(Signup)
