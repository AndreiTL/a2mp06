declare namespace IGoogleMapsLoaderService {
  export interface ILoadOptions {
      client?: string;
      key?: string;
      language?: string;
      libraries?: string[];
      timeout?: string;
      v?: string;
    }

    export interface IWindowWithGoogle extends Window {
      google: any;
    }

    export function load(
      obj: ILoadOptions
    ): Promise<google.maps.Map>;
}
