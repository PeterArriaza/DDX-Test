const data = require('./primaryElectionData.json');
const express = require('express');
const app = express();

/*
{
    “Pennsylvania”: {
        “Chester”: {
    			“Democrats”: {
    				“Humphrey ”: 100,
    				“McGovern”: 50
    			},	
    			“Republicans”: {
    				“Nixon”: 200,
    				“Ashbrook”: 2,
    				“McCloskey”: 1
    			}
		}
	}
}

===Schema===
{State: {
    County: {
        Party: {
            Candidate: Votes
        }
    }
}}
============
*/

const getMaxVotes = (obj) => {
  let maxVotes = 0;
  let candidate = '';
  let candidates = Object.keys(obj);
  for (let i = 0; i < obj.length; i++) {
    if (obj[candidates[i]] > maxVotes) {
      maxVotes = obj[i];
      candidate = candidates[i];
    }
  }
  return [candidate, maxVotes];
};

// combine total votes of each candidate
const mergeCandidateVotes = (obj) => {
  let result = {};

  // if value in result obj exists, increase total, else add to result
  obj.forEach((candidate) => {
    for (let [key, value] of Object.entries(candidate)) {
      result[key] ? (result[key] += value) : (result[key] = value);
    }
  });
  return result;
};

const getStateWinners = (obj) => {
  // arrays of statewide total votes per candidate
  let dems = [];
  let reps = [];
  let counties = Obj.keys(obj);
  for (county in counties) {
    // iterate through each county party results -> add to totals by party
    dems.push(Obj[county].Democrats);
    reps.push(Obj[county].Republicans);
  }

  // combine totals for each candidate
  let demTotals = mergeCandidateVotes(dems);
  let repTotals = mergeCandidateVotes(reps);

  // get candidate with most votes
  let demWinner = getMaxVotes(demTotals);
  let repWinner = getMaxVotes(repTotals);
  return [demWinner, repWinner];
};

// same strategy as state level but with an extra iteration for going through states & counties
const getOverallWinners = () => {
  let dems = [];
  let reps = [];
  let states = Obj.keys(data);
  for (state in states) {
    let counties = Obj.keys(obj);
    for (county in counties) {
      // iterate through each county party results -> add to totals by party
      dems.push(Obj[county].Democrats);
      reps.push(Obj[county].Republicans);
    }
  }

  let demTotals = mergeCandidateVotes(dems);
  let repTotals = mergeCandidateVotes(reps);

  let demWinner = getMaxVotes(demTotals);
  let repWinner = getMaxVotes(repTotals);
  return [demWinner, repWinner];
};

// assumes that counties are always indexed by state
// avoids confusion for multiple states with same county name
app.get('/results/:state/:county', (req, res) => {
  let state = req.body.state;
  let county = req.body.county;
  let dems = data[state][county].Democrats;
  let reps = data[state][county].Republicans;

  let demWinner = getMaxVotes(dems)[0];
  let repWinner = getMaxVotes(reps)[0];
  res.json({
    Democrats: `${demWinner}`,
    Republicans: `${repWinner}`,
  });
});

app.get('/results/:state', (req, res) => {
  let state = req.body.state;
  let stateObj = data[state];
  let [demWinner, repWinner] = getStateWinners(stateObj);

  res.json({
    Democrats: `${demWinner}`,
    Republicans: `${repWinner}`,
  });
});

app.get('/results/overall', (req, res) => {
  let [demWinner, repWinner] = getOverallWinners(stateObj);

  res.json({
    Democrats: `${demWinner}`,
    Republicans: `${repWinner}`,
  });
});
