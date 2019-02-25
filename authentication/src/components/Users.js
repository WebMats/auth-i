import React, { Component } from 'react'
import AuthContext from '../auth-context';

export default class Users extends Component {
    state = {
        email: null,
        users: []
    }
    static contextType = AuthContext;
    componentDidMount() {
        let email = localStorage.getItem('email');
        this.setState({ email })
        this.fetchUsers();
    }
    fetchUsers = () => {
        let email = this.state.email || this.context.email || localStorage.getItem('email');
        if (!email && this.props.location.state) {
            email = this.props.location.state.email 
        }
        fetch('http://localhost:4400/api/users', {
            method: 'GET',
            headers: {
                'Authorization': `bearer ${email}`
            }
        }).then(res => res.json()).then(result => {
            console.log(result)
            if (result.errorMessage) {
                console.log(result.errorMessage)
                return;
            }
            this.setState({users: result})
        }).catch(err => {
            console.log(err)
        })
    }
  render() {
    return (
      <div>
        <ul>
            {this.state.users.length > 0 && this.state.users.map(user => <li key={user.id}>{user.email}</li>)}
        </ul>
      </div>
    )
  }
}
