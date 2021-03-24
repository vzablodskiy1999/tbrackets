import moment from "moment";
import { DATE_FORMAT_AS_STRING } from "../constants/shared.constants";

export const pipeDateToUsableFormat = (date: Date): string => {
    return moment(date).format(DATE_FORMAT_AS_STRING);
}