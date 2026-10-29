import { libraryService } from "./libraryService";
const service = libraryService("notes");
export default {
  getNotes: service.list,
  createNote: service.create,
  deleteNote: service.remove,
};
