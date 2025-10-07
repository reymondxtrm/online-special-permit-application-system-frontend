import PropTypes from "prop-types";
import React, { useState } from "react";
import {
  Nav,
  NavbarToggler,
  NavItem,
  NavLink,
  Container,
  Collapse,
} from "reactstrap";
import { Link } from "react-router-dom";
import ScrollspyNav from "./ScrollSpy";

//Import Images
import logodark from "../../../assets/images/logo-dark.png";
import logolight from "../../../assets/images/logo-light.png";

const navItems = [
  { id: 1, idnm: "home", navheading: "Home" },
  { id: 2, idnm: "specialPermit", navheading: "Special Permit" },
  { id: 4, idnm: "team", navheading: "Team" },
  { id: 5, idnm: "news", navheading: "News" },
  { id: 6, idnm: "faqs", navheading: "FAQs" },
];

const Navbar = (props) => {
  const [isOpenMenu, setisOpenMenu] = useState(false);

  //Store all NavigationbaFr Id into TargetID variable(Used for Scrollspy)
  let TargetId = navItems.map((item) => {
    return item.idnm;
  });
  console.log(TargetId);

  const color = props.imglight !== true ? "black" : "white";

  return (
    <React.Fragment>
      <nav
        className={
          "navbar navbar-expand-lg navigation fixed-top sticky " +
          props.navClass
        }
      >
        <Container>
          <div style={{ paddingTop: "15px" }}>
            <p
              style={{
                color: color,
                letterSpacing: ".2rem",
                fontWeight: "600",
                fontSize: "16pt",
              }}
            >
              BPLD
            </p>
          </div>

          <NavbarToggler
            className="p-0"
            onClick={() => {
              setisOpenMenu();
            }}
          >
            <i className="fa fa-fw fa-bars" />
          </NavbarToggler>

          <Collapse id="topnav-menu-content" isOpen={isOpenMenu} navbar>
            <ScrollspyNav
              scrollTargetIds={TargetId}
              scrollDuration="800"
              headerBackground="true"
              activeNavClass="active"
              className="navbar-collapse"
            >
              <Nav className="ms-auto navbar-nav" id="topnav-menu">
                {navItems.map((item, key) => (
                  <NavItem
                    key={key}
                    className={item.navheading === "Home" ? "active" : ""}
                  >
                    <NavLink href={"#" + item.idnm}> {item.navheading}</NavLink>
                  </NavItem>
                ))}
              </Nav>
            </ScrollspyNav>
          </Collapse>
        </Container>
      </nav>
    </React.Fragment>
  );
};

Navbar.propTypes = {
  imglight: PropTypes.any,
  navClass: PropTypes.string,
};

export default Navbar;
