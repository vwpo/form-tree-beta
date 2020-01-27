import { ObjectSchema, ValidationOptions } from "@hapi/joi";
import { ValidationErrors } from "../decorators/validation/index";

const defaultValidationOptions: ValidationOptions = {
	abortEarly: false,
	stripUnknown: true,
};

export const createJoiValidator = <T extends object>(
	schema: ObjectSchema,
	options: ValidationOptions = {},
): (value: T) => ValidationErrors<T> => (value) => {
	const joiResult = schema.validate(value, {
		...defaultValidationOptions,
		...options,
	});

	if (joiResult.error) {
		const result: ValidationErrors<T> = {};

		joiResult.error.details.forEach((joiError) => {
			joiError.path.forEach((path) => {
				result[path as keyof T] = [joiError.message];
			});
		});
		return joiResult;
	}

	return {};
};
