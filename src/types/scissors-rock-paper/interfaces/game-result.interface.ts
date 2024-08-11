import { EResult } from "../../enums/result.enum";
import { EChoice } from "../enums/choice.enum";

export interface IGameResult {
  result: EResult,
  value: EChoice | null,
  bet: number
}
