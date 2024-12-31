import React from "react";
import Breadcrumb from "./Layout/Breadcrumb";


const Documentation = () => {
  return (
    <div>
      <Breadcrumb pageTitle="Documentation" breadcrumb="Leave Planner" />
      <div className="container-fluid">
        <div className="row">
          <div className="col-sm-12">
            <div className="card">
              <div className="card-body">
                <div className="horizontal-wizard-wrapper">
                  <div className="row g-3">
                    <div className="col-12 main-horizontal-header">
                      <div
                        className="nav nav-pills horizontal-options"
                        id="horizontal-wizard-tab"
                        role="tablist"
                        aria-orientation="vertical"
                      >
                        <a
                          className="nav-link active"
                          id="wizard-info-tab"
                          data-bs-toggle="pill"
                          href="#wizard-info"
                          role="tab"
                          aria-controls="wizard-info"
                          aria-selected="true"
                        >
                          <div className="horizontal-wizard">
                            <div className="stroke-icon-wizard">
                              <i className="fa fa-user" />
                            </div>
                            <div className="horizontal-wizard-content">
                              <h6>Personal info</h6>
                            </div>
                          </div>
                        </a>
                        <a
                          className="nav-link"
                          id="bank-wizard-tab"
                          data-bs-toggle="pill"
                          href="#bank-wizard"
                          role="tab"
                          aria-controls="bank-wizard"
                          aria-selected="false"
                        >
                          <div className="horizontal-wizard">
                            <div className="stroke-icon-wizard">
                              <i className="fa fa-chain-broken" />
                            </div>
                            <div className="horizontal-wizard-content">
                              <h6>Connect bank account</h6>
                            </div>
                          </div>
                        </a>
                        <a
                          className="nav-link"
                          id="inquiry-wizard-tab"
                          data-bs-toggle="pill"
                          href="#inquiry-wizard"
                          role="tab"
                          aria-controls="inquiry-wizard"
                          aria-selected="false"
                        >
                          <div className="horizontal-wizard">
                            <div className="stroke-icon-wizard">
                              <i className="fa fa-group" />
                            </div>
                            <div className="horizontal-wizard-content">
                              <h6>Inquiries</h6>
                            </div>
                          </div>
                        </a>
                        <a
                          className="nav-link"
                          id="successful-wizard-tab"
                          data-bs-toggle="pill"
                          href="#successful-wizard"
                          role="tab"
                          aria-controls="successful-wizard"
                          aria-selected="false"
                        >
                          <div className="horizontal-wizard">
                            <div className="stroke-icon-wizard">
                              <i className="fa fa-group" />
                            </div>
                            <div className="horizontal-wizard-content">
                              <h6>Completed </h6>
                            </div>
                          </div>
                        </a>
                      </div>
                    </div>
                    <div className="col-12">
                      <div
                        className="tab-content dark-field"
                        id="horizontal-wizard-tabContent"
                      >
                        <div
                          className="tab-pane fade show active"
                          id="wizard-info"
                          role="tabpanel"
                          aria-labelledby="wizard-info-tab"
                        >
                          <form
                            className="row g-3 needs-validation"
                            noValidate=""
                          >
                            <div className="col-xl-4 col-sm-6">
                              <label
                                className="form-label"
                                htmlFor="customFirstname"
                              >
                                First Name<span className="txt-danger">*</span>
                              </label>
                              <input
                                className="form-control"
                                id="customFirstname"
                                type="text"
                                placeholder="Enter first name"
                                required=""
                              />
                              <div className="valid-feedback">Looks good!</div>
                            </div>
                            <div className="col-xl-4 col-sm-6">
                              <label
                                className="form-label"
                                htmlFor="customLastname"
                              >
                                Last Name<span className="txt-danger">*</span>
                              </label>
                              <input
                                className="form-control"
                                id="customLastname"
                                type="text"
                                placeholder="Enter last name"
                                required=""
                              />
                              <div className="valid-feedback">Looks good!</div>
                            </div>
                            <div className="col-xl-4 col-12">
                              <label
                                className="form-label"
                                htmlFor="customEmail"
                              >
                                Email<span className="txt-danger">*</span>
                              </label>
                              <input
                                className="form-control"
                                id="customEmail"
                                type="email"
                                required=""
                                placeholder="Zono@example.com"
                              />
                              <div className="valid-feedback">Looks good!</div>
                            </div>
                            <div className="col-xl-5 col-sm-4">
                              <label
                                className="form-label"
                                htmlFor="customState-wizard"
                              >
                                State
                              </label>
                              <select
                                className="form-select"
                                id="customState-wizard"
                                required=""
                              >
                                <option selected="" disabled="" value="">
                                  Choose...
                                </option>
                                <option>USA </option>
                                <option>U.K </option>
                                <option>U.S</option>
                              </select>
                              <div className="invalid-feedback">
                                Please select a valid state.
                              </div>
                            </div>
                            <div className="col-xl-3 col-sm-4">
                              <label
                                className="form-label"
                                htmlFor="custom-zipcode"
                              >
                                Zip Code
                              </label>
                              <input
                                className="form-control"
                                id="custom-zipcode"
                                type="text"
                                required=""
                              />
                              <div className="invalid-feedback">
                                Please provide a valid zip.
                              </div>
                            </div>
                            <div className="col-sm-4">
                              <label
                                className="form-label"
                                htmlFor="customContact1"
                              >
                                Contact Number
                              </label>
                              <input
                                className="form-control"
                                id="customContact1"
                                type="number"
                                placeholder="Enter number"
                                required=""
                              />
                              <div className="valid-feedback">Looks good!</div>
                            </div>
                            <div className="col-12">
                              <div className="form-check">
                                <input
                                  className="form-check-input"
                                  id="invalid-check-wizard"
                                  type="checkbox"
                                  defaultValue=""
                                  required=""
                                />
                                <label
                                  className="form-check-label mb-0 d-block"
                                  htmlFor="invalid-check-wizard"
                                >
                                  Agree to terms and conditions
                                </label>
                                <div className="invalid-feedback">
                                  You must agree before submitting.
                                </div>
                              </div>
                            </div>
                            <div className="col-12 text-end">
                              <button className="btn btn-primary">
                                Continue
                              </button>
                            </div>
                          </form>
                        </div>
                        <div
                          className="tab-pane fade"
                          id="bank-wizard"
                          role="tabpanel"
                          aria-labelledby="bank-wizard-tab"
                        >
                          <form
                            className="row g-3 needs-validation"
                            noValidate=""
                          >
                            <div className="col-sm-6 bank-search">
                              <label
                                className="form-label"
                                htmlFor="aadharnumber-wizard"
                              >
                                Aadhaar Number
                                <span className="txt-danger">*</span>
                              </label>
                              <input
                                className="form-control"
                                id="aadharnumber-wizard"
                                type="Search"
                                placeholder="xxxx xxxx xxxx xxxx"
                                required=""
                              />
                              <div className="valid-feedback">Looks good!</div>
                            </div>
                            <div className="col-sm-6 bank-search">
                              <label
                                className="form-label"
                                htmlFor="pan-wizard"
                              >
                                PAN<span className="txt-danger">*</span>
                              </label>
                              <input
                                className="form-control"
                                id="pan-wizard"
                                type="Search"
                                placeholder="xxxxxxxxxx"
                                required=""
                              />
                              <div className="valid-feedback">Looks good!</div>
                            </div>
                            <div className="col-12">
                              <h6>Choose from these popular banks</h6>
                              <div className="bank-selection">
                                <div className="form-check radio radio-primary ps-0">
                                  <ul className="radio-wrapper">
                                    <li>
                                      <input
                                        className="form-check-input"
                                        id="radio-wizard-1"
                                        type="radio"
                                        name="radio2"
                                        defaultValue="option2"
                                      />
                                      <label
                                        className="form-check-label"
                                        htmlFor="radio-wizard-1"
                                      >
                                        <img
                                          src="../assets/images/forms/hdfc.png"
                                          alt="HDFC"
                                        />
                                        <span>ABC BANK</span>
                                      </label>
                                    </li>
                                    <li>
                                      <input
                                        className="form-check-input"
                                        id="radio-wizard-2"
                                        type="radio"
                                        name="radio2"
                                        defaultValue="option2"
                                        defaultChecked=""
                                      />
                                      <label
                                        className="form-check-label"
                                        htmlFor="radio-wizard-2"
                                      >
                                        <img
                                          src="../assets/images/forms/Bank-of-Baroda.png"
                                          alt="Bank-of-Baroda"
                                        />
                                        <span>XYZ BANK</span>
                                      </label>
                                    </li>
                                    <li>
                                      <input
                                        className="form-check-input"
                                        id="radio-wizard-3"
                                        type="radio"
                                        name="radio2"
                                        defaultValue="option2"
                                      />
                                      <label
                                        className="form-check-label"
                                        htmlFor="radio-wizard-3"
                                      >
                                        <img
                                          src="../assets/images/forms/idbi.png"
                                          alt="IDBI"
                                        />
                                        <span>PQR BANK</span>
                                      </label>
                                    </li>
                                    <li>
                                      <input
                                        className="form-check-input"
                                        id="radio-wizard-4"
                                        type="radio"
                                        name="radio2"
                                        defaultValue="option2"
                                      />
                                      <label
                                        className="form-check-label"
                                        htmlFor="radio-wizard-4"
                                      >
                                        <img
                                          src="../assets/images/forms/rbl.png"
                                          alt="RBL"
                                        />
                                        <span>DEF BANK</span>
                                      </label>
                                    </li>
                                    <li>
                                      <input
                                        className="form-check-input"
                                        id="radio-wizard-5"
                                        type="radio"
                                        name="radio2"
                                        defaultValue="option2"
                                      />
                                      <label
                                        className="form-check-label"
                                        htmlFor="radio-wizard-5"
                                      >
                                        <img
                                          src="../assets/images/forms/us-bank.png"
                                          alt="US"
                                        />
                                        <span>MNO BANK</span>
                                      </label>
                                    </li>
                                    <li>
                                      <input
                                        className="form-check-input"
                                        id="radio-wizard-6"
                                        type="radio"
                                        name="radio2"
                                        defaultValue="option2"
                                      />
                                      <label
                                        className="form-check-label"
                                        htmlFor="radio-wizard-6"
                                      >
                                        <img
                                          src="../assets/images/forms/axis.png"
                                          alt="Axis"
                                        />
                                        <span>WXY BANK</span>
                                      </label>
                                    </li>
                                    <li>
                                      <input
                                        className="form-check-input"
                                        id="radio-wizard-7"
                                        type="radio"
                                        name="radio2"
                                        defaultValue="option2"
                                      />
                                      <label
                                        className="form-check-label"
                                        htmlFor="radio-wizard-7"
                                      >
                                        <img
                                          src="../assets/images/forms/SCB.png"
                                          alt="SCB"
                                        />
                                        <span>STD BANK</span>
                                      </label>
                                    </li>
                                  </ul>
                                </div>
                              </div>
                            </div>
                            <div className="col-12 text-end">
                              <button className="btn btn-primary">
                                Previous
                              </button>
                              <button className="btn btn-primary">
                                Continue
                              </button>
                            </div>
                          </form>
                        </div>
                        <div
                          className="tab-pane fade"
                          id="inquiry-wizard"
                          role="tabpanel"
                          aria-labelledby="inquiry-wizard-tab"
                        >
                          <form
                            className="row g-3 needs-validation"
                            noValidate=""
                          >
                            <div className="col-12 inquiries-form">
                              <div className="row">
                                <div className="col-md-6">
                                  <p className="f-w-600">
                                    Select the option how you want to receive
                                    important notifications.
                                  </p>
                                  <div className="choose-option">
                                    <div className="form-check radio radio-primary">
                                      <input
                                        className="form-check-input me-2"
                                        id="notification1"
                                        type="radio"
                                        name="inlineRadioOptions"
                                        defaultValue="option1"
                                      />
                                      <label
                                        className="form-check-label"
                                        htmlFor="notification1"
                                      >
                                        Featured Items
                                      </label>
                                    </div>
                                    <div className="form-check radio radio-primary">
                                      <input
                                        className="form-check-input me-2"
                                        id="notification2"
                                        type="radio"
                                        name="inlineRadioOptions"
                                        defaultValue="option2"
                                      />
                                      <label
                                        className="form-check-label"
                                        htmlFor="notification2"
                                      >
                                        Newsletters
                                      </label>
                                    </div>
                                    <div className="form-check radio radio-primary">
                                      <input
                                        className="form-check-input me-2"
                                        id="notification3"
                                        type="radio"
                                        name="inlineRadioOptions"
                                        defaultValue="option3"
                                      />
                                      <label
                                        className="form-check-label"
                                        htmlFor="notification3"
                                      >
                                        Notifications
                                      </label>
                                    </div>
                                    <div className="form-check radio radio-primary">
                                      <input
                                        className="form-check-input me-2"
                                        id="notification4"
                                        type="radio"
                                        name="inlineRadioOptions"
                                        defaultValue="option3"
                                      />
                                      <label
                                        className="form-check-label"
                                        htmlFor="notification4"
                                      >
                                        Blogs
                                      </label>
                                    </div>
                                  </div>
                                </div>
                                <div className="col-md-6">
                                  <div className="row g-3">
                                    <div className="col-12">
                                      <label className="form-label">
                                        Email
                                        <span className="txt-danger">*</span>
                                      </label>
                                      <input
                                        className="form-control"
                                        type="text"
                                        placeholder="org@support.com"
                                        required="required"
                                      />
                                    </div>
                                    <div className="col-12">
                                      <label
                                        className="form-label"
                                        htmlFor="customContact2"
                                      >
                                        Contact Number
                                      </label>
                                      <input
                                        className="form-control"
                                        id="customContact2"
                                        type="number"
                                        placeholder="Enter number"
                                        required=""
                                      />
                                      <div className="valid-feedback">
                                        Looks good!
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                            <div className="col-12">
                              <label
                                className="form-label f-w-600"
                                htmlFor="FormControlTextarea2"
                              >
                                If no, could you please describe?
                              </label>
                              <textarea
                                className="form-control"
                                id="FormControlTextarea2"
                                rows={3}
                                defaultValue={""}
                              />
                            </div>
                            <div className="col-12 text-end">
                              <button className="btn btn-primary">
                                Previous
                              </button>
                              <button className="btn btn-primary">
                                Continue{" "}
                              </button>
                            </div>
                          </form>
                        </div>
                        <div
                          className="tab-pane fade"
                          id="successful-wizard"
                          role="tabpanel"
                          aria-labelledby="successful-wizard-tab"
                        >
                          <div className="form-completed">
                            <img
                              src="../assets/images/gif/dashboard-8/successful.gif"
                              alt="successful"
                            />
                            <h6>Successfully Completed</h6>
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
    </div>
  );
};
export default Documentation;
