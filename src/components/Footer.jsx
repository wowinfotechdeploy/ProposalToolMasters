import React from "react";
import { OutBooksTitle } from "./GlobalMessage";

function Footer() {
  return (
    <div>
      <footer class="footer">
        <div class="container-fluid">
          <div class="row">
            <div class="col-sm-12 text-center">
              © {new Date().getFullYear()} {OutBooksTitle}
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default Footer;
