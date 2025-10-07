import React from "react";
import "react-responsive-carousel/lib/styles/carousel.min.css";
import { Col } from "reactstrap";

// import images
import itsmLogo from "../../assets/images/itsm_logo_word.png";
import cictoLogo from "../../assets/images/itsm_logo.png";

const CarouselPage = () => {
  return (
    <React.Fragment>
      <Col xl={9}>
        <div className="auth-full-bg pt-lg-5 p-4">
          <div className="w-100">
            <div className="bg-overlay"></div>
            <div className="d-flex h-100 flex-column">
              <div className="p-4 mt-auto">
                <div className="row justify-content-center">
                  <div className="col-lg-12">
                    <div className="text-center">
                      <h1 className="mb-3">
                        <span className="text-primary">
                          BUSINESS PERMITS AND LICENSES DEPARTMENT
                        </span>
                      </h1>

                      <div dir="ltr">
                        <div>
                          <div className="item">
                            <div className="py-3">
                              <h3>
                                <span className="text-primary">
                                  City Government of Butuan
                                </span>
                              </h3>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Col>
    </React.Fragment>
  );
};
export default CarouselPage;
