export interface TBracketRoundConfig {
    title?: string;
    id: string;
    matches: TBracketMatchConfig[];
}

export interface TBracketMatchConfig {
    id?: string;
    date?: Date;
    status?: TBracketMatchStatus;
    matchName?: string;
    teams?: TBracketTeamConfig[]; 
    scoreToWin?: number;
}

export enum TBracketMatchStatus {
    PENDING = 'PENDING',
    FINISHED = 'FINISHED'
}

export enum TBracketTeamStatus {
    WINNER = 'WINNER',
    LOOSER = 'LOOSER',
    DRAW = 'DRAW',
    PENDING = 'PENDING',
    TBD = 'TBD',
}

export interface TBracketTeamConfig {
    id?: string;
    name?: string;
    score?: number;
    teamStatus?: TBracketTeamStatus;
}

export interface TBracketConfig {
    rounds: TBracketRoundConfig[];
    isLoading: boolean;
    baseSize?: number;
    disableBracketsGenerator?: boolean;
    matchNameGenerator?: (roundNumber: number, matchNumber: number) => string;
    onTeamClick?: (team?: TBracketTeamConfig, props?: TBracketConfig) => void;
    onMatchClick?: (match?: TBracketMatchConfig, props?: TBracketConfig) => void;
    postprocessDate?: (date: Date, props?: TBracketConfig) => string;
}