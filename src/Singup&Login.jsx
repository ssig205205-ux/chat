import { ArrowLeft } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useContext } from "react";
import { AuthContext } from "./contexts/authContext";

const apiUrl = "http://localhost:5000/api/"; // Replace with your actual API URL

export function Singup() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setconfirmPassword] = useState("");
  const nevigate = useNavigate();
 

  const handleNameChange = (e) => {
    setName(e.target.value);
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };
  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };
  const handleConfirmPasswordChange = (e) => {
    setconfirmPassword(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      alert("Passwords do not match");
      return;
    }
    const data = { name, email, password };
    try {
      const response = await fetch(`${apiUrl}signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      const result = await response.json();
      if (response.ok) {
        nevigate("/Login");
      } else {
        alert(result.error);
      }
    } catch (error) {
      console.error("Error during signup:", error);
      alert("An error occurred during signup.");
    }
  };

  return (
    <div className="container">
      <div className="login-card">
        <ArrowLeft
          onClick={() => {
            nevigate(-1);
          }}
        />

        <div className="login-header">
          <img
            src="https://cdn-icons-png.flaticon.com/512/4712/4712027.png"
            alt="Logo"
            className="IconImg"
          />
          <h1>SignUp</h1>

          <p>Create your chatter account</p>
        </div>

        <form className="form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Name</label>
            <input
              type="text"
              placeholder="Enter your Name"
              value={name}
              onChange={handleNameChange}
            />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={handleEmailChange}
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={handlePasswordChange}
            />
          </div>
          <div className="form-group">
            <label>Confirm Password</label>
            <input
              type="password"
              placeholder="Confirm password"
              value={confirmPassword}
              onChange={handleConfirmPasswordChange}
              required
            />
          </div>

          <button type="submit" className="btn">
            Singup
          </button>
        </form>

        <p className="footer">
          Already have an account?
          <Link to="/Login">
            <span>Login</span>
          </Link>
        </p>
      </div>
    </div>
  );
}

export function Login() {
  const nevigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { setUser } = useContext(AuthContext); // Access setUser from AuthContext

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };
  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      alert("Please fill all fields");
      return;
    }
    const data = { email, password };
    try {
      const response = await fetch(`${apiUrl}login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        credentials: "include", // Include cookies in the request
        body: JSON.stringify(data),
      });
      if (!response.ok) {
        alert("Login failed");
        return;
      }
      const result = await response.json();
      console.log(result);
      setUser(result.user);
      nevigate("/") // Update the user state in the context
    } catch (error) {
      console.error("Error:", error);
      alert("An error occurred during login");
    }
  };

  return (
    <div className="container">
      <div className="login-card">
        <ArrowLeft
          onClick={() => {
            nevigate(-1);
          }}
        />
        <div className="login-header">
          <img
            src="https://cdn-icons-png.flaticon.com/512/4712/4712027.png"
            alt="Logo"
            className="IconImg"
          />
          <h1>Login</h1>

          <p>Login with your chatter account</p>
        </div>

        <form className="form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              placeholder="Enter your email"
              value={email}
              onChange={handleEmailChange}
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={handlePasswordChange}
            />
          </div>

          <div className="form-row">
            <label>
              <input type="checkbox" />
              Remember me
            </label>
          </div>

          <button type="submit" className="btn">
            Login
          </button>
        </form>

        <p className="footer">
          Don’t have an account?
          <Link to="/SignUp">
            <span>SignUp</span>
          </Link>
        </p>
      </div>
    </div>
  );
}
