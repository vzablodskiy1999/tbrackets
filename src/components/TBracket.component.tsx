import React, { useEffect, useState, useMemo } from 'react';
import { TBracketConfig, TBracketMatchConfig, TBracketMatchStatus, TBracketRoundConfig, TBracketTeamConfig, TBracketTeamStatus } from '../models/tbrackets.model';
import '../style/tbrackets.style.scss';
import { BracketsContext } from '../context/tbrackets.context';
import { TBracketRound } from './TBracketRound.component';
import { generateRandomId, isPowOfTwo } from '../utils/common.utils';
import { BASE_BRACKET_SIZE } from '../constants/shared.constants';

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

  const generateTeamName = (matches: TBracketMatchConfig): string => {
    const team1 = matches?.teams?.[0];
    const team2 = matches?.teams?.[1];
    let response = '';

    if (team1 && team1.name && (!team2 || !team2.name || team2.name === TBracketTeamStatus.TBD)) {
      response += team1.name;
    } else if (team2 && team2.name && (!team1 || !team1.name || team1.name === TBracketTeamStatus.TBD)) {
      response += team2.name;
    } else if (matches?.matchName) {
      response += `Winner of ${matches?.matchName}`
    } else {
      response += TBracketTeamStatus.TBD;
    }

    return response;
  };

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

    let matchIterator = 1;
    for (let i = 0; i < rounds.length; i ++) {
      const item = {
        title: props.rounds?.[i]?.title,
        id: props.rounds?.[i]?.id ?? generateRandomId(),
        matches: [],
      } as TBracketRoundConfig;
      for (let y = 0; y < rounds[i].teams; y ++) {
        item.matches.push({
          id: props.rounds?.[i]?.matches?.[y]?.id ?? generateRandomId(),
          date: props.rounds?.[i]?.matches?.[y]?.date,
          matchName: props.rounds?.[i]?.matches?.[y]?.matchName ?? generateMatchName(i + 1, y + 1),
          status: props.rounds?.[i]?.matches?.[y]?.status ?? TBracketMatchStatus.PENDING,
          teams: [
            props.rounds?.[i]?.matches?.[y]?.teams?.[0] ?? {
              name: generateTeamName(result[i - 1]?.matches?.[y * 2]),
              id: generateRandomId(),
              score: props.rounds?.[i]?.matches?.[y]?.teams?.[0] || 0,
              teamStatus: TBracketTeamStatus.TBD,
            } as TBracketTeamConfig,
            props.rounds?.[i]?.matches?.[y]?.teams?.[1] ?? {
              name: generateTeamName(result[i - 1]?.matches?.[y * 2 + 1]),
              id: generateRandomId(),
              score: props.rounds?.[i]?.matches?.[y]?.teams?.[1] || 0,
              teamStatus: TBracketTeamStatus.TBD,
            } as TBracketTeamConfig,
          ]
        } as TBracketMatchConfig);

        matchIterator++;
      }

      result.push(item)
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
          {config.rounds.map((round, idx) => 
            <TBracketRound {...round} key={round.id} />
          )}
        </div>
      </div>
    </ BracketsContext.Provider> 
  );
}