import { Atom, ReadOnlyAtom } from "@grammarly/focal";
import { PickByValue } from "utility-types";
import { PrimitiveValue } from "../primitives/types";

// export class FormPrimitive<T> {
// 	public constructor(public readonly value: Atom<T>) {}
// }

export type FormTreeRaw = {
	[key: string]: PrimitiveValue | {}
};

// export type FormTreeValue<T extends FormTreeRaw, K extends {}> =
// Record<keyof T, FormPrimitive<T[keyof T]> | FormTree<T[keyof T], K>>;

export type FormExtension<T extends FormTreeRaw, K extends {}> =
(root: Atom<T> | Atom<T[keyof T]>, path: string[] | null) => ReadOnlyAtom<K> | null;

export class FormTree<T extends FormTreeRaw, K extends {} = {}> {
	public readonly meta: ReadOnlyAtom<K> | null = null;

	// public readonly value: FormTreeValue<T, K>;

	public constructor(
		public readonly atom: Atom<T>,
		private readonly extension: FormExtension<T, K> = () => null,
		public readonly path: string[] | null = null,
	) {
		this.meta = extension(this.atom, path);

		// const initialValue = this.atom.get();
		// this.value = Object.keys(this.atom.get()).reduce((p, c) => {
		// 	const k = c as keyof T;

		// 	if (typeof initialValue[k] === "object" && initialValue[k] !== null) {
		// 		const lens = this.atom.lens(k);
		// 		const path = innerPath ? [...innerPath, c] : [c];
		// 		return {
		// 			...p,
		// 			[k]: new FormTree(lens, extension && (() => extension(lens, path)), innerPath),
		// 		};
		// 	}
		// 	return {
		// 		...p,
		// 		[k]: new FormPrimitive(this.atom.lens(k)),
		// 	};
		// }, {}) as FormTreeValue<T, K>;
	}

	public extend = <J extends {}>(extension: FormExtension<T, K & J>): FormTree<T, K & J> => {
		return new FormTree<T, K & J>(this.atom, extension);
	};

	public bind = <J extends keyof PickByValue<T, PrimitiveValue>>(key: J): Atom<PickByValue<T, PrimitiveValue>[J]> => {
		return this.atom.lens(key);
	};

	public getSubform = <J extends keyof PickByValue<T, {}>>(key: J): FormTree<PickByValue<T, {}>[J]> => {
		const lens = this.atom.lens(key);
		const nextPath = this.path ? [...this.path, key as string] : [key as string];

		return new FormTree(lens, () => this.extension(lens, nextPath), nextPath);
	};
}

