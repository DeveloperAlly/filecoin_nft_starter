import React from "react";
import { Message, Icon } from "semantic-ui-react";

const StatusMessage = ({ status, ...props }) => {
  console.log("loading status", status);
  return (
    <div style={{ height: "100px" }}>
      {status ? (
        <div>
          <Message
            compact
            icon
            negative={Boolean(status.error)}
            success={Boolean(status.success) && !Boolean(status.loading)}
            info={Boolean(status.loading)}
            warning={Boolean(status.warning)}
          >
            <Icon
              name={
                status.loading
                  ? "circle notched"
                  : status.error
                  ? "times circle"
                  : status.success
                  ? "check circle"
                  : "exclamation circle"
              }
              loading={Boolean(status.loading)}
            />
            <Message.Content>
              {Boolean(status.success) && !Boolean(status.loading) && (
                <Message.Header>Transaction Success!</Message.Header>
              )}
              {status.loading
                ? status.loading
                : status.error
                ? status.error
                : status.success
                ? status.success
                : status.warning}
            </Message.Content>
          </Message>
        </div>
      ) : null}
    </div>
  );
};

export default StatusMessage;
