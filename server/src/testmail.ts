import * as nodemailer from 'nodemailer';
import {SentMessageInfo} from 'nodemailer';


interface streamedResponse extends SentMessageInfo {
    message: any;
}

const testMail = {
    from: 'bleh',
    to: 'someone@no.one',
    subject: 'Message',
    text: 'I hope this message gets streamed!'
};

let transporter = nodemailer.createTransport({
                                                 streamTransport: true,
                                                 newline: 'windows'
                                             });

export async function sendTestMail(): Promise<any> {
    return new Promise(function (resolve, reject) {
        transporter.sendMail(testMail, (err: string | Error, info: streamedResponse) => {
            if (err) {
                reject(err);
            }

            resolve(info);
        });
    });
}
