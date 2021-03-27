import React from 'react';
import { TBracket } from './components/TBracket.component';
import { TBracketMatchStatus, TBracketConfig } from './models/tbrackets.model';

function App() {
  const props: TBracketConfig = {
    rounds: [
      {
        title: "Round 1",
        matches: [
          {
            date: new Date(),
            teams: [
              {
                name: 'Tigers',
                score: 1,
              },
              {
                name: 'Lions',
                score: 0,
              }
            ]
          },
          {
            date: new Date(),
            teams: [
              {
                name: 'Pigs',
                score: 1,
              },
              {
                name: 'Monkeyband',
                score: 0,
              }
            ]
          }
        ]
      },
      {
        title: "Final",
        matches: [
          {
            date: new Date(),
            teams: [
              {
                name: 'Tigers',
                score: 0,
              },
              {
                name: 'Pigs',
                score: 0,
              }
            ]
          }
        ]
      }
    ],

    onTeamClick: (t) => {
      props.rounds?.[0]?.matches?.[0].teams?.[0].score && props.rounds[0].matches[0].teams[0].score ++;
      console.log(props);
      
    }
  };

  return (
    <div className="App">
      <TBracket {...props} />
    </div>
  );
}

export default App;
