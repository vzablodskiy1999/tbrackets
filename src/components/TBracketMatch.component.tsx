import React, { useContext, useEffect } from 'react';
import { TBracketMatchConfig, TBracketMatchStatus, TBracketTeamConfig, TBracketConfig, TBracketTeamStatus } from '../models/tbrackets.model';
import { TBracketTeam } from './TBracketTeam.component';
import { BracketsContext } from '../context/tbrackets.context';
import { pipeDateToUsableFormat } from '../utils/date.utils';

export const TBracketMatch = (props: TBracketMatchConfig) => {
    const ctx = useContext<TBracketConfig>(BracketsContext);

    const generateStatusesForTeams = (currTeam?: TBracketTeamConfig, oppositeTeam?: TBracketTeamConfig): TBracketTeamStatus => {
        if ((typeof currTeam?.score === 'number') && (typeof oppositeTeam?.score === 'number')) {
            if ((currTeam.score > oppositeTeam.score) && props.status === TBracketMatchStatus.FINISHED) {
                return TBracketTeamStatus.WINNER;
            } else if (currTeam.score < oppositeTeam.score && props.status === TBracketMatchStatus.FINISHED) {
                return TBracketTeamStatus.LOOSER;
            } else if (currTeam.score === oppositeTeam.score && props.status === TBracketMatchStatus.FINISHED) {
                return TBracketTeamStatus.DRAW;
            }
        }

        return TBracketTeamStatus.PENDING;
    }

    const generateClassNamesForMatch = (): string => {
        let className = "tbrackets-match ";

        if (props.status === TBracketMatchStatus.FINISHED) className += "tbrackets-match--finished "
        if (props.status === TBracketMatchStatus.PENDING) className += "tbrackets-match--pending "

        return className;
    }

    const handleMatchClick = (): void => {
        ctx.onMatchClick && ctx.onMatchClick(props, ctx);
    }

    useEffect(() => {
        if (props?.teams?.[0] && props?.teams?.[1]) {
            props.teams[0].teamStatus = generateStatusesForTeams(props.teams[0], props.teams[1])
            props.teams[1].teamStatus = generateStatusesForTeams(props.teams[1], props.teams[0])
        }
        
    }, [])

    return (
        <div id={props.id} className={generateClassNamesForMatch()} onClick={handleMatchClick}>
            {props.date && 
                <span className="tbrackets-match__date">
                    {ctx.postprocessDate ? ctx.postprocessDate(props.date) : pipeDateToUsableFormat(props.date)}
                </span>
            }
            <span className="tbrackets-match__name">{props.matchName}</span>
            <div className="tbrackets-match__teams">
                <TBracketTeam {...props?.teams?.[0]} />
                <TBracketTeam {...props?.teams?.[1]} />
            </div>
        </div>
    )
}