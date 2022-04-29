/**
 * @jest-environment jsdom
 */

import { prettyDOM, screen } from "@testing-library/dom";
import NewBillUI from "../views/NewBillUI.js";
import NewBill from "../containers/NewBill.js";

describe("Given I am connected as an employee", () => {
  describe("When I am on NewBill Page", () => {
    test("Then ...", () => {
      const html = NewBillUI();
      document.body.innerHTML = html;
      console.log(prettyDOM());
      //to-do write assertion
    });
  });
});
