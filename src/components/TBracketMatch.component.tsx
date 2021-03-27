import React, { useContext, useMemo } from 'react';
import { TBracketMatchConfig, TBracketMatchStatus, TBracketConfig } from '../models/tbrackets.model';
import { TBracketTeam } from './TBracketTeam.component';
import { BracketsContext } from '../context/tbrackets.context';
import { pipeDateToUsableFormat } from '../utils/date.utils';

export const TBracketMatch = (props: TBracketMatchConfig) => {
    const ctx = useContext<TBracketConfig>(BracketsContext);

    const classNamesForMatch = useMemo((): string => {
        let className = "tbrackets-match ";

        if (props.status === TBracketMatchStatus.FINISHED) className += "tbrackets-match--finished "
        if (props.status === TBracketMatchStatus.PENDING) className += "tbrackets-match--pending "

        return className;
    }, [props.status]);

    const handleMatchClick = (): void => {
        ctx.onMatchClick && ctx.onMatchClick(props, ctx);
    }

    return (
        <div id={props.id} className={classNamesForMatch} onClick={handleMatchClick}>
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