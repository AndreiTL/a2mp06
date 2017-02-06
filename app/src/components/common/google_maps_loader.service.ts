import {Injectable} from '@angular/core';
@Injectable()
export class GoogleMapLoaderService {

  load(options: IGoogleMapsLoaderService.ILoadOptions): Promise<google.maps.Map> {
    const callbackName = '__googleMapsApiOnLoadCallback';

    return new Promise((resolve, reject) => {
        // Exit if not running inside a browser.
      if (typeof window === 'undefined') {
        return reject(new Error('Can only load the Google Maps API in the browser'));
      }

      // Prepare the `script` tag to be inserted into the page.
      const scriptElement = document.createElement('script');
      const params = ['callback=' + callbackName];
      if (options.client) {
        params.push('client=' + options.client);
      }
      if (options.key) {
        params.push('key=' + options.key);
      }
      if (options.language) {
        params.push('language=' + options.language);
      }
      options.libraries = [].concat(options.libraries); // Ensure that `libraries` is an array
      if (options.libraries.length) {
        params.push('libraries=' + options.libraries.join(','));
      }
      if (options.v) {
        params.push('v=' + options.v);
      }
      scriptElement.src = 'https://maps.googleapis.com/maps/api/js?' + params.join('&');

      // Timeout if necessary.
      let timeoutId: number = null;
      if (options.timeout) {
        timeoutId = setTimeout(() => {
          window[callbackName] = () => {}; // Set the on load callback to a no-op.
          reject(new Error('Could not load the Google Maps API'));
        }, options.timeout);
      }

      // Hook up the on load callback.
      window[callbackName] = () => {
        if (timeoutId !== null) {
          clearTimeout(timeoutId);
        }

        resolve((<IGoogleMapsLoaderService.IWindowWithGoogle> window).google.maps);
        delete window[callbackName];
      };

      // Insert the `script` tag.
      document.body.appendChild(scriptElement);

    });
  }
}
