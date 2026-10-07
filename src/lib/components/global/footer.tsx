import "./styles/footer.styles.css";

export default function KinoFooter() {
  return (
    <footer>
      <hr />
      <div className="footer-text-container">
        <span className="kino-footer-text">
          KINO <span>XII</span>
        </span>
        <p className="kino-footer-copyright body-s">
          © 2026 Kino XII. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
