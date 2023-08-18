import React from "react";

const Footer = (props) => {
  return (
    <footer className="footer">
      <div className="container">
        <div className="row align-items-center flex-row-reverse">
          <div className="col-12 col-lg-auto mt-3 mt-lg-0 text-center">
            Copyright © {new Date().getFullYear()} &nbsp;
            <a href="https://github.com/elbahjacharafeddine/rs-client-master">
              Activités de recherche
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
