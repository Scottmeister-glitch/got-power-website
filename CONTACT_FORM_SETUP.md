# Contact form setup

The contact form uses [FormSubmit](https://formsubmit.co/) because this site is hosted on GitHub Pages and cannot send email itself. No email password, API key, or other secret is stored in this repository or sent by the site's JavaScript.

Before the form can deliver customer requests:

1. Publish the site, open the contact form from the public website, and send one test request.
2. Sign in to `meisterfitness@gmail.com`, find the activation email from FormSubmit, and click **Activate Form**. Check the spam folder if it does not arrive.
3. Send a second test request with recognizable test values. Confirm that FormSubmit accepts it and that the complete request arrives at `meisterfitness@gmail.com`.
4. Submit a test on both desktop and mobile.

Do not consider the form operational until activation and the end-to-end delivery test in step 3 are complete. FormSubmit may expose additional configuration in its activation flow; no FormSubmit account or paid plan is normally required, but the destination mailbox must be accessible for verification.

FormSubmit's built-in CAPTCHA and the invisible `_honey` field provide complementary bot protection. The honeypot is hidden from customers and removed from the keyboard navigation order. FormSubmit processes and emails the submitted contact details, so the site owner should review FormSubmit's terms and privacy policy before activation.

The form intentionally uses a normal browser POST to its `https://formsubmit.co/meisterfitness@gmail.com` action. Do not intercept the first submission with the FormSubmit AJAX endpoint: the standard endpoint is required to start FormSubmit's email-confirmation flow for a new destination.

## GA4 conversion tracking

`phone_click` fires for telephone links with `link_location` (topbar, header, hero, contact, footer, mobile or other). An ordinary click waits for the Google callback or a maximum of 500 ms before opening the dialer. A blocked tag cannot stop the call. This measures clicks, not connected calls.

The form continues to use a normal POST for every submission. `_next` sends accepted requests back to `thanks.html`. JavaScript adds a random return marker and saves a matching pending marker in sessionStorage for one hour. Only a matching return fires `generate_lead` with `form_id=contact` and `submission_method=formsubmit_redirect`; the marker is consumed once. Direct visits, refreshes, back navigation, validation failures and submit-button clicks do not produce a lead. The marker is removed and excluded from GA page_location. No customer name, phone, email, city or message is sent as event parameters.

This is client-side evidence of FormSubmit's successful return, not proof of email delivery. It is not a signed server receipt. If storage/JavaScript/Analytics is blocked, or the customer closes the page before returning, tracking may be absent while delivery still works. Keep activation and mailbox delivery verification mandatory. No AJAX endpoint is introduced, and CAPTCHA/honeypot protection remains enabled.

### Live verification after deployment

1. Open `https://gotpowerelectrical.com/?ga_debug=1` with analytics permitted and blockers disabled. In GA4 select the property containing web stream `G-457JX3YZSF`, then **Admin > Data display > DebugView**. Select your test device. Also open **Reports > Realtime**, checking event counts by event name.
2. Click each phone link on desktop and mobile. Expect exactly one `phone_click` per click and the correct `link_location`; confirm the dialer opens. Cancel the call. On desktop a missing calling app does not indicate tracking failure.
3. Try submitting with required fields empty. Expect browser validation and no `generate_lead`.
4. If the destination is not activated, send the first recognizable test through the normal form, complete any CAPTCHA, and activate it from the FormSubmit email in `meisterfitness@gmail.com`. No lead should be inferred from the activation screen. Do not manually visit the thank-you URL to simulate success.
5. From the debug URL, send a second recognizable test after activation. Complete CAPTCHA and allow FormSubmit to redirect to `thanks.html?ga_debug=1`. Expect one `generate_lead`; inspect its parameters in DebugView. Independently confirm that the complete request arrives in the mailbox. Repeat on mobile.
6. Refresh the returned page, revisit it using Back/Forward, then open `https://gotpowerelectrical.com/thanks.html?ga_debug=1` directly. None should add another `generate_lead`. Failed/cancelled FormSubmit flows should not add one either.
7. Test with analytics blocked: phone links must still open within 500 ms and the form must still POST normally. A missing GA event under those conditions is expected.
8. In **Admin > Data display > Events**, mark `generate_lead` as a key event. Optionally mark `phone_click` separately; it is a call intent, not a completed call. If the event has not appeared yet, create a key event with that exact name under **Key events**. Do not use Enhanced Measurement's `form_submit` as proof of success and do not create a second `generate_lead` rule from it or the thank-you page view. Standard reports may take 24–48 hours; use DebugView/Realtime for immediate checks.

The automated checks exercise mocked browser/GA behavior only. Activation, CAPTCHA, production redirects, actual GA collection and email delivery require the live checks above.
