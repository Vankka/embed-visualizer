import React from "react";
import Modal from "./modal";

const CustomModal = (props) => {
  return (
    <Modal title={props.title} maxWidth="90ch" maxHeight="90%" {...props}>
      {props.children(props)}
    </Modal>
  );
};

export default CustomModal;
