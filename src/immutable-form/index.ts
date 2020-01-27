// eslint-disable-next-line eslint-comments/disable-enable-pair
/* eslint-disable max-len */
import { Atom } from "@grammarly/focal";
import { PickByValue } from "utility-types";
import { Observable } from "rxjs";
import { map } from "rxjs/operators/map";
import { FormChild } from "../form-child";
import { Field } from "../field";

type FormRawValue = Record<string, {} | number | string>;
type FormValue<T extends FormRawValue, K extends {}> = Record<keyof T, FormChild<PickByValue<T[keyof T], {}>, K> | Field<PickByValue<T[keyof T], number | string>, K>>;

export class ImmutableForm<
	T extends Record<string, {} | number | string>,
	Meta extends {} = {},
	PrimitiveMeta extends {} = {},
> {
	public readonly raw: Atom<T>;

	public readonly value: Observable<FormValue<T, PrimitiveMeta>>;

	public readonly meta: Atom<Meta>;

	public constructor(
		initialValue: T,
		createMeta: (value: Atom<T>) => Atom<Meta> = () => Atom.create({} as Meta),
		private readonly createPrimitiveMeta: (
			value: Atom<string | number>
		) => Atom<PrimitiveMeta> = () => Atom.create({} as PrimitiveMeta),
	) {
		this.raw = Atom.create(initialValue);

		this.value = this.raw.pipe(
			map((val) => Object.keys(val).reduce((prev, curr) => {
				const key = curr as keyof T;

				if (typeof val[key] === "object") {
					return {
						...prev,
						[key]: new FormChild(val[key] as any, this.createPrimitiveMeta),
					};
				}
				return {
					...prev,
					[key]: new Field(val[key] as any, createPrimitiveMeta),
				};
			}, {} as FormValue<T, PrimitiveMeta>)),
		);

		this.meta = createMeta(this.raw);
	}

	public extend = <J extends {}, M extends {}>(
		createMeta: (atom: Atom<T>) => Atom<Meta & J>,
		createPrimitiveMeta: (atom: Atom<string | number>) => Atom<PrimitiveMeta & M>,
	): ImmutableForm<T, Meta, PrimitiveMeta> => {
		return new ImmutableForm<T, Meta, PrimitiveMeta>(this.raw.get(), createMeta, createPrimitiveMeta);
	};

	// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
	public bind = <K extends keyof T>(key: K) => {
		return this.value.pipe(
			map((currentValue) => {
				const val = currentValue[key];
				if (val instanceof Field) {
					return {
						field: val as Field<T[K], PrimitiveMeta>,
					};
				}
				if (val instanceof FormChild) {
					return {
						childForm: val as FormChild<PickByValue<T[K], {}>, PrimitiveMeta>,
					};
				}
				return null;
			}),
		);
	};
}
