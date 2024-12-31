import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHouse } from "@fortawesome/free-solid-svg-icons";

const Breadcrumb = ({ pageTitle = "Dashboard", breadcrumb = "Dashboard" }) => {
  return (
    <div className="container-fluid">
      <div className="page-title">
        <div className="row">
          <div className="col-xl-4 col-sm-7 box-col-3">
            <h3>{pageTitle}</h3>
          </div>
          <div className="col-5 d-none d-xl-block">
            <div className="left-header main-sub-header p-0">
              <div className="left-menu-header">
                <ul className="header-left">
                  <li className="onhover-dropdown">
                    {" "}
                    <span className="f-w-700">HR </span>
                    <ul className="onhover-show-div left-dropdown">
                      <li className="flyout-right">
                        <a href="#">Leave Planner</a>
                        <i className="fa fa-angle-right" />
                        <ul>
                          <li>
                            {" "}
                            <a href="index.html">New Leave Plan</a>
                          </li>
                          <li>
                            {" "}
                            <a href="dashboard-02.html">My Plans</a>
                          </li>
                        </ul>
                      </li>
                      <li className="flyout-right">
                        <a href="#">Leave Management</a>
                        <i className="fa fa-angle-right" />
                        <ul>
                          <li>
                            <a href="general-widget.html">New Leave Request</a>
                          </li>
                          <li>
                            {" "}
                            <a href="chart-widget.html">My Applications</a>
                          </li>
                        </ul>
                      </li>
                      <li className="flyout-right">
                        {" "}
                        <a href="#">Leave Adjustment</a>
                        <i className="fa fa-angle-right" />
                        <ul>
                          <li>
                            {" "}
                            <a href="box-layout.html">New Adjustment </a>
                          </li>
                          <li>
                            {" "}
                            <a href="layout-rtl.html">My Adjustments</a>
                          </li>
                        </ul>
                      </li>
                    </ul>
                  </li>
                  <li className="onhover-dropdown">
                    <span className="f-w-700">Reports</span>
                    <ul className="onhover-show-div left-dropdown">
                      <li className="flyout-right">
                        <a href="#">Leave</a>
                        <ul>
                          <li>
                            <a href="typography.html">Reports</a>
                          </li>
                          <li>
                            <a href="avatars.html">Reports</a>
                          </li>
                        </ul>
                        <i className="fa fa-angle-right" />
                      </li>
                      <li className="flyout-right">
                        <a href="#">Timesheet</a>
                        <ul>
                          <li>
                            <a href="scrollable.html">Reports</a>
                          </li>
                          <li>
                            <a href="tree.html">Reports</a>
                          </li>
                        </ul>
                        <i className="fa fa-angle-right" />
                      </li>
                      <li className="flyout-right">
                        <a href="#">Policies</a>
                        <ul>
                          <li>
                            <a href="animate.html">Reports</a>
                          </li>
                          <li>
                            <a href="scroll-reval.html">Reports</a>
                          </li>
                        </ul>
                        <i className="fa fa-angle-right" />
                      </li>

                      <li className="flyout-right">
                        <a href="#">Documentation</a>
                        <ul>
                          <li>
                            <a href="buttons.html">Reports</a>
                          </li>
                          <li>
                            <a href="button-group.html">Reports</a>
                          </li>
                        </ul>
                        <i className="fa fa-angle-right" />
                      </li>
                    </ul>
                  </li>
                  <li className="onhover-dropdown">
                    {" "}
                    <span className="f-w-700">Approvals</span>
                    <ul className="onhover-show-div left-dropdown">
                      <li>
                        <a href="file-manager.html">All Requests</a>
                      </li>
                    </ul>
                  </li>

                  <li className="onhover-dropdown p-0">
                    <span className="f-w-700">Miscellaneous</span>
                    <ul className="onhover-show-div left-dropdown">
                      <li className="flyout-right">
                        <a href="#">Gallery</a>
                        <ul>
                          <li>
                            <a href="gallery.html">Gallery Grid</a>
                          </li>
                          <li>
                            <a href="gallery-with-description.html">
                              gallery-with-description
                            </a>
                          </li>
                          <li>
                            <a href="gallery-masonry.html">gallery-masonry</a>
                          </li>
                          <li>
                            <a href="masonry-gallery-with-disc.html">
                              masonry-gallery-with-disc
                            </a>
                          </li>
                          <li>
                            <a href="gallery-hover.html">gallery-hover</a>
                          </li>
                        </ul>
                        <i className="fa fa-angle-right" />
                      </li>
                      <li className="flyout-right">
                        <a href="#">Blog</a>
                        <ul>
                          <li>
                            <a href="blog.html">blog</a>
                          </li>
                          <li>
                            <a href="blog-single.html">blog-single</a>
                          </li>
                          <li>
                            <a href="add-post.html">add-post</a>
                          </li>
                        </ul>
                        <i className="fa fa-angle-right" />
                      </li>
                      <li>
                        <a href="FAQ.html">FAQ</a>
                      </li>
                      <li className="flyout-right">
                        <a href="#">Job Search</a>
                        <ul>
                          <li>
                            <a href="job-cards-view.html">job-cards-view</a>
                          </li>
                          <li>
                            <a href="job-list-view.html">job-list-view</a>
                          </li>
                          <li>
                            <a href="job-details.html">job-details</a>
                          </li>
                          <li>
                            <a href="job-apply.html">job-apply</a>
                          </li>
                        </ul>
                        <i className="fa fa-angle-right" />
                      </li>
                      <li className="flyout-right">
                        <a href="#">Job Search</a>
                        <ul>
                          <li>
                            <a href="job-cards-view.html">learning-list</a>
                          </li>
                          <li>
                            <a href="learning-detailed.html">
                              learning-detailed
                            </a>
                          </li>
                        </ul>
                        <i className="fa fa-angle-right" />
                      </li>
                      <li className="flyout-right">
                        <a href="#">Maps</a>
                        <ul>
                          <li>
                            <a href="map-js.html">Map-js</a>
                          </li>
                          <li>
                            <a href="vector-map.html">Vector Maps</a>
                          </li>
                        </ul>
                        <i className="fa fa-angle-right" />
                      </li>
                      <li className="flyout-right">
                        <a href="#">Editors </a>
                        <ul>
                          <li>
                            <a href="summernote.html">Summer Note</a>
                          </li>
                          <li>
                            <a href="CK editor.html">CK editor</a>
                          </li>
                          <li>
                            <a href="simple-MDE.html">MDE editor</a>
                          </li>
                          <li>
                            <a href="ace-code-editor.html">ACE code editor </a>
                          </li>
                        </ul>
                        <i className="fa fa-angle-right"> </i>
                      </li>
                      <li>
                        <a href="knowledgebase.html">Knowledgebase </a>
                      </li>
                      <li>
                        {" "}
                        <a href="support-ticket">Support Ticket</a>
                      </li>
                    </ul>
                  </li>
                </ul>
              </div>
            </div>
            {/* Page Sub Header end
             */}
          </div>
          <div className="col-xl-3 col-sm-5 box-col-4">
            <ol className="breadcrumb">
              <li className="breadcrumb-item">
                <a href="index.html">
                  <FontAwesomeIcon icon={faHouse} />
                </a>
              </li>
              <li className="breadcrumb-item">{breadcrumb}</li>
            </ol>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Breadcrumb;
