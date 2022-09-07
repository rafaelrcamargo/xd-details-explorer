import { colord, extend } from "colord"
import namesPlugin from "colord/plugins/names"
extend([namesPlugin])

export const getName = (tone: string): string => colord(tone).toName({ closest: true }) || tone
