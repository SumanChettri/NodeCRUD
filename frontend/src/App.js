import React from 'react';
import CreateUser from './components/CreateUser';
import UserList from './components/UserList';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function App() {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-12 text-center mb-4">User Management</h1>
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Create User</h2>
        <CreateUser />
      </div>
      <div>
        <h2 className="text-xl font-semibold mb-2">Users</h2>
        <UserList />
      </div>
      <ToastContainer />
    </div>
  );
}

export default App;