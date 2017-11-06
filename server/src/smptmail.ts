import * as nodemailer from 'nodemailer';
import {SentMessageInfo} from 'nodemailer';


interface streamedResponse extends SentMessageInfo {
    message: any;
}
let testMailAddress = '';

const testMail = {
    from: testMailAddress,
    to: testMailAddress,
    subject: 'Message',
    text: 'I hope this message gets streamed!'
};

let transporter = nodemailer.createTransport({
                                                 port: 587, // – is the port to connect to (defaults to 587 is secure is false or 465 if true)
                                                 host: 'mail.gmx.de', // – is the hostname or IP address to connect to (defaults to ‘localhost’)
                                                 auth: {
                                                     user: testMailAddress,
                                                     pass: '***'
                                                 } // – defines authentication data (see authentication section below)
                                                 // authMethod: '' // – defines preferred authentication method, defaults to ‘PLAIN’
                                             });

/*
let transporter = nodemailer.createTransport({
                                                 port: false, // – is the port to connect to (defaults to 587 is secure is false or 465 if true)
                                                 host: 'kolab.gs-koeln.de', // – is the hostname or IP address to connect to (defaults to ‘localhost’)
                                                 auth: {
                                                     user: '***',
                                                     pass: '***'
                                                 } // – defines authentication data (see authentication section below)
                                                 // authMethod: '' // – defines preferred authentication method, defaults to ‘PLAIN’
                                             });
*/

async function verifyConnection() {
    return new Promise(function (resolve, reject) {
        transporter.verify(function (error) {
            if (error) {
                // console.log(error);
                reject(error);
            } else {
                console.log('Server is ready to take our messages');
                resolve();
            }
        });
    });
}


export async function sendMail(text?: string | undefined): Promise<any> {
    if (typeof  text === 'string') {
        testMail.text = text;
    }

    try {
        await verifyConnection();

        return new Promise(function (resolve, reject) {
            transporter.sendMail(testMail, (err: string | Error, info: streamedResponse) => {
                if (err) {
                    reject(err);
                }

                resolve(info);
            });
        });
    } catch (error) {
        console.error(error);
        console.error('unable to send mail');
        return 'unable to send mail';
    }
}
