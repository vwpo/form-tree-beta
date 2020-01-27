import { Atom } from "@grammarly/focal";
import { FormTree, FormExtension } from "./index";

type SignInSchema = {
	login: string,
	password: string
};

const signInDefault: SignInSchema = {
	login: "",
	password: "",
};

const fieldNumberExtension: FormExtension<any, {
	fieldCount: number
}> = (formAtom) => {
	return formAtom.view((val) => {
		return {
			fieldCount: Object.keys(val).reduce((p) => p + 1, 0),
		};
	});
};

describe("form-tree", () => {
	test("should create simple tree and test initial values", () => {
		const form = new FormTree(Atom.create(signInDefault));

		expect(form.atom.get()).toEqual(signInDefault);
		expect(form.meta).toEqual(null);

		expect(form.bind("login").get()).toEqual("");
		expect(form.bind("password").get()).toEqual("");
	});

	test("should create complex tree and test initial values", () => {
		const form = new FormTree(Atom.create({
			data: signInDefault,
		}));

		expect(form.atom.get()).toEqual({
			data: signInDefault,
		});
		const sub = form.getSubform("data");
		expect(sub).toBeInstanceOf(FormTree);

		expect(sub.bind("login").get()).toEqual("");
		expect(sub.bind("password").get()).toEqual("");
	});

	test("should create simple tree and test meta calculations", () => {
		const form = new FormTree(Atom.create(signInDefault), fieldNumberExtension);

		if (form.meta) {
			const meta = form.meta.get();
			expect(meta).toEqual({
				fieldCount: 2,
			});
			form.atom.set({
				...signInDefault,
				// @ts-ignore
				thirdField: "",
			});
			const nextMeta = form.meta.get();
			expect(nextMeta).toEqual({
				fieldCount: 3,
			});
		} else {
			throw new Error("No meta");
		}
	});

	test("should dynamically extend form tree with decorator", () => {
		const form = new FormTree(Atom.create(signInDefault));

		expect(form.meta).toEqual(null);

		const extendedForm = form.extend(fieldNumberExtension);

		if (extendedForm.meta) {
			const metaVal = extendedForm.meta.get();

			expect(metaVal).toEqual({
				fieldCount: 2,
			});
		} else {
			throw new Error("No meta defined");
		}
	});
});
