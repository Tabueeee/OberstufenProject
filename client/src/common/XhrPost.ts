export class XhrPost {

    public postJsonToUrl(url, jsonString) {
        return new Promise(function (resolve, reject) {
            var xhr = new XMLHttpRequest();
            xhr.withCredentials = false;

            setTimeout(function () {
                reject('timeout');
            }, 60000);

            xhr.addEventListener('readystatechange', function () {
                if (this.readyState === 4) {
                    resolve(this.responseText);
                }
            });

            xhr.open('POST', 'http://127.0.0.1:3000/sendMail');
            xhr.setRequestHeader('content-type', 'application/json');
            // xhr.setRequestHeader('cache-control', 'no-cache');

            xhr.send(jsonString);
        });
    }
}
