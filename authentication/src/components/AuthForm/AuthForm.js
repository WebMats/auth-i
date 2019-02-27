import React, { Component } from 'react'
import AuthContext from '../../auth-context';

export default class AuthForm extends Component {
    static contextType = AuthContext
    constructor(props) {
        super(props)
        this.emailRef = React.createRef();
        this.passwordRef = React.createRef();
    }
    componentDidMount() {
        const email = localStorage.getItem('email');
        if (email) {
            this.props.history.push('/users', {email})
        }
    }
    submitForm = (path) => {
        const credentials = {
            email: this.emailRef.current.value,
            password: this.passwordRef.current.value
        }
        if (!credentials.email || !credentials.password) return;
        fetch(`http://localhost:4400${path}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(credentials)
        }).then(res => res.json()).then(result => {
            if (result.errorMessage) {
                console.log(result.errorMessage)
                return;
            }
            this.context.login(result)
            this.props.history.push('/users', {email: result.email})
        }).catch(err => {
            console.log(err)
        })
    }
  render() {
    return (
      <div>
        <form>
            <div>
                <label htmlFor="email">Email</label>
                <input placeholder="Email"  ref={this.emailRef} />
            </div>
            <div>
                <label htmlFor="password">Password</label>
                <input placeholder="Password" ref={this.passwordRef} />
            </div>
            <button type="button" onClick={() => this.submitForm('/api/login')}>Login</button>
            <button type="button" onClick={() => this.submitForm('/api/register')}>Sign Up</button>
        </form>
      </div>
    )
  }
}
