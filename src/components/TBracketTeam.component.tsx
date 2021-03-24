import React, { useContext } from 'react';
import { TBracketConfig, TBracketTeamConfig, TBracketTeamStatus } from '../models/tbrackets.model';
import { BracketsContext } from '../context/tbrackets.context';

export const TBracketTeam = (props: TBracketTeamConfig) => {
    const ctx = useContext<TBracketConfig>(BracketsContext);

    const handleTeamClick = (): void => {
        ctx?.onTeamClick && ctx.onTeamClick(props, ctx);
    }

    const generateTeamClassNames = (): string => {
        if (props.teamStatus === TBracketTeamStatus.WINNER) {
            return "tbrackets-team--winner";
        } else if (props.teamStatus === TBracketTeamStatus.LOOSER) {
            return "tbrackets-team--looser";
        } else if (props.teamStatus === TBracketTeamStatus.DRAW) {
            return "tbrackets-team--draw";
        }

        return "";
    }

    return (
      <div id={props.id} className={"tbrackets-team " + generateTeamClassNames()} onClick={handleTeamClick}>
          <span className="tbrackets-team__score">{props.score}</span>
          <span className="tbrackets-team__name">{props.name || 'TBD'}</span>
      </div>
    );
}