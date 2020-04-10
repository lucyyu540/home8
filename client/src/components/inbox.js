import React, { Fragment } from "react";
import { useAuth0 } from "../react-auth0-spa";

export default function Inbox() {
  const { loading, user } = useAuth0();

  if (loading || !user) {
    return <div>Loading Inbox...</div>;
  }

  return (
    <Fragment>
      <h2>Inbox</h2>
    </Fragment>
  );
};

