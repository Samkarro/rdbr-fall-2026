export default function KinoHeader() {
  return (
    <header>
      <div className="header-components-container">
        <div className="header-components-logos-container">
          <img src="/kinoxii.svg" />
        </div>
        <div className="header-components-actions-container">
          {/* TODO: Separate search bar component */}
          <div className="header-components-auth-buttons">
            {/**
             * TODO: Ternary logic based on logged in status
             * login/Sign Up buttons if logged out, user info if logged in
             */}
          </div>
        </div>
      </div>
    </header>
  );
}
