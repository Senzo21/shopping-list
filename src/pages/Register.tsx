import React from 'react'
import { connect } from 'react-redux'
import { registerUser } from '../features/auth/authSlice'
import type { RootState } from '../store'
import { Link, Navigate } from 'react-router-dom'

type RegisterProps = {
  auth: RootState['auth']
  dispatch: any
}

type RegisterState = {
  email: string
  password: string
  name: string
  surname: string
  cell: string
  success: boolean
}

class RegisterInner extends React.Component<RegisterProps, RegisterState> {
  constructor(props: RegisterProps) {
    super(props)
    this.state = {
      email: '',
      password: '',
      name: '',
      surname: '',
      cell: '',
      success: false
    }
  }

  handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const payload = {
      email: this.state.email,
      password: this.state.password,
      name: this.state.name,
      surname: this.state.surname,
      cell: this.state.cell
    }

    try {
      await this.props.dispatch(registerUser(payload)).unwrap()
      this.setState({ success: true })
    } catch {
      this.setState({ success: false })
    }
  }

  render() {
    const { auth } = this.props
    const { success } = this.state

    if (success) return <Navigate to="/login" replace />

    return (
      <div className="container grid" style={{ maxWidth: 520 }}>
        <h1>Register</h1>
        <form className="card grid" onSubmit={this.handleSubmit}>
          <div className="grid">
            <label>Name</label>
            <input
              type="text"
              value={this.state.name}
              onChange={e => this.setState({ name: e.target.value })}
              required
            />

            <label>Surname</label>
            <input
              type="text"
              value={this.state.surname}
              onChange={e => this.setState({ surname: e.target.value })}
              required
            />

            <label>Cell</label>
            <input
              type="text"
              value={this.state.cell}
              onChange={e => this.setState({ cell: e.target.value })}
              required
            />

            <label>Email</label>
            <input
              type="email"
              value={this.state.email}
              onChange={e => this.setState({ email: e.target.value })}
              required
            />

            <label>Password</label>
            <input
              type="password"
              value={this.state.password}
              onChange={e => this.setState({ password: e.target.value })}
              required
              minLength={6}
            />
          </div>

          <button className="btn primary" type="submit" disabled={auth.status === 'loading'}>
            {auth.status === 'loading' ? 'Creating account...' : 'Create Account'}
          </button>
          {auth.error && <div role="alert" style={{ color: '#fca5a5' }}>{auth.error}</div>}
        </form>

        <p>
          Already have an account? <Link to="/login">Login</Link>
        </p>
      </div>
    )
  }
}

const mapStateToProps = (state: RootState) => ({
  auth: state.auth
})

export const Register = connect(mapStateToProps)(RegisterInner)
export default Register
