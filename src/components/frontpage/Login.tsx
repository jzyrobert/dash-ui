import * as React from 'react'

import Button from '@material-ui/core/Button'

import { Redirect } from 'react-router-dom'
import { login } from '../../redux/actions/userActions'

import { CircularProgress, Link } from '@material-ui/core'
import IconButton from '@material-ui/core/IconButton'
import InputAdornment from '@material-ui/core/InputAdornment'
import TextField from '@material-ui/core/TextField'
import Visibility from '@material-ui/icons/Visibility'
import VisibilityOff from '@material-ui/icons/VisibilityOff'
import './Login.scss'

import { connect } from 'react-redux'

const Login: React.FunctionComponent<LoginProps> = (props) => {
  const [visible, setVisibility] = React.useState<boolean>(false)
  const [password, setPassword] = React.useState<string>('')
  const [email, setEmail] = React.useState<string>('')
  const [error, setError] = React.useState<boolean>(false)

  const handlePasswordChange: ChangeEventFunc = (e) => {
    setPassword(e.target.value)
  }

  const handleEmailChange: ChangeEventFunc = (e) => {
    setEmail(e.target.value)
  }

  const submit = (): void => {
    props.onLogin(email, password)
  }

  const handleKeyPress: KeyEventFunc = (e) => {
    if (e.keyCode === 13) {
      submit()
    }
  }

  const handleToggleVisibility = () => setVisibility(!visible)

  return props.loggedIn ? (
    <Redirect to='/' />
  ) : (
    <div>
      <div className='centered-panel'>
        <div className='login-panel'>
          <h3 className='large-heading'>Dash</h3>
          <h2 className='slogan'>Centralized Event Management</h2>
          <TextField
            id='email'
            label='Email'
            margin='normal'
            variant='outlined'
            error={props.error}
            type='text'
            required={true}
            onChange={handleEmailChange}
            className='margin-end small-box'
          />
          <TextField
            id='password'
            variant='outlined'
            type={visible ? 'text' : 'password'}
            label='Password'
            error={props.error}
            className='small-box'
            onChange={handlePasswordChange}
            onKeyDown={handleKeyPress}
            InputProps={{
              endAdornment: (
                <InputAdornment position='end'>
                  <IconButton aria-label='Toggle password visibility' onClick={handleToggleVisibility}>
                    {visible ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />
          <div className='margin-bottom'>
            {props.waiting ? (
              <CircularProgress />
            ) : (
              <Button variant='contained' color='primary' className='chang-blue-background' onClick={submit}>
                Login
              </Button>
            )}
          </div>
          <Link href='/register'>Don't have an account?</Link>
        </div>
      </div>
    </div>
  )
}

interface LoginProps {
  waiting: boolean
  loggedIn: boolean
  error: boolean
  onLogin: (email: string, password: string) => void
}

const mapStateToProps = (state) => {
  return {
    waiting: state.user.logginIn,
    loggedIn: state.user.loggedIn,
    error: state.user.error,
  }
}

const mapDispatchToProps = (dispatch) => {
  return {
    onLogin: (email, password) => {
      dispatch(login(email, password))
    },
  }
}

const connectedLogin = connect(
  mapStateToProps,
  mapDispatchToProps,
)(Login)

export { connectedLogin as Login }
