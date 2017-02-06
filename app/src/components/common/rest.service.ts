import {Injectable} from '@angular/core';
@Injectable()
export class RestService {

  sendRequest(type: string, url: string, async: boolean, body: string): Promise<string> {
    return new Promise((resolve, reject) => {
      let xhr = new XMLHttpRequest();
      xhr.open(type, url, async);
      xhr.send([body]);
      xhr.onreadystatechange = function() {
        if (this.readyState !== 4) {
          return;
        }
        if (this.status !== 200) {
          reject(null);
        } else {
          resolve(this.responseText);
        }
      };
    });
  }
}
