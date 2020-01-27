import React, { useEffect, useMemo } from "react";
import { storiesOf } from "@storybook/react";
import { F, Atom } from "@grammarly/focal";
import { useObservable } from "rxjs-hooks";
import { Input } from "../src/primitives/input";
import { FormTree } from "../src/form-tree";

type InfoSchema = {
	age: null | number
};

type SignInFormSchema = {
	login: string,
	info: InfoSchema
};

const signInForm: SignInFormSchema = {
	login: "",
	info: {
		age: null,
	},
};

const form = new FormTree(Atom.create(signInForm));

const ComplexForm: React.FC = () => {
	useEffect(() => {
		form.atom.subscribe((next) => {
			console.log(next);
		});
	}, []);

	const infoForm = useMemo(() => form.getSubform("info"), []);
	const val = useObservable(() => form.atom);

	return (
		<>
			<Input atom={form.bind("login")} placeholder="Enter value" />
			<h3>Info</h3>
			<Input atom={infoForm.bind("age")} placeholder="Enter age" />
			<hr />
			<F.span>
				{JSON.stringify(val)}
			</F.span>
		</>
	);
};

storiesOf("Complex form", module)
	.add("basic", () => <ComplexForm />);
