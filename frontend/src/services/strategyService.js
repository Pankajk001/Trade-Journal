import { libraryService } from "./libraryService";
const service = libraryService("strategies");
export default {
  getStrategies: service.list,
  createStrategy: service.create,
  deleteStrategy: service.remove,
};
