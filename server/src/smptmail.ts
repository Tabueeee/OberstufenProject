import * as nodemailer from 'nodemailer';
import {SendMailOptions, SentMessageInfo} from 'nodemailer';
import * as emailSettings from '../config/email-settings.json';

interface streamedResponse extends SentMessageInfo {
    message: any;
}

const testMail = {
    from: emailSettings.auth.user,
    to: 'tobiassneeze@googlemail.com',
    subject: 'Message',
    text: 'I hope this message gets streamed!'
};


let transporter = nodemailer.createTransport(emailSettings);


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

function generateEmail(subject, text, mailRecipient): SendMailOptions {
    return {
        from: emailSettings.auth.user,
        to: mailRecipient,
        subject,
        text
    };
}

export async function sendMail(text: string, title: string, mailRecipient: string): Promise<any> {
    try {
        await verifyConnection();
        console.log('verifyConnection passed.');
        return new Promise(function (resolve, reject) {
            let mailToSend: SendMailOptions = generateEmail(title, text, mailRecipient);
            console.log(mailToSend);
            transporter.sendMail(mailToSend, (err: string | Error, info: streamedResponse) => {
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
