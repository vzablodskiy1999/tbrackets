import React from 'react';
import { TBracketConfig } from '../models/tbrackets.model';

export const BracketsContext = React.createContext<TBracketConfig>({} as TBracketConfig);