import React from "react";
import { OutBooksTitle } from "./GlobalMessage";

function Footer() {
  return (
    <div>
      {/* <footer class="footer ">
        <div class="container-fluid">
          <div class="row">
            <div class="col-sm-12 text-center">
              © {new Date().getFullYear()} {OutBooksTitle}
            </div>
          </div>
        </div>
      </footer> */}
      <footer
        className="footer bg-light text-center w-100 py-2"
        style={{ position: 'fixed', bottom: 0}}
      >
        © {new Date().getFullYear()} {OutBooksTitle}
      </footer>
    </div>
  );
}

export default Footer;
