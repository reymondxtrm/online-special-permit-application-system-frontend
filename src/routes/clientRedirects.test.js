import React from "react";
import { render } from "@testing-library/react";
import { MemoryRouter, Route, Switch } from "react-router-dom";
import { authProtectedRoutes } from "./index";

// Route modules import realtime clients at load time; not needed here.
jest.mock("pusher-js", () => jest.fn().mockImplementation(() => ({})));
jest.mock("laravel-echo", () => jest.fn().mockImplementation(() => ({})));

const OLD = [
  "/client/dashboard",
  "/client/pending",
  "/client/for-payment/approval",
  "/client/for-payment/dashboard",
  "/client/returned/dashboard",
  "/client/for-signature",
  "/client/declined",
];

test("new page route exists", () => {
  expect(authProtectedRoutes.some((r) => r.path === "/client/applications")).toBe(true);
});

test.each(OLD)("%s redirects to /client/applications", (path) => {
  const route = authProtectedRoutes.find((r) => r.path === path);
  expect(route).toBeTruthy();
  let landed;
  render(
    <MemoryRouter initialEntries={[path]}>
      <Switch>
        <Route exact path={path} component={route.component} />
        <Route
          path="*"
          render={({ location }) => {
            landed = location.pathname;
            return null;
          }}
        />
      </Switch>
    </MemoryRouter>,
  );
  expect(landed).toBe("/client/applications");
});
