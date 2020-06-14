import React, { useEffect, useState } from 'react';
import { Link, useHistory } from 'react-router-dom';
import { FiPower, FiTrash2 } from 'react-icons/fi';

import './styles.css';

import logoImg from '../../assets/logo.svg';

function Profile() {
  const [incidents, setIncidents] = useState([]);

  const ongName = localStorage.getItem('ongName');
  const ongId = localStorage.getItem('ongId');

  const history = useHistory();
  
  useEffect(() => {
    async function getIncidents() {
      const url = 'http://localhost:3001/profile';
      const options = {
        method: 'GET',
        headers: new Headers({
          'Authorization': ongId
        })
      };
      const response = await fetch(url,options);
      const data = await response.json();
      setIncidents(data);
    }
    getIncidents();
  }, [ongId]);

  async function handleDeleteIncident(id) {
    try {
      const url = `http://localhost:3001/incidents/${id}`;
      const options = {
        method: 'DELETE',
        headers: new Headers({
          'Authorization': ongId,
          'Content-Type': 'application/json'
        })
      };
      const response = await fetch(url,options);
      console.log(response);
      if(response.status === 204) {
        setIncidents(incidents.filter(incident => incident.id !== id));
      } else {
        alert(`Erro ao deletar caso (${response.status})`);
      }      
    } catch(error) {
      alert('Erro ao deletar caso');
    }
  }

  function handleLogout() {
    localStorage.clear();

    history.push('/');
  }

  return(
    <div className="profile-container">
      <header>
        <img src={logoImg} alt="Be the Hero" />
        <span>Bem vinda, {ongName}</span>

        <Link className="button" to="/incidents/new">Cadastrar novo caso</Link>
        <button onClick={handleLogout} type="button">
          <FiPower size={18} color="#e02041" />
        </button>
      </header>

      <h1>Casos cadastrados</h1>
        
      <ul>
        {Array.from(incidents).map(incident => (
          <li key={incident.id}>
            <strong>CASO:</strong>
            <p>{incident.title}</p>

            <strong>DESCRIÇÃO:</strong>
            <p>{incident.description}</p>

            <strong>VALOR:</strong>
            <p>{Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL'}).format(incident.value)}</p>

            <button onClick={() => handleDeleteIncident(incident.id)} type="button">
              <FiTrash2 size={20} color="#a8a8b3" />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Profile;