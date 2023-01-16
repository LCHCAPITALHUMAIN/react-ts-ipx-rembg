import React, { FC, useState } from 'react';

type Props = {
  show: boolean;
};
const Modal: React.FC<Props> = ({ show }) => {
  return (
    <div
      className="Modal"
      style={{
        transform: show ? 'translateY(0)' : 'translateY(-100vh)',
        opacity: show ? '1' : '0',
      }}
    ></div>
  );
};

export default Modal;
