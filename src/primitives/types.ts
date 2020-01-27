import { Atom } from "@grammarly/focal";

export type PrimitiveValue = string | number | string[] | undefined;

export type PrimitiveBaseProps<T extends PrimitiveValue> = {
	atom: Atom<T>
};
