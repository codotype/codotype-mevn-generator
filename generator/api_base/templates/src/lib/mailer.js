const mailgun = require('mailgun-js')({
  apiKey: process.env.MAILGUN_API_KEY,
  domain: process.env.MAILGUN_DOMAIN
});

// // // //

// dispatch
// Dispatches an email via MailGun
function dispatch ({ sender, recipient, subject, text, html }) {
  // Build email
  const dispatch = {
    from: sender,
    to: recipient,
    subject: subject
  };

  // Formats email output
  if (text) {
    dispatch.text = text
  } else if (html) {
    dispatch.html = html
  } else {
    return // Just don't send the email I guess?
  }

  // Send mailgun dispatch
  mailgun.messages()
  .send(dispatch, function (error, body) {
    // console.log(dispatch);
    console.log(`Dispatched email to ${recipient} via MailGun`);
  });
}

module.exports = {
  dispatch
}
