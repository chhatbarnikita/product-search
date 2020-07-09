import { AbstractControl } from '@angular/forms';

export function PriceRangeVaidator(control: AbstractControl): { [key: string]: boolean } | null {
	const minPrice = control.get('minPrice').value;
	const maxPrice = control.get('maxPrice').value;
	return (maxPrice < minPrice) ? {greater: true} : null;
}