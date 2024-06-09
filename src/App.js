import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './App.css'; 

function App() {
  const [contacts, setContacts] = useState([]);//this is use state
  const [contact, setContact] = useState({
    id: '',
    name: '',
    email: '',
    contact_number: '',
    message: '',
    website: ''
  });

  useEffect(() => {
    fetchContacts();
  }, []); //to fetch automatically

  const fetchContacts = async () => {
    try {
      const response = await axios.get('http://localhost/contact_form/api.php');
      setContacts(response.data);
    } catch (error) {
      console.error('Error fetching contacts:', error);
    }
  }; 

  const handleChange = (e) => {
    const { name, value } = e.target;
    setContact({ ...contact, [name]: value });
  }; //to handle changes

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      if (contact.id) {
        await axios.put('http://localhost/contact_form/api.php', JSON.stringify(contact), {
          headers: {
            'Content-Type': 'application/json'
          }
        });
      } else {
        await axios.post('http://localhost/contact_form/api.php', JSON.stringify(contact), {
          headers: {
            'Content-Type': 'application/json'
          }
        });
      }
      setContact({
        id: '',
        name: '',
        email: '',
        contact_number: '',
        message: '',
        website: ''
      });
      fetchContacts();
    } catch (error) {
      console.error('Error submitting contact:', error);
    }
  };

  const handleEdit = (id) => {
    const selectedContact = contacts.find(contact => contact.id === id);
    if (selectedContact) {
      setContact(selectedContact);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete('http://localhost/contact_form/api.php', {
        headers: {
          'Content-Type': 'application/json'
        },
        data: JSON.stringify({ id })
      });
      fetchContacts();
    } catch (error) {
      console.error('Error deleting contact:', error);
    }
  };

  return (
    <div className="container">
      <form onSubmit={handleSubmit} className="form">
        <h2>Contact Form</h2>
        <input type="hidden" name="id" value={contact.id} />
        <input type="text" name="name" value={contact.name} onChange={handleChange} placeholder="Name" required />
        <input type="email" name="email" value={contact.email} onChange={handleChange} placeholder="Email" required />
        <input type="text" name="contact_number" value={contact.contact_number} onChange={handleChange} placeholder="Contact Number" />
        <textarea name="message" value={contact.message} onChange={handleChange} placeholder="Message" />
        <input type="text" name="website" value={contact.website} onChange={handleChange} placeholder="Website" />
        <button type="submit">Submit</button>
      </form>
      <table className="table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Email</th>
            <th>Contact Number</th>
            <th>Message</th>
            <th>Website</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {contacts.map(contact => (
            <tr key={contact.id}>
              <td>{contact.name}</td>
              <td>{contact.email}</td>
              <td>{contact.contact_number}</td>
              <td>{contact.message}</td>
              <td>{contact.website}</td>
              <td>
                <button className="edit-btn" onClick={() => handleEdit(contact.id)}>Edit</button>
                <button className="delete-btn" onClick={() => handleDelete(contact.id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default App;
