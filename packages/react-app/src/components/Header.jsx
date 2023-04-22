import { PageHeader } from "antd";
import React from "react";

// displays a page header

export default function Header() {
  return (
    <a href="/">
      <div style={{ position: "absolute", left: -20, top: -8 }}>
        <img src="test-miloogy2.svg" width="130" height="130" alt="Miloogy" />
      </div>
      <PageHeader
        title={<div style={{ marginLeft: 80 }}>Miloogy Maker</div>}
        subTitle="an unusual love story"
        style={{ cursor: "pointer" }}
      />
    </a>
  );
}
