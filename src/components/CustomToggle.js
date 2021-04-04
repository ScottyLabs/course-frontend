import React, { useContext } from "react";
import {
  AccordionContext,
  useAccordionToggle,
  Card,
  Button,
} from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretDown, faTimes } from "@fortawesome/free-solid-svg-icons";

export const CustomToggle = ({ children, eventKey, callback }) => {
  const currentEventKey = useContext(AccordionContext);

  const decoratedOnClick = useAccordionToggle(eventKey, null);

  const isCurrentEventKey = currentEventKey === eventKey;

  return (
    <Card.Header>
      {isCurrentEventKey ? (
        <FontAwesomeIcon
          size="lg"
          onClick={decoratedOnClick}
          icon={faCaretDown}
          className="mr-2 icon-button"
        />
      ) : (
        <FontAwesomeIcon
          size="lg"
          onClick={decoratedOnClick}
          icon={faCaretDown}
          className="mr-2 icon-button"
          transform={{ rotate: -90 }}
        />
      )}
      {children}
      {callback ? (
        <FontAwesomeIcon
          icon={faTimes}
          className="float-right mt-1 icon-button"
          onClick={callback}
        />
      ) : null}
    </Card.Header>
  );
};
