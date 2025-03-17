import React from "react";

const SidebarSkeleton = () => {
  return (
    <div className="sidebar-wrapper" data-layout="stroke-svg">
      <div className="skeleton-loading">
        <div className="skeleton-logo" />
        <div className="skeleton-menu">
          <div className="skeleton-menu-item" />
          <div className="skeleton-menu-item" />
          <div className="skeleton-menu-item" />
        </div>
      </div>
    </div>
  );
};

export default SidebarSkeleton;
