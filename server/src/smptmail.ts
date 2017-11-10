import * as nodemailer from 'nodemailer';
import {SendMailOptions, SentMessageInfo} from 'nodemailer';
import * as emailSettings from '../config/email-settings.json';

interface streamedResponse extends SentMessageInfo {
    message: any;
}

async function verifyConnection(transporter) {
    return new Promise(function (resolve, reject) {
        transporter.verify(function (error) {
            if (error) {
                // console.log(error);
                reject(error);
            } else {
                console.log('Server is ready to take our messages');
                resolve(true);
            }
        });
    });
}

function generateEmail(subject, text, mailRecipient): SendMailOptions {
    return {
        from: emailSettings.auth.user,
        to: mailRecipient,
        subject: subject,
        text: text
    };
}

async function sendMessage(transporter, text: string, title: string, mailRecipient: string) {
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
}

export async function sendMail(text: string, title: string, mailRecipient: string): Promise<any> {
    try {
        let transporter = nodemailer.createTransport(emailSettings);
        let isVerified = await verifyConnection(transporter);

        if (isVerified) {
            console.log('verifyConnection passed.');
            try {
                sendMessage(transporter, text, title, mailRecipient);
            } catch (error) {
                console.error(error);
            }
        }
    } catch (error) {
        console.error(error);
    }
}
