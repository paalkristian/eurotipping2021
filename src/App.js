import './App.css';

import playerGuesses from './data/players.json';
import results from './data/results.json';

function calculateScores(results, playerGuesses) {
  if (results === undefined) {
    return [];
  }
  console.log(getTeamsAtStage(results, 'Round of 16'));
  const points = playerGuesses.map(p => {
    const playersPoints = calculatePlayerPoints(results, p.results);

    return {
      points: playersPoints,
      sum: playersPoints.reduce((prev, next) => prev + next, 0) +  calculateStagePoints(results, p.results),
      name: p.name
    };
  }); 
  
  return points;
}

function calculatePlayerPoints(results, guesses) {
  let points = results
    .filter(r => r.homeTeamScore !== null || r.awayTeamScore !== null)
    .map((result, idx) => {
      const guess = guesses[idx];
      return matchScore(result, guess);
    });
  
  return points;
}

function calculateStagePoints(results, guesses) {
  const roundOf16 = "Round of 16";
  const quarterFinals = "Quarter Finals";
  const semiFinals = "Semi Finals";
  const final = 'Final';

  const r16 = calculatePointsAtStage(roundOf16, results, guesses, 2);
  const stagePoints = calculatePointsAtStage(roundOf16, results, guesses, 2) +
                      calculatePointsAtStage(quarterFinals, results, guesses, 4) +
                      calculatePointsAtStage(semiFinals, results, guesses, 6) +
                      calculatePointsAtStage(final, results, guesses, 8);
  console.log('Seeeeems correct right?:', r16 === stagePoints);
  return stagePoints;

}

function calculatePointsAtStage(stage, results, guesses, multiplyer) {
  const guessedTeamsAtStage = getTeamsAtStage(guesses, stage);
  const actualTeamsAtStage = getTeamsAtStage(results, stage);
  // console.log(guessedTeamsAtStage);
  // console.log(actualTeamsAtStage);
  const correctGuesses = actualTeamsAtStage.filter(t => guessedTeamsAtStage.indexOf(t) > -1).length;
  return correctGuesses * multiplyer;
}

function getTeamsAtStage(matches, stage) {
  return matches.filter(m => m.matchStage === stage)
                .map(m => [m.homeTeam, m.awayTeam])
                .reduce((prev, next) => [...prev, ...next], []);

}

function matchScore(result, guess) {
  // Tippet feil lag i sluttspillet
  if (result.homeTeam !== guess.homeTeam || result.awayTeam !== guess.awayTeam) {
    return 0;
  }

  // Tippet riktig resultat
  if (result.homeTeamScore === guess.homeTeamScore && result.awayTeamScore === guess.awayTeamScore) {
    return 4;
  }
  // Riktig utfall, feil resultat
  if (getWinnerLooserDraw(result) === getWinnerLooserDraw(guess)) {
    return 2;
  }
  return 0;
}

function getWinnerLooserDraw(match) {
  if (match.homeTeamScore === match.awayTeamScore) {
    return 'D';
  }
  return match.homeTeamScore > match.awayTeamScore ? 'H' : 'A';
}

function App() {
  const points = calculateScores(results.results, playerGuesses).sort((a, b) => b.sum - a.sum);
  console.log(points);

  return (
    <div className="App">
      <header className="App-header">
        <h2>
          Tippekonkurransen
        </h2>
        
      </header>
      <ul className="resultList">
        {points.map((p, idx) => <li className="resultList-li"><div>{p.name}</div> <div className="points">{p.sum}</div></li>)}
      </ul>
    </div>
  );
}

export default App;
