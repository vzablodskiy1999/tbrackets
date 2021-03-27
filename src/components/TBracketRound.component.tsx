import React, { useMemo } from 'react';
import { TBracketMatchStatus, TBracketRoundConfig } from '../models/tbrackets.model';
import { generateRandomId } from '../utils/common.utils';
import { TBracketMatch } from './TBracketMatch.component';

export const TBracketRound = (props: TBracketRoundConfig) => {
    const roundStyle = { "--matches-amount": props.matches.length } as React.CSSProperties;

    const isRoundFinished = useMemo(() => {        
        return props?.matches?.every((match) => {
            return match.status === TBracketMatchStatus.FINISHED
        });
    }, [props.matches]);

    return (
        <div className={"tbrackets-round " + (isRoundFinished ? 'tbrackets-round--finished' : 'tbrackets-round--unfinished')} 
            id={props.id} style={roundStyle}>
            {props.title && 
                <span className="tbrackets-round__title">
                    {props.title}
                </span>
            }
            <div className="tbrackets-round__matches">
                {props?.matches?.map((match) => 
                    <TBracketMatch {...match} key={match.id || generateRandomId()} />
                )}
            </div>
        </div>
    )
}