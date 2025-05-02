import React from "react";
import { useBackend } from "main/utils/useBackend";

import BasicLayout from "main/layouts/BasicLayout/BasicLayout";
import UCSBDiningCommonsMenuItemTable from "main/components/UCSBDiningCommonsMenuItems/UCSBDiningCommonsMenuItemTable";
import { useCurrentUser, hasRole } from "main/utils/currentUser";
import { Button } from "react-bootstrap";

export default function RestaurantIndexPage() {
  const currentUser = useCurrentUser();

  const {
    data: ucsbDiningCommonsMenuItems,
    error: _error,
    status: _status,
  } = useBackend(
    // Stryker disable next-line all : don't test internal caching of React Query
    ["/api/ucsbdiningcommonsmenuitems/all"],
    { method: "GET", url: "/api/ucsbdiningcommonsmenuitems/all" },
    // Stryker disable next-line all : don't test default value of empty list
    [],
  );

  const createButton = () => {
    if (hasRole(currentUser, "ROLE_ADMIN")) {
      return (
        <Button
          variant="primary"
          href="/ucsbdiningcommonsmenuitems/create"
          style={{ float: "right" }}
        >
          Create Menu Item
        </Button>
      );
    }
  };

  return (
    <BasicLayout>
      <div className="pt-2">
        {createButton()}
        <h1>UCSB Dining Commons Menu Items</h1>
        <UCSBDiningCommonsMenuItemTable
          ucsbDiningCommonsMenuItems={ucsbDiningCommonsMenuItems}
          currentUser={currentUser}
        />
      </div>
    </BasicLayout>
  );
}
