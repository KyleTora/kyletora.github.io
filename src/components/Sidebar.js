import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight } from '@fortawesome/free-solid-svg-icons';
import '../styles/sidebar.css';

const Sidebar = ({ setSelectedItem }) => {
  const [selectedCategory, setSelectedCategory] = useState('stats'); // 'stats' or 'standings'
  const [standings, setStandings] = useState(null); // State to store the standings data

  useEffect(() => {
    //fetchStandings();
  }, []);

  const fetchStandings = async () => {
    const url = 'https://api-nba-v1.p.rapidapi.com/standings?league=standard&season=2023';
    const options = {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': 'e4c520d24amsh9a7752663538b1fp1d9c61jsn0966436d95bc',
        'X-RapidAPI-Host': 'api-nba-v1.p.rapidapi.com'
      }
    };
    
    try {
      const response = await fetch(url, options);
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      const standingsData = processStandingsData(data); // Process the fetched data
      setStandings(standingsData);
      console.log("api called sidebar");
    } catch (error) {
      console.error('Error fetching standings:', error);
    }
  };

  const processStandingsData = (data) => {
    const standingsData = {
      West: [],
      East: []
    };

    data.response.forEach(team => {
      const teamInfo = {
        name: team.team.name,
        rank: team.conference.rank,
        wins: team.conference.win,
        losses: team.conference.loss,
        id: team.team.id
      };

      if (team.conference.name === 'west') {
        standingsData.West.push(teamInfo);
      } else {
        standingsData.East.push(teamInfo);
      }
    });

    return standingsData;
  };

  const statsItems = {
    PPG: [
      "Luka Doncic: 35.5ppg",
      "Lebron James: 31ppg",
      "Giannis Antetokounmpo: 30ppg"
    ],
    APG: [
      "Chris Paul: 10apg",
      "Russell Westbrook: 9.8apg",
      "Trae Young: 9.5apg"
    ],
    RPG: [
      "Rudy Gobert: 14.5rpg",
      "Clint Capela: 14.2rpg",
      "Nikola Jokic: 13.5rpg"
    ],
    SPG: [
      "Jimmy Butler: 2.0spg",
      "Marcus Smart: 1.8spg",
      "Matisse Thybulle: 1.7spg"
    ],
    BPG: [
      "Rudy Gobert: 2.7bpg",
      "Myles Turner: 2.6bpg",
      "Nerlens Noel: 2.2bpg"
    ]
  };

  const handleItemClick = (item) => {
    setSelectedItem(item);
    console.log(item);
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
    setSelectedItem(null); // Reset selected item when changing category
  };

  const renderItems = () => {
    return selectedCategory === 'stats' ? statsItems : standings;
  };

  return (
    <aside className="sidebar">
      <div className="slider">
        <button
          className={selectedCategory === 'stats' ? 'active' : ''}
          onClick={() => handleCategoryChange('stats')}
        >
          Stats
        </button>
        <button
          className={selectedCategory === 'standings' ? 'active' : ''}
          onClick={() => handleCategoryChange('standings')}
        >
          Standings
        </button>
      </div>
      <h4 className='title'>{selectedCategory === 'stats' ? 'Stats Leaders' : 'Eastern Conference'}</h4>

      <div className='card-category'>
        {selectedCategory === 'stats' ? (
          Object.entries(renderItems()).map(([stat, leaders]) => (
            <ul key={stat} className="stat-list">
              <h4 className='stat-title'>{stat}</h4>
              {leaders.map((leader, index) => (
                <li key={index} className="list-group-item">
                  {leader} <FontAwesomeIcon icon={faArrowRight} className='icon' onClick={() => handleItemClick(leader)} /> 
                </li>
              ))}
            </ul>
          ))
        ) : (
        <>
        {standings && Object.entries(standings).map(([conference, teams]) => (
            <ul key={conference} className="stat-list">
              <h4 className='stat-title'>{conference}</h4>
              {teams.map((team, index) => (
                <li key={index} className="list-group-item">
                  {team.name} <span>{team.wins}-{team.losses} <FontAwesomeIcon icon={faArrowRight} className='icon' onClick={() => handleItemClick(team)} /> </span>
                </li>
              ))}
            </ul>
          ))}
        </> 
        )}
      </div>
    </aside>
  );
};

export default Sidebar;
