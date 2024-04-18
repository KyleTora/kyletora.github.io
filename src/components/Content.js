import React, { useRef, useState, useEffect } from 'react';
import '../styles/components.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowLeft, faArrowRight } from '@fortawesome/free-solid-svg-icons';

// Live Games section

const LiveGames = () => {
  // Placeholder data for live and upcoming games
  const liveGames = [
    { homeTeam: 'Game1', awayTeam: 'Warriors', homeScore: 110, awayScore: 105 },
    { homeTeam: 'Game2', awayTeam: 'Knicks', homeScore: 90, awayScore: 88 },
    { homeTeam: 'Game3', awayTeam: 'Heat', homeScore: 90, awayScore: 90 },
    { homeTeam: 'Game4', awayTeam: 'Magic', homeScore: 90, awayScore: 90 },
    { homeTeam: 'Game5', awayTeam: 'Sixers', homeScore: 90, awayScore: 90 },
    { homeTeam: 'Game6', awayTeam: 'Hawks', homeScore: 90, awayScore: 90 },
    { homeTeam: 'Game7', awayTeam: 'Warriors', homeScore: 110, awayScore: 105 },
    { homeTeam: 'Game8', awayTeam: 'Knicks', homeScore: 90, awayScore: 88 },
    { homeTeam: 'Game9', awayTeam: 'Heat', homeScore: 90, awayScore: 90 },
    { homeTeam: 'Game10', awayTeam: 'Magic', homeScore: 90, awayScore: 90 },
    { homeTeam: 'Game11', awayTeam: 'Sixers', homeScore: 90, awayScore: 90 },
    { homeTeam: 'Game12', awayTeam: 'Hawks', homeScore: 90, awayScore: 90 },
  ];

  const [startIndex, setStartIndex] = useState(0);

  const scrollLeft = () => {
    if (startIndex > 0) {
      setStartIndex(startIndex - 1);
    }
  };

  const scrollRight = () => {
    if (startIndex < liveGames.length - 6) {
      setStartIndex(startIndex + 1);
    }
  };

  const visibleGames = liveGames.slice(startIndex, startIndex + 6);

  return (
    <div className="row mb-4">
      <div className="col-md-1">
        <button 
          className="btn btn-light btn-sm" 
          onClick={scrollLeft} 
          disabled={startIndex === 0}
        >
          <FontAwesomeIcon icon={faArrowLeft} />
        </button>
      </div>
      <div className="col-md-10">
        <h5>Live Games</h5>
        <div className="overflow-hidden">
          <div className="d-flex">
            {visibleGames.map((game, index) => (
              <div key={index} className="card w-100 m-2">
                <div className="card-body">
                  <div className="d-flex justify-content-between">
                    <h6 className="card-title">{game.awayTeam}</h6>
                    <span className="font-weight-bold">{game.awayScore !== null ? game.awayScore : '-'}</span>
                  </div>
                  <div className="d-flex justify-content-between">
                    <h6 className="card-title">{game.homeTeam}</h6>
                    <span className="font-weight-bold">{game.homeScore !== null ? game.homeScore : '-'}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="col-md-1">
        <button 
          className="btn btn-light btn-sm" 
          onClick={scrollRight} 
          disabled={startIndex === liveGames.length - 6}
        >
          <FontAwesomeIcon icon={faArrowRight} />
        </button>
      </div>
    </div>
  );
};
// Main content section

const Content = ({ selectedItem }) => {
  const [teamDetails, setTeamDetails] = useState(null);

  useEffect(() => {
     if (selectedItem) {
    //   fetchTeamDetails();
     }
  }, [selectedItem]);

  const fetchTeamDetails = async () => {
    const url = `https://api-nba-v1.p.rapidapi.com/standings?league=standard&season=2023&team=${selectedItem.id}`;
    const options = {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': 'e4c520d24amsh9a7752663538b1fp1d9c61jsn0966436d95bc',
        'X-RapidAPI-Host': 'api-nba-v1.p.rapidapi.com'
      }
    };

    try {
      const response = await fetch(url, options);
      const data = await response.json();
      const teamData = data.response[0];
      setTeamDetails(teamData);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="content">
      <LiveGames />

      {teamDetails ? (
        <div className="row">
          <div className="col-md-6">
            <div className="card mb-4">
              <img src={teamDetails.team.logo} className="card-img-top" alt={teamDetails.team.name} />
              <div className="card-body">
                <h5 className="card-title">{teamDetails.team.name}</h5>
                <p className="card-text">Nickname: {teamDetails.team.nickname}</p>
                <p className="card-text">Code: {teamDetails.team.code}</p>
              </div>
            </div>
          </div>
          <div className="col-md-6">
            <div className="card mb-4">
              <div className="card-body">
                <h5 className="card-title">Conference</h5>
                <p className="card-text">Name: {teamDetails.conference.name}</p>
                <p className="card-text">Rank: {teamDetails.conference.rank}</p>
                <p className="card-text">Wins: {teamDetails.conference.win}</p>
                <p className="card-text">Losses: {teamDetails.conference.loss}</p>
              </div>
            </div>
            <div className="card mb-4">
              <div className="card-body">
                <h5 className="card-title">Division</h5>
                <p className="card-text">Name: {teamDetails.division.name}</p>
                <p className="card-text">Rank: {teamDetails.division.rank}</p>
                <p className="card-text">Wins: {teamDetails.division.win}</p>
                <p className="card-text">Losses: {teamDetails.division.loss}</p>
                <p className="card-text">Games Behind: {teamDetails.division.gamesBehind}</p>
              </div>
            </div>
          </div>
          <div className="col-md-6">
            <div className="card mb-4">
              <div className="card-body">
                <h5 className="card-title">Wins</h5>
                <p className="card-text">Home: {teamDetails.win.home}</p>
                <p className="card-text">Away: {teamDetails.win.away}</p>
                <p className="card-text">Total: {teamDetails.win.total}</p>
                <p className="card-text">Percentage: {teamDetails.win.percentage}</p>
                <p className="card-text">Last Ten: {teamDetails.win.lastTen}</p>
              </div>
            </div>
          </div>
          <div className="col-md-6">
            <div className="card mb-4">
              <div className="card-body">
                <h5 className="card-title">Losses</h5>
                <p className="card-text">Home: {teamDetails.loss.home}</p>
                <p className="card-text">Away: {teamDetails.loss.away}</p>
                <p className="card-text">Total: {teamDetails.loss.total}</p>
                <p className="card-text">Percentage: {teamDetails.loss.percentage}</p>
                <p className="card-text">Last Ten: {teamDetails.loss.lastTen}</p>
              </div>
            </div>
          </div>
          <div className="col-md-12">
            <div className="card mb-4">
              <div className="card-body">
                <h5 className="card-title">Additional Details</h5>
                <p className="card-text">Games Behind: {teamDetails.gamesBehind}</p>
                <p className="card-text">Streak: {teamDetails.streak}</p>
                <p className="card-text">Win Streak: {teamDetails.winStreak ? 'Yes' : 'No'}</p>
                <p className="card-text">Tie Breaker Points: {teamDetails.tieBreakerPoints || 'N/A'}</p>
              </div>
            </div>
          </div>
        </div>
      ) : (
        <p className="loading">Loading...</p>
      )}
    </div>
  );
};

export default Content;