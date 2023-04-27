import { v4 as uuidv4 } from "uuid";
export class FileModel {
  constructor(name, path, num, cycle) {
    this.id = uuidv4();
    this.name = name;
    this.path = path;
    this.checked = false;
    this.cycle = cycle;
    this.num =num;
  }
}