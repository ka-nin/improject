import React, { useEffect, useState } from 'react';
import styles from './AdminLogin.module.css';
import { useNavigate } from 'react-router-dom';

const AdminLogin = () => {
  const [timestamp, setTimestamp] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      const options = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
      };
      setTimestamp(now.toLocaleDateString('en-US', options));
    };

    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();

    if (username === 'admin' && password === 'password') {
      alert('Login successful!');
      navigate('/dashboard');
    } else {
      alert('Incorrect username or password.');
    }
  };

  const goBack = () => {
    navigate('/');
  };

  return (
    <div className={styles.bodyWrapper}>
      <div className={styles.header}></div>

      <div className={styles.container}>
        <div className={styles.topBar}>
          <button className={styles.backButton} onClick={goBack}>
            Back to Main
          </button>
          <div className={styles.timestamp}>● {timestamp}</div>
        </div>

        <div className={styles.mainContent}>
          <div className={styles.loginContainer}>
            <div className={styles.logo}>176</div>
            <h1 className={styles.title}>ADMIN LOGIN</h1>
            <p className={styles.subtitle}>Restricted access only</p>

            <form onSubmit={handleLogin}>
              <div className={styles.formGroup}>
                <label className={styles.formLabel} htmlFor="username">
                  Username
                </label>
                <input
                  type="text"
                  id="username"
                  className={styles.formInput}
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                />
              </div>

              <div className={styles.formGroup}>
                <label className={styles.formLabel} htmlFor="password">
                  Password
                </label>
                <input
                  type="password"
                  id="password"
                  className={styles.formInput}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <button type="submit" className={styles.loginButton}>
                Login
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
