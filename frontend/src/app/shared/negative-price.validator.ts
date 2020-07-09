import { AbstractControl } from '@angular/forms';

export function NegativePriceValidator(control: AbstractControl): { [key: string]: boolean } | null {
	const minPrice = control.get('minPrice').value;
	const maxPrice = control.get('maxPrice').value;

	return (minPrice <= 0 || maxPrice <= 0) ? {negative: true} : null;
}