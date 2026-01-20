import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Loader, Eye, EyeOff } from 'lucide-react';
import { forgottenPasswordChange } from '../services/authService';

function PasswordChange() {
  const [status, setStatus] = useState('form');
  const [message, setMessage] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    const currentToken = new URLSearchParams(window.location.search).get("token");
    if (!currentToken) {
      setStatus('error');
      setMessage('Nevalidan link za resetovanje lozinke!');
    } else {
      setStatus('form');
      setPassword('');
      setConfirmPassword('');
      setErrors({});
    }
  }, [window.location.search]);

  const validateForm = () => {
    const newErrors = {};
    if (!password) {
      newErrors.password = 'Lozinka je obavezna';
    } else if (password.length < 8) {
      newErrors.password = 'Lozinka mora imati najmanje 8 karaktera';
    }
    if (!confirmPassword) {
      newErrors.confirmPassword = 'Potvrda lozinke je obavezna';
    }
    if (password && confirmPassword && password !== confirmPassword) {
      newErrors.confirmPassword = 'Lozinke se ne poklapaju';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;
    const currentToken = new URLSearchParams(window.location.search).get('token');
    if (!currentToken) {
      setStatus('error');
      setMessage('Nevalidan URL ili token.');
      return;
    }
    setStatus('loading');
    try {
      await forgottenPasswordChange(currentToken, password);
      setStatus('success');
      setMessage('Lozinka je uspešno promijenjena!');
    } catch (err) {
      setStatus('error');
      setMessage(err?.response?.data?.error || 'Došlo je do greške. Pokušajte ponovo.');
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <div style={styles.logo}>
          <div style={styles.logoIcon}>
            <img 
              src="src/assets/logoo.png" 
              alt="Logo" 
              style={{ width: "100px", height: "80px", objectFit: "contain" }}
            />
          </div>
          <span style={styles.logoText}>STUDENT SHARE ETF</span>
        </div>
      </div>

      <div style={styles.content}>
        <div style={styles.card}>
          {status === 'form' && (
            <div style={styles.statusContainer}>
              <h2 style={styles.title}>Resetuj Lozinku</h2>
              <p style={styles.subtitle}>Unesite novu lozinku dva puta</p>

              <div style={styles.form}>
                <div style={styles.formGroup}>
                  <label style={styles.label}>Nova Lozinka</label>
                  <div style={styles.passwordInputContainer}>
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="Unesite novu lozinku"
                      style={{
                        ...styles.input,
                        borderColor: errors.password ? '#F44336' : '#ddd',
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      style={styles.eyeButton}
                    >
                      {showPassword ? <EyeOff size={20} color="#666" /> : <Eye size={20} color="#666" />}
                    </button>
                  </div>
                  {errors.password && <p style={styles.errorText}>{errors.password}</p>}
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>Potvrdi Lozinku</label>
                  <div style={styles.passwordInputContainer}>
                    <input
                      type={showConfirmPassword ? 'text' : 'password'}
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      placeholder="Ponovite lozinku"
                      style={{
                        ...styles.input,
                        borderColor: errors.confirmPassword ? '#F44336' : '#ddd',
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                      style={styles.eyeButton}
                    >
                      {showConfirmPassword ? <EyeOff size={20} color="#666" /> : <Eye size={20} color="#666" />}
                    </button>
                  </div>
                  {errors.confirmPassword && <p style={styles.errorText}>{errors.confirmPassword}</p>}
                </div>

                <button
                  type="button"
                  onClick={handleSubmit}
                  style={styles.button}
                  onMouseEnter={(e) => e.target.style.backgroundColor = '#3A8FC8'}
                  onMouseLeave={(e) => e.target.style.backgroundColor = '#4A9FD8'}
                >
                  Resetuj Lozinku
                </button>
              </div>
            </div>
          )}

          {status === 'loading' && (
            <div style={styles.statusContainer}>
              <Loader size={64} color="#4A9FD8" style={styles.spinningIcon} />
              <h2 style={styles.title}>Resetovanje u toku...</h2>
              <p style={styles.subtitle}>Molimo sačekajte.</p>
            </div>
          )}

          {status === 'success' && (
            <div style={styles.statusContainer}>
              <CheckCircle size={64} color="#4CAF50" />
              <h2 style={styles.title}>Lozinka promijenjena!</h2>
              <p style={styles.subtitle}>{message}</p>
              <p style={styles.description}>Sada se možete prijaviti sa vašom novom lozinkom.</p>
              <button 
                style={styles.button}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#3A8FC8'}
                onMouseLeave={(e) => e.target.style.backgroundColor = '#4A9FD8'}
                onClick={() => window.location.href = '/'}
              >
                Prijavi se
              </button>
            </div>
          )}

          {status === 'error' && (
            <div style={styles.statusContainer}>
              <XCircle size={64} color="#F44336" />
              <h2 style={styles.title}>Greška!</h2>
              <p style={styles.subtitle}>{message}</p>
              <p style={styles.description}>Pokušajte da zatražite novi link za resetovanje lozinke.</p>
              <button 
                style={styles.button}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#3A8FC8'}
                onMouseLeave={(e) => e.target.style.backgroundColor = '#4A9FD8'}
                onClick={() => window.location.href = '/'}
              >
                Nazad na početnu
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const styles = {
  container: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: "linear-gradient(135deg, #1e3c72 0%, #2a5298 50%, #7e22ce 100%)",
    display: 'flex',
    flexDirection: 'column',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    overflow: 'hidden',
  },
  header: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    padding: '20px 40px',
    borderBottom: '2px solid #e0e0e0',
    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  },
  logo: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  logoIcon: {
    width: "110px",
    height: "80px",
    backgroundColor: "#4fc3f7",
    borderRadius: "8px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    boxShadow: "0 2px 4px rgba(0,0,0,0.2)",
  },
  logoText: {
    fontSize: '20px',
    fontWeight: 'bold',
    color: '#000000ff',
    letterSpacing: '1px',
  },
  content: {
    flex: 1,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    padding: '40px 20px',
    overflowY: 'auto',
  },
  card: {
    backgroundColor: 'white',
    borderRadius: '16px',
    padding: '60px 50px',
    boxShadow: '0 10px 40px rgba(0,0,0,0.2)',
    maxWidth: '500px',
    width: '100%',
    textAlign: 'center',
  },
  statusContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: '20px',
  },
  title: {
    fontSize: '28px',
    fontWeight: 'bold',
    color: '#333',
    margin: 0,
  },
  subtitle: {
    fontSize: '18px',
    color: '#666',
    margin: 0,
  },
  description: {
    fontSize: '16px',
    color: '#888',
    lineHeight: '1.6',
    margin: '10px 0',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
    width: '100%',
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
    textAlign: 'left',
  },
  label: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#333',
  },
  passwordInputContainer: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
  },
  input: {
    width: '100%',
    padding: '12px 40px 12px 16px',
    fontSize: '16px',
    border: '2px solid #ddd',
    borderRadius: '8px',
    boxSizing: 'border-box',
    fontFamily: 'inherit',
    transition: 'border-color 0.3s ease',
  },
  eyeButton: {
    position: 'absolute',
    right: '12px',
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: '4px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorText: {
    fontSize: '14px',
    color: '#F44336',
    margin: 0,
  },
  button: {
    backgroundColor: '#4A9FD8',
    color: 'white',
    border: 'none',
    borderRadius: '25px',
    padding: '14px 40px',
    fontSize: '16px',
    fontWeight: '600',
    cursor: 'pointer',
    marginTop: '20px',
    transition: 'background-color 0.3s ease',
    boxShadow: '0 4px 12px rgba(74, 159, 216, 0.3)',
  },
  spinningIcon: {
    animation: 'spin 1s linear infinite',
  },
};

export default PasswordChange;

const styleSheet = document.createElement("style");
styleSheet.innerText = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;
document.head.appendChild(styleSheet);
