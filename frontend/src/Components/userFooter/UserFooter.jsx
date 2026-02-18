import React from "react";
import {
  MDBFooter,
  MDBContainer,
  MDBRow,
  MDBCol,
  MDBIcon,
} from "mdb-react-ui-kit";

export default function App() {
  return (
    <MDBFooter
      style={{ backgroundColor: "#005f40" }}
      className="text-center text-lg-start text-white"
    >
      {/* Social Section */}
      <section className="d-flex justify-content-center justify-content-lg-between p-4 border-bottom">
        <div className="me-5 d-none d-lg-block">
          <span>Connect with FarmDirect on social media:</span>
        </div>

        <div>
          <a href="#" className="me-4 text-reset">
            <MDBIcon fab icon="facebook-f" />
          </a>
          <a href="#" className="me-4 text-reset">
            <MDBIcon fab icon="instagram" />
          </a>
          <a href="#" className="me-4 text-reset">
            <MDBIcon fab icon="twitter" />
          </a>
          <a href="#" className="me-4 text-reset">
            <MDBIcon fab icon="linkedin" />
          </a>
        </div>
      </section>

      {/* Main Section */}
      <section>
        <MDBContainer className="text-center text-md-start mt-5">
          <MDBRow className="mt-3">
            {/* Company Info */}
            <MDBCol md="3" lg="4" xl="3" className="mx-auto mb-4">
              <h6 className="text-uppercase fw-bold mb-4">
                <MDBIcon icon="seedling" className="me-2" />
                FarmDirect
              </h6>
              <p>
                FarmDirect is an online platform connecting farmers directly
                with customers. We help farmers sell fresh crops without
                middlemen and ensure customers get quality produce at fair
                prices.
              </p>
            </MDBCol>

            {/* Categories */}
            <MDBCol md="2" lg="2" xl="2" className="mx-auto mb-4">
              <h6 className="text-uppercase fw-bold mb-4">Categories</h6>
              <p><a href="#" className="text-reset">Vegetables</a></p>
              <p><a href="#" className="text-reset">Fruits</a></p>
              <p><a href="#" className="text-reset">Grains</a></p>
              <p><a href="#" className="text-reset">Organic Products</a></p>
            </MDBCol>

           

            {/* Contact */}
            <MDBCol md="4" lg="3" xl="3" className="mx-auto mb-md-0 mb-4">
              <h6 className="text-uppercase fw-bold mb-4">Contact</h6>
              <p>
                <MDBIcon icon="home" className="me-2" />
                India, Kerela, Malappuram
              </p>
              <p>
                <MDBIcon icon="envelope" className="me-3" />
                support@farmdirect.com
              </p>
              <p>
                <MDBIcon icon="phone" className="me-3" />
                +91 98765 43210
              </p>
              <p>
                <MDBIcon icon="clock" className="me-3" />
                Mon - Sat: 8:00 AM - 8:00 PM
              </p>
            </MDBCol>
          </MDBRow>
        </MDBContainer>
      </section>

      {/* Copyright */}
      <div
        className="text-center p-4"
        style={{ backgroundColor: "rgba(0, 0, 0, 0.1)" }}
      >
        © {new Date().getFullYear()} FarmDirect | All Rights Reserved
      </div>
    </MDBFooter>
  );
}
