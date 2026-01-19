import React, { useState, useEffect } from 'react';
import { CheckCircle, XCircle, Loader } from 'lucide-react';
import { useSearchParams } from "react-router-dom";
import { mailVerification } from '../services/authService';

function Verify() {
  const [status, setStatus] = useState('loading'); 
  const [message, setMessage] = useState('');
  const [params] = useSearchParams();
  const token = params.get("token");

  useEffect(() => {
    const verifyEmail = async () => {
        if(token){
            try{
                const res = await mailVerification(token);
                setStatus('success');
                setMessage('Vaš email je uspešno verifikovan!');
            } catch(err){
                setStatus('error');
                setMessage('Email je već verifikovan!');
            } 
        } else {
            setStatus('error');
            setMessage('Nevalidan url');
         }
    };

    verifyEmail();
  }, [token]);

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
          {status === 'loading' && (
            <div style={styles.statusContainer}>
              <Loader size={64} color="#4A9FD8" style={styles.spinningIcon} />
              <h2 style={styles.title}>Verifikacija u toku...</h2>
              <p style={styles.subtitle}>Molimo sačekajte dok verifikujemo vaš email.</p>
            </div>
          )}

          {status === 'success' && (
            <div style={styles.statusContainer}>
              <CheckCircle size={64} color="#4CAF50" />
              <h2 style={styles.title}>Email Verifikovan!</h2>
              <p style={styles.subtitle}>{message}</p>
              <p style={styles.description}>
                Možete se prijaviti i početi da koristite StudentShareETF platformu.
              </p>
              <button 
                style={styles.button}
                onMouseEnter={(e) => e.target.style.backgroundColor = '#3A8FC8'}
                onMouseLeave={(e) => e.target.style.backgroundColor = '#4A9FD8'}
                onClick={() => {
                    localStorage.setItem("showLoginModal", "true");
                    window.location.href = '/';
                }}
              >
                Prijavi se
              </button>
            </div>
          )}

          {status === 'error' && (
            <div style={styles.statusContainer}>
              <XCircle size={64} color="#F44336" />
              <h2 style={styles.title}>Verifikacija Neuspješna</h2>
              <p style={styles.subtitle}>{message}</p>
              <p style={styles.description}>
                Vaš nalog je već aktiviran. Možete se direktno prijaviti i koristiti platformu. U slučaju da Vam se pri prijavi pojavi porukua da niste verifikovali email kliknite ponovo na link koji Vam je poslat na mail.
              </p>
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
  footer: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    color: 'white',
    textAlign: 'center',
    padding: '20px',
    fontSize: '14px',
  },
  spinningIcon: {
    animation: 'spin 1s linear infinite',
  }
};

const styleSheet = document.createElement("style");
styleSheet.innerText = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;
document.head.appendChild(styleSheet);

export default Verify;