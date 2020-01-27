import { Atom } from "@grammarly/focal";

export class Field<T extends any, Meta extends {}> {
	public readonly value: Atom<T>;

	public readonly meta: Atom<Meta>;

	public constructor(
		initialValue: T,
		createMeta: (atom: Atom<T>) => Atom<Meta>,
	) {
		this.value = Atom.create(initialValue);
		this.meta = createMeta(this.value);
	}

	public extend = <J extends {}>(
		createMeta: (atom: Atom<T>) => Atom<Meta & J>,
	): Field<T, Meta & J> => new Field(this.value.get(), createMeta);
}

// export type Field<T extends any, Meta extends {}> = {
// 	value: Atom<T>,
// 	meta: Atom<Meta>,
// 	isField: true
// };

// export const createField = <T extends any, Meta extends {}>(
// 	initialValue: T, createMeta: (atom: Atom<T>) => Atom<Meta>,
// ): Field<T, Meta> => {
// 	const valueAtom = Atom.create(initialValue);

// 	return {
// 		value: valueAtom,
// 		meta: createMeta(valueAtom),
// 		isField: true,
// 	};
// };
