import { APP_NAME } from '../../constants';

function Footer() {
  return (
    <footer className="px-6 pt-5 pb-7 text-center text-[0.8rem] text-fg-muted">
      <p>
        © {new Date().getFullYear()} {APP_NAME}. Frontend portfolio demo — data via DummyJSON.
      </p>
    </footer>
  );
}

export default Footer;
