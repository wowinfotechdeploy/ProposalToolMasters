import React from "react";
import { OutBooksTitle } from "./GlobalMessage";

function Footer() {
  return (
      
      <footer
        className="footer bg-light text-center w-100 py-2"
        // style={{ position: 'absolute', bottom: 0}}
      >
        © {new Date().getFullYear()} {OutBooksTitle}
      </footer>
  );
}

export default Footer;
