import React, {useState} from "react";
import NavItem from "./NavItem";

/**
 * A navbar to be displayed on the left side of the screen, pops out
 * when clicking on the bars with a small animation.
 * @param {Object} props The props passed to this object
 * @returns {React.Component} The navbar populated with tabs
 */
const Navbar = ({ ...props}) => {
    const [navOpen, setNavOpen] = useState();

    return(
      <div
            className={`fixed top-0 left-0 w-fit h-screen overflow-x-clip text-gray-50 z-50 ease-in-out duration-200 ${
                navOpen ? `` : `sm:-translate-x-[13rem]`
            } ${props.className}`}
      >
          <nav
                className={`relative isolate sm:w-64 h-full`}></nav>

      </div>
    );
}