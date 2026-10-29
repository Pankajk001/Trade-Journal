import tradeService from "./tradeService";
import { calculateStats } from "../lib/analytics";
import { journalService } from "./journalService";
export default {
  async getStats() {
    const [trades, profile] = await Promise.all([
      tradeService.all(),
      journalService.profile(),
    ]);
    return calculateStats(trades, profile.timezone);
  },
};
