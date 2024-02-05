import React from 'react';

import Modal from 'react-bootstrap/Modal';

const ErrorModal = props => {
  return (
    <Modal
      onHide={props.onClear}
      
      show={!!props.error}
    >
      <p style={{margin:'10px'}}>{props.error}</p>
    </Modal>
  );
};

export default ErrorModal;
