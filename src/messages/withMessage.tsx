import React from "react";

const withMessage = <P extends { onDone(): void; }>(
  Component: React.ComponentType<Omit<P, "onDone">>
) => ({ onDone, ...passdownProps }: P) => {
  return (
    <div className="message" onClick={onDone}>
      <Component {...passdownProps} />
    </div>
  );
};

export default withMessage;
