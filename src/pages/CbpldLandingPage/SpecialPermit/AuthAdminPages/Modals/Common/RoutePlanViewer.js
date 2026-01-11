import React, { useRef, useState } from "react";
import { Button, Card, CardBody, CardHeader, Col } from "reactstrap";
import "./RoutePlanViewer.css";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
export default function RoutePlanViewer({ currentImage }) {
  return (
    <Col md={4}>
      <Card className="route-plan-card">
        <CardHeader className="route-plan-header">ROUTE PLAN</CardHeader>
        <CardBody className="route-plan-body">
          {currentImage ? (
            <div className="image-wrapper">
              <TransformWrapper>
                <TransformComponent>
                  <img src={currentImage} alt="Route Plan" />
                </TransformComponent>
              </TransformWrapper>
            </div>
          ) : (
            <p className="no-route-message">No Route Plan Available</p>
          )}
        </CardBody>
      </Card>
    </Col>
  );
}
