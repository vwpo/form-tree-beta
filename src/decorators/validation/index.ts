// import { Atom } from "@grammarly/focal";
import { ObjectSchema, ValidationOptions } from "@hapi/joi";
import { map } from "rxjs/src/operators/map";
import { Observable } from "rxjs";
import { ImmutableForm } from "../../immutable-form";

// export interface FieldValidation<T extends object, K extends keyof T> {
// 	key: K,
// 	value: Atom<T[K]>,
// 	errors: string[]
// }

export type ValidationErrors<T extends {}> = {
	[key in keyof T]?: string[]
};

export type ValidationState<T extends {}> = {
	errors: ValidationErrors<T>,
	hasErrors: boolean,
}

export type ValidateFunc<T extends {}> = (value: T) => ValidationErrors<T>;

type ValidationMeta<T extends {}> = {
	validation: ValidationState<T>
}

export const withValidation = <T extends {}, K extends {}>(
	form: ImmutableForm<T, K>, joiSchema: ObjectSchema<T>,
): ImmutableForm<T, K & ValidationMeta<T>> => {
	const currentValue = form.raw.view((value) => )
	const validationResult = form.value.pipe(
		map((value) => {
			const errors = validate(value.);
			return {
				errors,
				hasErrors: Object.keys(errors).length > 0,
			};
		}),
	);


	return form.extend((valueAtom) => {
		validation: valueAtom.pipe(map(value => )),
	});
};
