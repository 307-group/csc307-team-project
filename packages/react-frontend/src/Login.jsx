import React, { useState } from 'react';

function Login(props) {
  const [creds, setCreds] = useState({
    username: '',
    password: '',
  });

  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      style={{
        display: 'flex',
        flexDirection: 'column',
        gap: '8px',
        maxWidth: '250px',
        marginBottom: '20px',
      }}
    >
      <h3>{props.buttonLabel || 'Log In'}</h3>

      <input
        type="text"
        name="username"
        placeholder="Username"
        value={creds.username}
        onChange={handleChange}
        style={{ padding: '8px' }}
      />

      <input
        type="password"
        name="password"
        placeholder="Password"
        value={creds.pwd}
        onChange={handleChange}
        style={{ padding: '8px' }}
      />

      <input
        type="button"
        value={props.buttonLabel || 'Log In'}
        onClick={submitForm}
        style={{ padding: '8px', cursor: 'pointer' }}
      />
    </form>
  );

  function handleChange(event) {
    const { name, value } = event.target;
    switch (name) {
      case 'username':
        setCreds({ ...creds, username: value });
        break;
      case 'password':
        setCreds({ ...creds, password: value });
        break;
    }
  }

  function submitForm() {
    props.handleSubmit(creds);
    setCreds({ username: '', password: '' });
  }
}
export default Login;
