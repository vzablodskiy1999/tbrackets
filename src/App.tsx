import React from 'react';
import { TBracket } from './components/TBracket.component';
import { TBracketMatchStatus, TBracketConfig } from './models/tbrackets.model';

function App() {
  const props: TBracketConfig = {
    isLoading: false,
    rounds: [
      {
        title: "Round 1",
        id: '1',
        matches: [
          {
            id: 'test Id',
            date: new Date(),
            status: TBracketMatchStatus.FINISHED,
            teams: [
              {
                id: 'te41st id',
                name: 'Lions',
                score: 1,
              },
            ]
          },
          {
            id: 'test id1',
            date: new Date(),
            status: TBracketMatchStatus.PENDING,
            teams: [
              {
                id: '1254',
                name: 'Pantheras',
                score: 1,
              }
            ]
          },
          {
            id: 'test I414d',
            date: new Date(),
            status: TBracketMatchStatus.FINISHED,
            teams: [
              {
                id: 'test22d',
                name: 'Lions',
                score: 1,
              },
              {
                id: 'test11d',
                name: 'Cats',
                score: 0,
              }
            ]
          },
          {
            id: 'test id14141',
            date: new Date(),
            status: TBracketMatchStatus.PENDING,
            teams: [
              {
                id: '1242',
                name: 'Turtles',
                score: 1,
              },
              {
                id: '124',
                name: 'Pantheras',
                score: 1,
              }
            ]
          }
        ]
      },
    ],
    onTeamClick: (t, p) => {
      console.log(t);
      console.log(p);
      
      
    }
  };

  return (
    <div className="App">
      <TBracket {...props} />
    </div>
  );
}

export default App;
