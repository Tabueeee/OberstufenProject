export class XhrRequest {
    public requestFromUrl(requestUrl: string): Promise<string> {
        return new Promise(function (resolve: (response: string) => void, reject: (error: string | Error) => void): void {
            try {
                let data: null = null;
                let xhr: XMLHttpRequest = new XMLHttpRequest();
                xhr.withCredentials = false;

                xhr.addEventListener('readystatechange', function (): void {
                    if (this.readyState === 4) {
                        if (typeof this.responseText === 'undefined') {
                            reject('nope');
                        }

                        resolve(this.responseText);
                    }
                });

                xhr.open('GET', requestUrl);
                // xhr.setRequestHeader("cache-control", "no-cache");

                xhr.send(data);
            } catch (error) {
                console.warn(error);
                reject(error);
            }
        });
    }
}
