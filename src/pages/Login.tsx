import React from 'react'
import { connect } from 'react-redux'
import { loginUser } from '../features/auth/authSlice'
import type { RootState } from '../store'
import { Navigate, useLocation, Link } from 'react-router-dom'

class LoginInner extends React.Component<any, any>{
  constructor(props:any){
    super(props)
    this.state = { email:'', password:'' }
  }
  handleSubmit = (e:React.FormEvent)=>{
    e.preventDefault()
    this.props.dispatch(loginUser({ email: this.state.email, password: this.state.password }))
  }
  render(){
    const { auth } = this.props
    if (auth.user){
      const from = this.props.location?.state?.from?.pathname || '/'
      return <Navigate to={from} replace />
    }
    return (
      <div className="container grid" style={{maxWidth:480}}>
        <h1>Login</h1>
        <form className="card grid" onSubmit={this.handleSubmit}>
          <label className="field">
            <span>Email</span>
            <input type="email" required value={this.state.email} onChange={e=>this.setState({email:e.target.value})} />
          </label>
          <label className="field">
            <span>Password</span>
            <input type="password" required value={this.state.password} onChange={e=>this.setState({password:e.target.value})} />
          </label>
          <button className="btn primary" disabled={auth.status==='loading'} type="submit">
            {auth.status==='loading' ? 'Signing in...' : 'Login'}
          </button>
          {auth.error && <div role="alert" style={{color:'#fca5a5'}}>{auth.error}</div>}
          <div className="muted">No account? <Link to="/register">Register</Link></div>
        </form>
      </div>
    )
  }
}

export default function Login(props:any){
  const location = useLocation()
  // pass location via props to class component
  // @ts-ignore
  return <ConnectedLogin location={location} />
}

const ConnectedLogin = connect((s:RootState)=>({ auth: s.auth }))(LoginInner)
