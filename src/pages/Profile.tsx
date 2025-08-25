import React from 'react'
import { connect } from 'react-redux'
import type { RootState } from '../store'
import { updatePassword, updateProfile } from '../features/auth/authSlice'

class ProfileInner extends React.Component<any, any>{
  constructor(props:any){
    super(props)
    const u = props.auth.user
    this.state = { name: u?.name || '', surname: u?.surname || '', cell: u?.cell || '', email: u?.email || '', newPassword:'' }
  }
  saveProfile = (e:React.FormEvent)=>{
    e.preventDefault()
    const id = this.props.auth.user.id
    this.props.dispatch(updateProfile({ id, name:this.state.name, surname:this.state.surname, cell:this.state.cell, email:this.state.email }))
  }
  changePassword = (e:React.FormEvent)=>{
    e.preventDefault()
    const id = this.props.auth.user.id
    if (this.state.newPassword.length < 6) return alert('Password too short')
    this.props.dispatch(updatePassword({ id, newPassword: this.state.newPassword }))
    this.setState({ newPassword:'' })
  }
  render(){
    const u = this.props.auth.user
    return (
      <div className="container grid" style={{maxWidth:640}}>
        <h1>Profile</h1>
        <div className="grid cols-2">
          <form className="card grid" onSubmit={this.saveProfile} aria-label="Update profile">
            <label className="field"><span>Name</span><input value={this.state.name} onChange={e=>this.setState({name:e.target.value})} /></label>
            <label className="field"><span>Surname</span><input value={this.state.surname} onChange={e=>this.setState({surname:e.target.value})} /></label>
            <label className="field"><span>Cell</span><input value={this.state.cell} onChange={e=>this.setState({cell:e.target.value})} /></label>
            <label className="field"><span>Email</span><input type="email" value={this.state.email} onChange={e=>this.setState({email:e.target.value})} /></label>
            <button className="btn primary" type="submit">Save</button>
          </form>
          <form className="card grid" onSubmit={this.changePassword} aria-label="Change password">
            <label className="field"><span>New Password</span><input type="password" value={this.state.newPassword} onChange={e=>this.setState({newPassword:e.target.value})} /></label>
            <button className="btn" type="submit">Update Password</button>
          </form>
        </div>
      </div>
    )
  }
}

export default connect((s:RootState)=>({ auth: s.auth }))(ProfileInner)
