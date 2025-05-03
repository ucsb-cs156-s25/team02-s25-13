import React from "react";
import { useBackend } from "main/utils/useBackend";

import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import HelpRequestTable from "main/components/HelpRequest/HelpRequestTable";
import { Button } from "react-bootstrap";
import { useCurrentUser, hasRole } from "main/utils/currentUser";

export default function HelpRequestIndexPage() {
  const currentUser = useCurrentUser();

  const {
    data: requests,
    error: _error,
    status: _status,
  } = useBackend(
    // Stryker disable next-line all : don't test internal caching of React Query
    ["/api/help_request/all"],
    { method: "GET", url: "/api/help_request/all" },
    // Stryker disable next-line all : don't test default value of empty list
    [],
  );

  const createButton = () => {
    if (hasRole(currentUser, "ROLE_ADMIN")) {
      return (
        <Button
          variant="primary"
          href="/help_request/create"
          style={{ float: "right" }}
        >
          Create HelpRequest
        </Button>
      );
    }
  };

  return (
    <BasicLayout>
      <div className="pt-2">
        {createButton()}
        <h1>HelpRequest</h1>
        <HelpRequestTable requests={requests} currentUser={currentUser} />
      </div>
    </BasicLayout>
  );
}
