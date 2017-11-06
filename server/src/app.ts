// import * as http from 'http';
// import {sendTestMail} from './testmail';
import {sendMail} from './smptmail';
import * as Mailgen from 'mailgen';

let mailGenerator = new Mailgen({
                                    theme: 'default',
                                    product: {
                                        // Appears in header & footer of e-mails
                                        name: 'Mailgen',
                                        link: 'https://mailgen.js/',
                                        // Optional product logo
                                        logo: 'http://www.gso-koeln.de/images/logos/gso-bk-logo.jpg'
                                    }
                                });
let email = {
    body: {
        name: 'John Appleseed',
        intro: 'Welcome to Mailgen! We\'re very excited to have you on board.',
        action: {
            instructions: 'To get started with Mailgen, please click here:',
            button: {
                color: '#22BC66', // Optional action button color
                text: 'Confirm your account',
                link: 'https://mailgen.js/confirm?s=d9729feb74992cc3482b350163a1a010'
            }
        },
        outro: 'Need help, or have questions? Just reply to this email, we\'d love to help.'
    }
};
let emailBody = mailGenerator.generate(email);
// let emailBody = mailGenerator.generatePlaintext(email);
// transporter.sendMail({
//                          from: '[email protected]',
//                          to: '[email protected]',
//                          subject: 'Message',
//                          text: 'I hope this message gets streamed!'
//                      }, (err: string | Error, info: streamedResponse) => {
//
//     if (err) {
//         throw err;
//     }
//
//     console.dir(info, {colors: true, depth: 2});
//     console.log(info.envelope);
//     console.log(info.messageId);
//     info.message.pipe(process.stdout);
// });


sendMail(emailBody).then(console.log);

/*
const hostname = '127.0.0.1';
const port = 3000;

const server = http.createServer(async (req, res) => {
  console.log(req.url);
  res.statusCode = 200;
  res.setHeader('Content-Type', 'text/plain');
  let mailInfo = await sendMail();
  console.log(mailInfo.messageId);
  res.end(`mail successfully sent to ${mailInfo.envelope.to}`);
});

server.listen(port, hostname, () => {
  console.log(`Server running at http://${hostname}:${port}/`);
});*/

