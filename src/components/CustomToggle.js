import React, { useContext } from "react";
import { AccordionContext, useAccordionToggle, Card } from "react-bootstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCaretDown } from "@fortawesome/free-solid-svg-icons";

export const CustomToggle = ({ children, eventKey, callback }) => {
  const currentEventKey = useContext(AccordionContext);

  const decoratedOnClick = useAccordionToggle(eventKey, null);

  const isCurrentEventKey = currentEventKey === eventKey;

  return (
    <Card.Header onClick={decoratedOnClick}>
      {isCurrentEventKey ? (
        <FontAwesomeIcon icon={faCaretDown} className="mr-2" />
      ) : (
        <FontAwesomeIcon
          icon={faCaretDown}
          className="mr-2"
          transform={{ rotate: -90 }}
        />
      )}
      {children}
    </Card.Header>
  );
};
