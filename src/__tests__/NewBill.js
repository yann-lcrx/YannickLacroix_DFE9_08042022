/**
 * @jest-environment jsdom
 */

import { prettyDOM, screen } from "@testing-library/dom";
import NewBillUI from "../views/NewBillUI.js";
import NewBill from "../containers/NewBill.js";
import userEvent from "@testing-library/user-event";
import mockStore from "../__mocks__/store.js";
import { localStorageMock } from "../__mocks__/localStorage.js";
import router from "../app/Router.js";
import { ROUTES, ROUTES_PATH } from "../constants/routes";
import { listen } from "express/lib/application";

jest.mock("../app/store", () => mockStore);

beforeEach(() => {
  localStorage.setItem(
    "user",
    JSON.stringify({ type: "Employee", email: "a@a" })
  );
  const root = document.createElement("div");
  root.setAttribute("id", "root");
  document.body.append(root);
  router();
  window.onNavigate(ROUTES_PATH.NewBill);
});

afterEach(() => {
  jest.clearAllMocks();
  document.body.innerHTML = "";
});

const file = new File(["hello"], "hello.png", { type: "image/png" });

describe("Given I am connected as an employee", () => {
  describe("When I upload a file that is not a jpeg or png image", () => {
    test("then the new file should be uploaded", () => {
      const fileInput = screen.getByTestId("file");
      userEvent.upload(fileInput, file);

      expect(fileInput.files[0]).toStrictEqual(file);
      expect(fileInput.files.item(0)).toStrictEqual(file);
      expect(fileInput.files).toHaveLength(1);
    });
  });

  describe('When I fill out the NewBill Page and select "envoyer"', () => {
    const date = new Date();
    test("submits the form and navigates back to /bills", async () => {
      userEvent.click(screen.getByTestId("expense-type"));
      userEvent.click(screen.getByText("Transports"));

      userEvent.type(screen.getByTestId("expense-name"), "dépense test");

      screen.getByTestId("datepicker").value = date;

      userEvent.type(screen.getByTestId("amount"), "700");
      userEvent.type(screen.getByTestId("vat"), "70");
      userEvent.type(screen.getByTestId("pct"), "20");

      userEvent.type(
        screen.getByTestId("commentary"),
        "description de la dépense"
      );

      userEvent.upload(screen.getByTestId("file"), file);

      userEvent.click(screen.getByText("Envoyer"));

      expect(window.location.href).toEqual("http://localhost/#employee/bills");
      expect(await screen.findByText("Mes notes de frais")).toBeTruthy();
    });
  });
});
