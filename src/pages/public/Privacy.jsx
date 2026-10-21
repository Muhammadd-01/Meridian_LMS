import LegalPage from './LegalPage'

const SECTIONS = [
  { title: 'Summary', body: [
    'This Meridian platform is a frontend-only demonstration. It does not collect, transmit or sell personal data. Everything you do is stored in your own browser using LocalStorage.',
  ] },
  { title: 'What is stored in your browser', body: [
    'The demo stores your session, profile preferences, enrolments, lesson progress, notes, bookmarks, quiz attempts, assignment submissions, reviews, notifications and — for the admin demo — catalogue and platform settings.',
    'Keys are namespaced with the prefix “meridian.v1”. LocalStorage is not encrypted and is not a secure storage mechanism.',
  ] },
  { title: 'Third-party resources', body: [
    'Images are loaded from a public image CDN and a sample video clip is loaded from a public documentation site. Fonts may be loaded from Google Fonts. These providers may receive standard request information such as your IP address, as with any web page.',
  ] },
  { title: 'Forms', body: [
    'Contact, business and password-reset forms are validated in the browser only. Their contents are not sent anywhere and no emails are delivered.',
  ] },
  { title: 'Your choices', body: [
    'You can remove all demo data at any time by using “Reset demo data” in Settings or by clearing this site’s data in your browser.',
  ] },
]

export default function Privacy() {
  return <LegalPage title="Privacy notice" intro="How this demonstration handles information — in short, it stays in your browser." updated="October 2026" sections={SECTIONS} />
}
