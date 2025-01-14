import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { toast } from 'react-toastify';

const fadeIn = keyframes`
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
`;

const Container = styled.div`
  animation: ${fadeIn} 0.5s ease-in-out;
`;

const Button = styled.button`
  padding: 8px 16px;
  margin: 4px;
  border: none;
  border-radius: 4px;
  color: white;
  cursor: pointer;
  background-color: ${props => props.bgColor || 'gray'};
  &:hover {
    opacity: 0.8;
  }
`;

const Input = styled.input`
  display: block;
  width: 100%;
  padding: 8px;
  margin-bottom: 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
`;

const Table = styled.table`
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
`;

const Th = styled.th`
  padding: 12px;
  border: 1px solid #ddd;
  background-color: #f4f4f4;
  text-align: left;
`;

const Td = styled.td`
  padding: 12px;
  border: 1px solid #ddd;
  text-align: left;
`;

const Modal = styled.div`
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: white;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  z-index: 1000;
`;

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  z-index: 999;
`;

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [editingUser, setEditingUser] = useState(null);
  const [email, setEmail] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const fetchUsers = async () => {
    const response = await fetch('http://localhost:3000/api/users');
    const data = await response.json();
    setUsers(data);
  };

  const deleteUser = async (id) => {
    const response = await fetch(`http://localhost:3000/api/user/${id}`, {
      method: 'DELETE',
    });
    if (response.ok) {
      toast.success('User deleted successfully!');
      fetchUsers();
    } else {
      toast.error('Error deleting user');
    }
  };

  const startEditing = (user) => {
    setEditingUser(user);
    setEmail(user.email_address);
    setUsername(user.username);
    setPassword(user.password);
  };

  const updateUser = async (e) => {
    e.preventDefault();
    const response = await fetch(`http://localhost:3000/api/user/${editingUser.ID}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email_address: email, username, password }),
    });
    if (response.ok) {
      toast.success('User updated successfully!');
      setEditingUser(null);
      setEmail('');
      setUsername('');
      setPassword('');
      fetchUsers();
    } else {
      toast.error('Error updating user');
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <Container>
      <Button onClick={fetchUsers} bgColor="green">
        Fetch All Users
      </Button>
      <Table>
        <thead>
          <tr>
            <Th>ID</Th>
            <Th>Email</Th>
            <Th>Username</Th>
            <Th>Actions</Th>
          </tr>
        </thead>
        <tbody>
          {users.map((user) => (
            <tr key={user.ID}>
              <Td>{user.ID}</Td>
              <Td>{user.email_address}</Td>
              <Td>{user.username}</Td>
              <Td>
                <Button onClick={() => startEditing(user)} bgColor="yellow">
                  Edit
                </Button>
                <Button onClick={() => deleteUser(user.ID)} bgColor="red">
                  Delete
                </Button>
              </Td>
            </tr>
          ))}
        </tbody>
      </Table>
      {editingUser && (
        <>
          <Overlay onClick={() => setEditingUser(null)} />
          <Modal>
            <h2>Edit User</h2>
            <form onSubmit={updateUser}>
              <Input
                type="email"
                placeholder="Email Address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <Input
                type="text"
                placeholder="Username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                required
              />
              <Input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <Button type="submit" bgColor="blue">
                Update User
              </Button>
            </form>
          </Modal>
        </>
      )}
    </Container>
  );
};

export default UserList;