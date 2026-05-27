# Event registration

The Hugo site only links to a registration URL (`register` in `data/events.yaml` and `data/id/events.yaml`). Sign-ups, confirmation emails, calendar invites, and reminders run on the registration platform — not in this repo.

## Recommended: [Luma](https://lu.ma)

**Best fit for APC free Zoom webinars** — no code, works for every upcoming event.

| Feature | Luma (free plan) |
| --- | --- |
| Cost | Free — unlimited events and guests ([pricing](https://luma.com/pricing)) |
| Confirmation email + calendar | Automatic on RSVP ([help](https://help.luma.com/p/event-registration-process)) |
| Reminders before event | Email (and SMS/push where enabled) — default 1 day and 1 hour before |
| Zoom / online join info | Set **Virtual** location or paste Zoom link in event; included in guest emails |
| Organizer notifications | Guest list + email history per registrant in **Manage Event → Guests** |
| Custom message to registrants | **Blasts** tab (schedule or send anytime) |
| Paid tickets later | 5% platform fee on paid events (0% on Luma Plus) |

### APC calendar setup (once)

1. Create a **[Luma calendar](https://lu.ma)** for Abroad Portal and Communities (team calendar if several organizers).
2. Set calendar slug/branding (e.g. `apc` → `luma.com/apc/...`).
3. Add co-hosts who need to manage events.

### Per-event checklist

1. **Create event** on Luma (duplicate a past event to save time).
2. Set **date/time** (timezone: WIB for Indonesia-first sessions).
3. **Location:** Virtual → Zoom URL (and password in description or Luma virtual field).
4. **Registration:** open RSVP; customize confirmation email body (Registration tab) with Zoom instructions.
5. Copy the public event URL (e.g. `https://lu.ma/devops-sre-may-2026`).
6. Update the repo:
   - `data/events.yaml` → `register:` (English page — same Luma URL is fine until you run two events)
   - `data/id/events.yaml` → `register:` (Indonesian copy on site; can use the **same** Luma URL or a second event if you want ID-only description on Luma)
7. Align `title`, `date`, and `description` in YAML with the Luma page.

### Bilingual site + one Luma event

- **Simplest:** One Luma event in English (or bilingual description on Luma); put the same URL in both `events.yaml` and `data/id/events.yaml`.
- **Separate Luma pages:** English event URL in `events.yaml`, Indonesian event URL in `data/id/events.yaml` (two RSVPs, two guest lists — only if you need split analytics).

### After you create the DevOps Luma page

Replace the Google Form URL in:

```yaml
# data/events.yaml & data/id/events.yaml
register: "https://lu.ma/your-event-slug"
```

The old Google Form can stay open for redirects or be closed to avoid double sign-ups.

---

## Alternative: Google Forms + Apps Script

Use when you prefer Google Sheets export or already invested in a Form workflow. Requires Apps Script (or Zapier) for registrant Zoom email and `.ics` calendar — see **Appendix** below.

---

## Alternative: Eventbrite

Strong for discovery and free-ticket events ([pricing](https://www.eventbrite.com/organizer/pricing/)): free to publish free events; fees only on paid tickets. Heavier than Luma for small community webinars.

---

## Appendix: Google Forms + Apps Script

<details>
<summary>Click to expand script template</summary>

### Per-event checklist

1. Create or duplicate a Google Form.
2. Attach Apps Script on the linked Sheet (one script per form).
3. Set `register` in `data/events.yaml` / `data/id/events.yaml`.
4. Match site copy to the form.

### Form fields

| Field | Required |
| --- | --- |
| Email | Yes |
| Full name | Yes |
| Current role | Yes |
| How did you hear about this event? | Yes |

### Script template

```javascript
const EVENT_CONFIG = {
  eventTitle: "DevOps & SRE Foundations",
  startIso: "2026-05-30T07:00:00.000Z",
  endIso: "2026-05-30T08:30:00.000Z",
  timezoneLabel: "WIB (UTC+7)",
  location: "Zoom",
  zoomUrl: "https://zoom.us/j/XXXXXXXX",
  zoomPassword: "",
  organizerEmails: ["apc-team@example.com"],
  fromName: "APC Webinars",
};

function onFormSubmit(e) {
  const row = e.values;
  const email = row[1];
  const name = row[2];
  if (!email) return;
  sendRegistrantEmail_(email, name);
  sendOrganizerNotification_(email, name, row);
}

function sendRegistrantEmail_(email, name) {
  const c = EVENT_CONFIG;
  MailApp.sendEmail({
    to: email,
    subject: "Registration confirmed: " + c.eventTitle,
    body: "Hi " + (name || "there") + ",\n\nJoin: " + c.zoomUrl + "\n",
    attachments: [createIcsAttachment_(c)],
  });
}

function sendOrganizerNotification_(registrantEmail, name, row) {
  const c = EVENT_CONFIG;
  c.organizerEmails.forEach(function (to) {
    MailApp.sendEmail({
      to: to,
      subject: "[APC] New registration: " + c.eventTitle,
      body: "Name: " + name + "\nEmail: " + registrantEmail,
    });
  });
}

function createIcsAttachment_(c) {
  const ics =
    "BEGIN:VCALENDAR\r\nVERSION:2.0\r\nBEGIN:VEVENT\r\n" +
    "DTSTART:" + formatIcsDate_(new Date(c.startIso)) + "\r\n" +
    "DTEND:" + formatIcsDate_(new Date(c.endIso)) + "\r\n" +
    "SUMMARY:" + c.eventTitle + "\r\n" +
    "LOCATION:" + c.zoomUrl + "\r\n" +
    "END:VEVENT\r\nEND:VCALENDAR\r\n";
  return Utilities.newBlob(ics, "text/calendar", "event.ics");
}

function formatIcsDate_(d) {
  return Utilities.formatDate(d, "UTC", "yyyyMMdd'T'HHmmss'Z'");
}
```

Adjust `row[n]` indices after a test submit. Add trigger: **On form submit**.

</details>

## Site repo

Do not commit private Zoom passwords unless they are meant to be public. Keep secrets on Luma or in automation config only.
