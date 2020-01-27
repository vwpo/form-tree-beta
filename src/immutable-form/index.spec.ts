import { ImmutableForm } from "./index";
import { Field } from "../field";
import { FormChild } from "../form-child";

type SignInFormSchema = {
	login: string,
	password: string
};

type SignInFormExtendedSchema = {
	data: {
		login: string,
		password: string,
	}
};

describe("immutable-form", () => {
	test("it creates ImmutableForm and returns simple Field object", () => {
		return new Promise((done) => {
			const value = {
				login: "",
				password: "",
			};

			const form = new ImmutableForm<SignInFormSchema>(value);
			const binding = form.bind("login");

			binding.subscribe((bind) => {
				expect(bind).toHaveProperty("field");
				// eslint-disable-next-line no-undef
				expect(bind?.field).toBeInstanceOf(Field);
				done();
			});
		});
	});

	test("it creates ImmutableForm and returns FormChild object", () => {
		return new Promise((done) => {
			const value: SignInFormExtendedSchema = {
				data: {
					login: "",
					password: "",
				},
			};

			const form = new ImmutableForm(value);
			const binding = form.bind("data");
			binding.subscribe((bind) => {
				expect(bind).toHaveProperty("childForm");
				// eslint-disable-next-line no-undef
				expect(bind?.childForm).toBeInstanceOf(FormChild);
				done();
			});
		});
	});
});
