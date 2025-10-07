import React, { useEffect, useState } from "react";

//Import Components
import Navbar from "./Navbar/Navbar";
import Section from "./Section/Section";
import Footer from "./Footer/footer";
import SpecialPermit from "./SpecialPermit";
import FAQs from "./Faqs/FAQs";

const CryptoIcoLanding = (props) => {
  document.title = "BPLD | SPECIAL PERMIT";

  const [imglight, setimglight] = useState(true);
  const [navClass, setnavClass] = useState("");

  // Use ComponentDidMount
  useEffect(() => {
    window.addEventListener("scroll", scrollNavigation, true);
  }, []);

  function scrollNavigation() {
    var scrollup = document.documentElement.scrollTop;
    if (scrollup > 80) {
      setimglight(false);
      setnavClass("nav-sticky");
    } else {
      setimglight(true);
      setnavClass("");
    }
  }

  return (
    <React.Fragment>
      {/* import navbar */}
      <Navbar navClass={navClass} imglight={imglight} />

      {/* <Section /> */}

      <SpecialPermit props={props} />

      {/* <CardsMini /> */}

      {/* <AboutUs /> */}

      {/* <Features /> */}

      {/* <RoadMap /> */}

      {/* <OurTeam /> */}

      {/* <Blog /> */}

      {/* <FAQs />

      <Footer /> */}
    </React.Fragment>
  );
};

export default CryptoIcoLanding;
