import { Injectable } from '@angular/core';
import { Storage } from '@ionic/storage-angular';

@Injectable({
  providedIn: 'root'
})
export class StorageService {
  private _storage: Storage | null = null;
  constructor(public storage:Storage) { 
  this.init()
  }
  async init() {
     const storage = await this.storage.create();
    this._storage = storage;
  }
  set(key:string, value:any){
	       return this.storage.set(key, value);
   }
 
   async get(key){
     return await this.storage.get(key);
   }
 
   delete(key){
     this.storage.remove(key);
   }
   deleteAll(){
    this.storage.clear();
  }
 
}
