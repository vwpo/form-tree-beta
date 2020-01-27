import { Atom } from "@grammarly/focal";
import { PickByValue } from "utility-types";
import { Field } from "../field";

type FormChildRawValue = Record<string, {} | number | string>;
type FormChildValue<
	T extends FormChildRawValue, K extends {}
> = Record<keyof T, FormChild<PickByValue<T[keyof T], {}>, K> | Field<PickByValue<T[keyof T], number | string>, K>>;

export class FormChild<T extends Record<string, {} | number | string>, PrimitiveMeta extends {}> {
	public readonly value: Atom<FormChildValue<T, PrimitiveMeta>>;

	public constructor(
		initialValue: T,
		createPrimitiveMeta: (value: Atom<string | number>) => Atom<PrimitiveMeta>,
	) {
		const value = Object.keys(initialValue).reduce((prev, curr) => {
			const key = curr as keyof T;
			if (typeof initialValue[key] === "object") {
				return {
					...prev,
					[key]: new FormChild(initialValue[key] as any, createPrimitiveMeta),
				};
			}
			return {
				...prev,
				[key]: new Field(initialValue[key] as any, createPrimitiveMeta),
			};
		}, {} as FormChildValue<T, PrimitiveMeta>);

		this.value = Atom.create(value);
	}

	public bind = <K extends keyof T>(key: K): {
		value: Atom<T[K]>
	} => {
		const currentValue = this.value.get()[key];

		if (currentValue instanceof Field) {
			return {
				value: currentValue.value as Atom<T[K]>,
			};
		}
		return {
			value: currentValue.value as Atom<T[K]>,
		};
	};
}
