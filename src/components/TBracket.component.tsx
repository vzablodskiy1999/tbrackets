import React, { useEffect, useState, useMemo } from 'react';
import { TBracketConfig, TBracketMatchConfig, TBracketMatchStatus, TBracketRoundConfig, TBracketTeamConfig, TBracketTeamStatus } from '../models/tbrackets.model';
import '../style/tbrackets.style.scss';
import { BracketsContext } from '../context/tbrackets.context';
import { TBracketRound } from './TBracketRound.component';
import { generateRandomId, isPowOfTwo } from '../utils/common.utils';
import { BASE_BRACKET_SIZE, DEFAULT_SCORE_TO_WIN } from '../constants/shared.constants';

export const TBracket = (props: TBracketConfig) => {
  const [config, setConfig] = useState<TBracketConfig>({...props});
  const baseSize = props.baseSize ?? BASE_BRACKET_SIZE;
  const bracketsHeight = useMemo(() => {
    const offsetTop = 40;
    return baseSize * 2 * config.rounds[0].matches.length + offsetTop;
  }, [config.rounds[0], baseSize]);
  const bracketsWidth = useMemo(() => {
    const baseTeamWidth = baseSize * 4;
    const gapsBetweenRounds = (baseSize * 2) * (config.rounds.length - 1)
    return config.rounds.length * baseTeamWidth + gapsBetweenRounds;
  }, [config.rounds, baseSize]);
  const bracketsStyle = { "--base-size": baseSize, height: bracketsHeight, width: bracketsWidth } as React.CSSProperties;

  const generateMatchName = (roundNumber: number, matchNumber: number): string => {
    return props.matchNameGenerator ? props.matchNameGenerator(roundNumber, matchNumber) : `R${roundNumber}M${matchNumber}`;
  }

  const generateTeamName = (match: TBracketMatchConfig): string => {
    const team1 = match?.teams?.[0];
    const team2 = match?.teams?.[1];
    let response = '';

    if (team1 && team1.name && (!team2 || !team2.name || team2.name === TBracketTeamStatus.TBD)) {
      response += team1.name;
    } else if (team2 && team2.name && (!team1 || !team1.name || team1.name === TBracketTeamStatus.TBD)) {
      response += team2.name;
    } else if (match?.matchName) {
      response += `Winner of ${match?.matchName}`
    } else {
      response += TBracketTeamStatus.TBD;
    }

    return response;
  };

  const generateMatchStatus = (match: TBracketMatchConfig, scoreToWin: number): TBracketMatchStatus => {
    const team1 = match?.teams?.[0];
    const team2 = match?.teams?.[1];
    

    if (typeof team1?.score === 'number' && typeof team2?.score === 'number') {
      if (team1.score >= scoreToWin || team2.score >= scoreToWin) {
        return TBracketMatchStatus.FINISHED;
      }
    }

    return TBracketMatchStatus.PENDING;
  }

  const generateTeamStatus = (scoreToWin: number, currTeam?: TBracketTeamConfig, oppositeTeam?: TBracketTeamConfig): TBracketTeamStatus => {
    if (currTeam?.teamStatus) return currTeam.teamStatus;
    if (typeof currTeam?.score === 'number' && typeof oppositeTeam?.score === 'number') {
      if (currTeam.score >= scoreToWin && oppositeTeam.score < currTeam.score) {
        return TBracketTeamStatus.WINNER;
      } else if (oppositeTeam.score >= scoreToWin && currTeam.score < oppositeTeam.score) {
        return TBracketTeamStatus.LOOSER;
      } else if (oppositeTeam.score === currTeam.score && currTeam.score === scoreToWin && oppositeTeam.score === scoreToWin) {
        return TBracketTeamStatus.DRAW;
      }
    } 

    return TBracketTeamStatus.PENDING;
  }

  /* 
    Generator depends on array of first round, passing rounds props make sure you have rounds[0].matches.length === pow of 2 (ex. 2, 4, 8, 16, 64...).
    All other rounds will be generated automaticly.
    Beware that we will generate brackets you to have pow of 2 matches in first round even if data provided for less matches.

    You can also manually pass data for all next rounds, but make sure your next round[i].matches.length will be round[i - 1].matches.length / 2.
    If you already have all required data to build your brackets you can mark disableBracketsGenerator flag to disable generator.
  */
  const generateBracketsFromProvidedConfig = () => {
    let matchesLength = props.rounds[0].matches.length;
    let teamsNumber;
    let rounds = [];
    let result = [];

    if (isPowOfTwo(matchesLength)) {
      teamsNumber = props.rounds[0].matches.length * 2;
    } else {
      let counter = 2;
      
      while (!teamsNumber) {
        let remain = matchesLength - counter;
        if (remain > 0) {
          counter = counter * 2;
        } else {
          teamsNumber = counter;          
          rounds.push({
            teams: teamsNumber,
          });
        }
      }
    };

    while (teamsNumber > 1) {
      teamsNumber = teamsNumber / 2;
      rounds.push({
        teams: teamsNumber,
      });
    };    

    for (let i = 0; i < rounds.length; i ++) {
      const roundTitle = props.rounds?.[i]?.title;
      const roundId = props.rounds?.[i]?.id ?? generateRandomId();

      const round = {
        title: roundTitle,
        id: roundId,
        matches: [],
      } as TBracketRoundConfig;

      for (let y = 0; y < rounds[i].teams; y ++) {
        const matchId = props.rounds?.[i]?.matches?.[y]?.id ?? generateRandomId();
        const matchDate = props.rounds?.[i]?.matches?.[y]?.date;
        const matchName = props.rounds?.[i]?.matches?.[y]?.matchName ?? (!props.disableMatchName && generateMatchName(i + 1, y + 1));
        const scoreToWin = props.rounds?.[i]?.matches?.[y]?.scoreToWin ?? props.scoreToWin ?? DEFAULT_SCORE_TO_WIN;
        const matchStatus = generateMatchStatus(props.rounds?.[i]?.matches?.[y], scoreToWin);

        round.matches.push({
          id: matchId,
          date: matchDate,
          matchName: matchName,
          scoreToWin: scoreToWin,
          status: matchStatus,
          teams: [
            {
              name: props.rounds?.[i]?.matches?.[y]?.teams?.[0]?.name ?? generateTeamName(result[i - 1]?.matches?.[y * 2]),
              id: props.rounds?.[i]?.matches?.[y]?.teams?.[0]?.id ?? generateRandomId(),
              score: props.rounds?.[i]?.matches?.[y]?.teams?.[0]?.score || 0,
              teamStatus: generateTeamStatus(scoreToWin, props.rounds?.[i]?.matches?.[y]?.teams?.[0], props.rounds?.[i]?.matches?.[y]?.teams?.[1]),
            } as TBracketTeamConfig,
            {
              name: props.rounds?.[i]?.matches?.[y]?.teams?.[1]?.name ?? generateTeamName(result[i - 1]?.matches?.[y * 2]),
              id: props.rounds?.[i]?.matches?.[y]?.teams?.[1]?.id ?? generateRandomId(),
              score: props.rounds?.[i]?.matches?.[y]?.teams?.[1]?.score || 0,
              teamStatus: generateTeamStatus(scoreToWin, props.rounds?.[i]?.matches?.[y]?.teams?.[1], props.rounds?.[i]?.matches?.[y]?.teams?.[0])
            } as TBracketTeamConfig,
          ]
        } as TBracketMatchConfig);
      }

      result.push(round)
    };

    setConfig({...props, rounds: result});
  }

  useEffect(() => {
    !props.disableBracketsGenerator && generateBracketsFromProvidedConfig();
  }, []);

  return (
    <BracketsContext.Provider value={config}>
      <div className="tbrackets" style={bracketsStyle}>
        <div className="tbrackets-rounds">
          {config.rounds.map((round) => 
            <TBracketRound {...round} key={round.id || generateRandomId()} />
          )}
        </div>
      </div>
    </ BracketsContext.Provider> 
  );
}