import React from "react";
import { render, act, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { Atom } from "@grammarly/focal";
import { Input } from "./index";
import { FormTree } from "../../form-tree";

type SignInForm = {
	login: string,
};

const createSignInForm = (): FormTree<SignInForm> => new FormTree<SignInForm>(Atom.create({
	login: "",
}));

describe("primitives/input", () => {
	test("input value changes as observable value changes", () => {
		const signInForm = createSignInForm();

		const testLogin = "John Doe";
		const binding = signInForm.bind("login");
		act(() => {
			render(<Input data-testid="login" atom={binding} />);
		});
		expect(screen.getByTestId("login")).toHaveValue("");
		binding.set(testLogin);
		expect(screen.getByTestId("login")).toHaveValue(testLogin);
	});

	test("form value should react to wild world", () => {
		const signInForm = createSignInForm();

		const binding = signInForm.bind("login");
		const testLogin = "John Doe";
		act(() => {
			render(<Input data-testid="login" atom={binding} />);
		});
		expect(binding.get()).toEqual("");
		act(() => {
			userEvent.type(screen.getByTestId("login"), testLogin);
		});
		expect(binding.get()).toEqual(testLogin);
	});
});
