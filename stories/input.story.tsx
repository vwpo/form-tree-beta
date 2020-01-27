import React, { useEffect, useMemo } from "react";
import { storiesOf } from "@storybook/react";
import { Atom, F } from "@grammarly/focal";
import { Input, InputProps } from "../src/primitives/input";
import { FormTree } from "../src/form-tree";

type SignInFormSchema = {
	login: string
};

const signInForm: SignInFormSchema = {
	login: "",
};

const form = new FormTree(Atom.create(signInForm));

const InputWrapper: React.FC<Partial<InputProps<string>>> = (props) => {
	useEffect(() => {
		form.atom.subscribe((next) => {
			console.log(next);
		});
	}, []);

	const binding = useMemo(() => form.bind("login"), [form]);
	return (
		<>
			<Input atom={form.bind("login")} placeholder="Enter value" {...props} />
			<hr />
			<F.span>
				{binding}
			</F.span>
		</>
	);
};

storiesOf("Input", module)
	.add("basic", () => <InputWrapper />);
