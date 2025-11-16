import React, { useState } from 'react';
import { X } from 'lucide-react';
import { checkUsername, registration } from "../services/authService";

function RegistrationModal({ isOpen, onClose}) {
  const [usernameError, setUsernameError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const [formData, setFormData] = useState({
    name: '',
    surname: '',
    studyProgram: '',
    major: '',
    email: '',
    username: '',
    password: '',
    confirmPassword: ''
  });

  const usernameCheck = async () => {
    try {
        const data = await checkUsername(formData.username);
        if (!data.available) {
            setUsernameError("Korisničko ime je zauzeto");
        } else {
            setUsernameError("");
        }
    } catch (err) {
        console.error(err);
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async () => {
    if (formData.password !== formData.confirmPassword) {
        setPasswordError("Lozinke se ne poklapaju");
        return; 
    } else {
        setPasswordError(""); 
    }

    try {
        const data = await registration(
            formData.name,
            formData.surname,
            formData.email,
            formData.studyProgram,
            formData.major,
            formData.username,
            formData.password
        );
        alert(data.message);
        onClose(); 
    } catch (err) {
        console.error(err);
        alert(err); 
    }
  };

  if (!isOpen) return null;

  return (

    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>X
        </button>

        <div className="avatar-container">
          <div className="avatar-circle">
            <svg width="80" height="80" viewBox="0 0 80 80" fill="none">
              <circle cx="40" cy="32" r="12" fill="white"/>
              <path d="M20 60 C20 48, 28 44, 40 44 C52 44, 60 48, 60 60" fill="white"/>
            </svg>
          </div>
        </div>

        <div className="form-wrapper">
          <div className="form-columns">
            <div className="form-column">
              <div className="form-group">
                <label>Ime:</label>
                <input
                  type="text"
                  name="name"
                  placeholder="Unesite ime"
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>Prezime:</label>
                <input
                  type="text"
                  name="surname"
                  placeholder="Unesite prezime ime"
                  value={formData.surname}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>Studijski program:</label>
                <select
                    name="studyProgram"
                    value={formData.studyProgram}
                    onChange={handleChange}
                >
                    <option value="">Odaberite studijski program</option>
                    <option value="Računarstvo i informatika">Računarstvo i informatika</option>
                    <option value="Elektronika i telekomunikacije">Elektronika i telekomunikacije</option>
                    <option value="Elektroenergetika i automatika">Elektroenergetika i automatika</option>
                </select>
              </div>

              <div className="form-group">
                <label>Smjer:</label>
                <select
                    name="major"
                    value={formData.major}
                    onChange={handleChange}
                >
                    <option value="">Odaberite smjer</option>
                    <option value="Softversko inzenjerstvo">Softversko inženjerstvo</option>
                    <option value="Računarsko inzenjerstvo">Računarsko inženjerstvo</option>
                    <option value="Elektronika">Elektronika</option>
                    <option value="Telekomunikacije">Telekomunijacije</option>
                    <option value="Elektroenergetika">Elektroenergetika</option>
                    <option value="Automatika">Automatika</option>
                </select>
              </div>
            </div>

            <div className="form-column">
              <div className="form-group">
                <label>Email:</label>
                <input
                  type="email"
                  name="email"
                  placeholder="someone@domena.tld"
                  value={formData.email}
                  onChange={handleChange}
                />
              </div>

              <div className="form-group">
                <label>Korisničko ime:</label>
                <input
                  type="text"
                  name="username"
                  placeholder="Unesite korisničko ime"
                  value={formData.username}
                  onChange={handleChange}
                  onBlur={usernameCheck}
                />
                {usernameError && <p style={{ color: "red" }}>{usernameError}</p>}
              </div>

              <div className="form-group">
                <label>Lozinka:</label>
                <input
                  type="password"
                  name="password"
                  placeholder="•••••••••••"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                />
              </div>

              <div className="form-group">
                <label>Potvrda lozinke:</label>
                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="•••••••••••"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                />
                {passwordError && <p style={{ color: "red" }}>{passwordError}</p>}
              </div>

            </div>
          </div>

          <button onClick={handleSubmit} className="submit-btn">
            Registruj se!
          </button>
        </div>
      </div>

      <style>{`
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
        }

        .modal-container {
          background: linear-gradient(180deg, #b8d8f0 0%, #d4e8f7 100%);
          border-radius: 20px;
          padding: 40px 60px;
          width: 90%;
          max-width: 800px;
          position: relative;
          box-shadow: 0 10px 40px rgba(0, 0, 0, 0.2);
        }

        .close-btn {
          position: absolute;
          top: 15px;
          right: 15px;
          background: #e57373;
          border: none;
          border-radius: 50%;
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          color: white;
          transition: background 0.3s;
        }

        .close-btn:hover {
          background: #d32f2f;
        }

        .avatar-container {
          display: flex;
          justify-content: center;
          margin-bottom: 30px;
        }

        .avatar-circle {
          width: 120px;
          height: 120px;
          background: linear-gradient(135deg, #5dade2 0%, #3498db 100%);
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 15px rgba(0, 0, 0, 0.15);
        }

        .form-wrapper {
          display: flex;
          flex-direction: column;
          gap: 30px;
        }

        .form-columns {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 40px;
        }

        .form-column {
          display: flex;
          flex-direction: column;
          gap: 20px;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 8px;
        }

        .form-group select {
            padding: 12px 16px;
            border: 1px solid #90a4ae;
            border-radius: 8px;
            font-size: 14px;
            color: black;
            background: rgba(255, 255, 255, 0.7);
            transition: all 0.3s;
        }

        label {
          font-size: 14px;
          color: #2c3e50;
          font-weight: 500;
        }

        input {
          padding: 12px 16px;
          border: 1px solid #90a4ae;
          border-radius: 8px;
          color: black;
          font-size: 14px;

          background: rgba(255, 255, 255, 0.7);
          transition: all 0.3s;
        }

        input:focus {
          outline: none;
          border-color: #3498db;
          background: rgba(255, 255, 255, 0.9);
          box-shadow: 0 0 0 3px rgba(52, 152, 219, 0.1);
        }

        .submit-btn {
          margin-top: 10px;
          padding: 14px 40px;
          background: linear-gradient(135deg, #95a5a6 0%, #7f8c8d 100%);
          color: #2c3e50;
          border: 2px solid #5d6d7e;
          border-radius: 10px;
          font-size: 16px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.3s;
          align-self: center;
          min-width: 200px;
        }

        .submit-btn:hover {
          background: linear-gradient(135deg, #7f8c8d 0%, #6c7a7d 100%);
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.2);
        }

        .submit-btn:active {
          transform: translateY(0);
        }

        @media (max-width: 768px) {
          .modal-container {
            padding: 30px 20px;
            width: 95%;
          }

          .form-columns {
            grid-template-columns: 1fr;
            gap: 20px;
          }
        }
      `}</style>
    </div>
  );
}

export default RegistrationModal