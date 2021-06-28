import { Band } from "../../src/model/Band";

export class BandDatabase {
  public async createBand(band: Band): Promise<void | string> {
    if(band){
        return "Band registered successfully!";
    }
    
  }
}

export default new BandDatabase();
