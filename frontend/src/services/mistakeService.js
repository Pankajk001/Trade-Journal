import { libraryService } from "./libraryService";
const service = libraryService("mistakes");
export default {
  getMistakes: service.list,
  createMistake: service.create,
  deleteMistake: service.remove,
};
