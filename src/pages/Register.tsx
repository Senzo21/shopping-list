import React from 'react'
import { connect } from 'react-redux'
import { registerUser } from '../features/auth/authSlice'
import type { RootState } from '../store'
import { Link, Navigate } from 'react-router-dom'

class RegisterInner extends React.Component<any, any>{
  constructor(props:any){
    super(props)
    this.state = { email:'', password:'', name:'', surname:'', cell:'' }
  }
  handleSubmit = (e:React.FormEvent)=>{
    e.preventDefault()
    this.props.dispatch(registerUser(this.state))
  }
  render(){
    const { auth } = this.props
    if (auth.user) return <Navigate to="/" replace />
    return (
      <div className="container grid" style={{maxWidth:520}}>
        <h1>Register</h1>
        <form className="card grid" onSubmit={this.handleSubmit}>
          <div className="grid cols-2">
            <label className="field">
              <span>Name</span>
              <input required value={this.state.name} onChange={e=>this.setState({name:e.target.value})} />
            </label>
            <label className="field">
              <span>Surname</span>
              <input required value={this.state.surname} onChange={e=>this.setState({surname:e.target.value})} />
            </label>
          </div>
          <label className="field">
            <span>Cell number</span>
            <input type="tel" required value={this.state.cell} onChange={e=>this.setState({cell:e.target.value})} />
          </label>
          <label className="field">
            <span>Email</span>
            <input type="email" required value={this.state.email} onChange={e=>this.setState({email:e.target.value})} />
          </label>
          <label className="field">
            <span>Password</span>
            <input type="password" required value={this.state.password} onChange={e=>this.setState({password:e.target.value})} />
          </label>
          <button className="btn primary" type="submit">Create Account</button>
          <div className="muted">Have an account? <Link to="/login">Login</Link></div>
        </form>
      </div>
    )
  }
}

export default connect((s:RootState)=>({ auth: s.auth }))(RegisterInner)
