import React, { HTMLProps } from "react";
import { F } from "@grammarly/focal";
import { PrimitiveBaseProps, PrimitiveValue } from "../types";

export type InputProps<T extends PrimitiveValue> =
 & PrimitiveBaseProps<T>
 & Omit<HTMLProps<HTMLInputElement>, "onChange" | "value" | "onValue">;

export const Input = <T extends PrimitiveValue>({ atom, ...restProps }: InputProps<T>): React.ReactElement => {
	return (
		<F.input
			value={atom || ""}
			onChange={e => atom.set((e.target as any).value as T)}
			{...restProps}
		/>
	);
};

Input.displayName = "Input";
