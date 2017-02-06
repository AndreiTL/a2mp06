import {Injectable} from '@angular/core';

@Injectable()
export class StorageService {

  setData(key: string, value: string): void {
    localStorage.setItem(key, value);
  }

  getData(key: string): string {
    return localStorage.getItem(key);
  }

  deleteData(key: string): void {
    localStorage.removeItem(key);
  }

}
