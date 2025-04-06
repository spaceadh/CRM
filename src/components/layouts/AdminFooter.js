import React from "react";

export default function AdminFooter() {
  return (
    <>
      <footer className="footer">
        <div className="container-fluid">
          <div className="copyright ml-auto">
            {" "}
            Copyright &copy;&nbsp;
            {new Date().getFullYear()}, Made with <i className="la la-heart heart text-danger"></i>{" "}
            by{" "}
            <a href="#" target={"_blank"}>
              Alvin Wachira ❤️❤️❤️
            </a>
          </div>
        </div>
      </footer>
    </>
  );
}
