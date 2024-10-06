import React, { useState,useContext } from 'react';
import axios from 'axios';
import { AuthContext } from './AuthContext';


function TeacherLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useContext(AuthContext);
  

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post('/api/teacher-login', { email, password });

      if (response.data.teacher) {
        login(response.data.teacher);
      }
    } catch (err) {
      setError('Invalid email or password');
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-3xl font-bold">Teacher Login</h2>
      {error && <p className="text-red-500">{error}</p>}
      <form onSubmit={handleLogin} className="mt-4">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          className="block w-full mt-2 p-2 border rounded"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          className="block w-full mt-2 p-2 border rounded"
        />
        <button type="submit" className="mt-4 bg-blue-500 text-white p-2 rounded">
          Login
        </button>
      </form>
    </div>
  );
}

export default TeacherLogin;
