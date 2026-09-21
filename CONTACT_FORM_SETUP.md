# Contact form setup

The contact form uses [FormSubmit](https://formsubmit.co/) because this site is hosted on GitHub Pages and cannot send email itself. No email password, API key, or other secret is stored in this repository or sent by the site's JavaScript.

Before the form can deliver customer requests:

1. Publish the site, open the contact form from the public website, and send one test request.
2. Sign in to `gotpower1989@yahoo.com`, find the activation email from FormSubmit, and click **Activate Form**. Check the spam folder if it does not arrive.
3. Send a second test request with recognizable test values. Confirm that the page displays the success message **and** that the complete request arrives at `gotpower1989@yahoo.com`.
4. Submit a test on both desktop and mobile. To exercise the error message before launch, temporarily block requests to `formsubmit.co` in browser developer tools and submit the form.

Do not consider the form operational until activation and the end-to-end delivery test in step 3 are complete. FormSubmit may expose additional configuration in its activation flow; no FormSubmit account or paid plan is normally required, but the destination mailbox must be accessible for verification.

The hidden `_honey` field provides basic bot protection without adding a CAPTCHA or other step for legitimate customers. FormSubmit processes and emails the submitted contact details, so the site owner should review FormSubmit's terms and privacy policy before activation.
