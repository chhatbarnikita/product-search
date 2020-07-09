import { Component, ViewChildren, QueryList, ElementRef } from '@angular/core';
import { FormGroup, FormBuilder, FormControl, FormArray, Validators, ValidatorFn, AbstractControl } from '@angular/forms';
import { GetProductsService } from './get-products.service';
import { NegativePriceValidator } from './shared/negative-price.validator';
import { PriceRangeVaidator } from './shared/price-range.validator';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})

export class AppComponent {
  title: 'frontend'
  page: number = 1;
  products;
  detailsButton = 'Show details';
  show: boolean = false;
  priceEmpty: boolean;
  pricePresent: boolean;
  conArray: FormArray;
  shipArray: FormArray;
  @ViewChildren("conditionCheckboxes") conCheckboxes: QueryList<ElementRef>;
  @ViewChildren("shippingCheckboxes") shipCheckboxes: QueryList<ElementRef>;

  productForm: FormGroup;

  conditionData: Array<any> = [
  	{name: 'New', value: '1000'},
  	{name: 'Used', value: '3000'},
  	{name: 'Very Good', value: '4000'},
  	{name: 'Good', value: '5000'},
  	{name: 'Accepted', value: '6000'}
  ]

  shippingData: Array<any> = [
  	{name: 'Free', value: 'Free'},
  	{name: 'Expedited', value: 'Expedited'}
  ]

  constructor(private formBuilder: FormBuilder, private _getProductsService: GetProductsService) {}

  ngOnInit() {
  	this.productForm = this.formBuilder.group({
	  	keywords: [''],
	  	minPrice: [''],
	  	maxPrice: [''],
	  	condition: this.formBuilder.array([]),
	  	seller: [''],
	  	shipping: this.formBuilder.array([]),
	  	sortCategory: ['BestMatch']
	  });
  }

  onConditionChange(e) {
  	this.conArray = this.productForm.get('condition') as FormArray;

  	if(e.target.checked) {
  		this.conArray.push(new FormControl(e.target.value));
  	} else {
      let i: number = 0;
      this.conArray.controls.forEach((item: FormControl) => {
        if (item.value == e.target.value) {
          this.conArray.removeAt(i);
          return;
        }
        i++;
      });
    }
  }

  onShippingChange(e) {
  	this.shipArray = this.productForm.get('shipping') as FormArray;

  	if(e.target.checked) {
  		this.shipArray.push(new FormControl(e.target.value));
  	} else {
      let i: number = 0;
      this.shipArray.controls.forEach((item: FormControl) => {
        if (item.value == e.target.value) {
          this.shipArray.removeAt(i);
          return;
        }
        i++;
      });
    }
  }

  onSubmit() {
  	var keywords = this.productForm.get('keywords');
  	var minPrice = this.productForm.get('minPrice');
  	var maxPrice = this.productForm.get('maxPrice');
  	var condition = this.productForm.get('condition');
  	var seller = this.productForm.get('seller');
  	var shipping = this.productForm.get('shipping');
  	var sortCategory = this.productForm.get('sortCategory')

  	var url = 'https://ebay-express-server-hw8.wl.r.appspot.com/getProducts?';
    this.priceEmpty = (minPrice.value != '' || maxPrice.value != '') ? true : false;
    this.pricePresent = (minPrice.value != '' && maxPrice.value != '') ? true : false;

  	if(keywords.value == '') {
  		keywords.setValidators(Validators.required);
  		keywords.updateValueAndValidity();

      if(this.priceEmpty || this.pricePresent) {
        this.productForm.setValidators(NegativePriceValidator);
        this.productForm.updateValueAndValidity();
        minPrice.setValidators(Validators.pattern("^[a-zA-Z!@#$&()\\-`+,/\"]*$"));
        minPrice.updateValueAndValidity();
        maxPrice.setValidators(Validators.pattern("^[a-zA-Z!@#$&()\\-`+,/\"]*$"));
        maxPrice.updateValueAndValidity();
      }

      if(this.pricePresent) {
        this.productForm.setValidators(PriceRangeVaidator);
        this.productForm.updateValueAndValidity();
      }

      return;
  	}

  	url += 'keywords=' + (keywords.value).replace(' ', '%20');

  	if(minPrice.value != '') {
  		url += '&minPrice=' + minPrice.value;
  	}

  	if(maxPrice.value != '') {
  		url += '&maxPrice=' + maxPrice.value;
  	}

  	if(seller.value) {
  		url += '&seller=ReturnsAcceptedOnly'
  	}

  	if(condition) {
  		url += '&condition=' + condition.value;
  	}

  	if(shipping) {
  		url += '&shipping=' + shipping.value;
  	}

  	url += '&sortCategory=' + sortCategory.value;

  	this._getProductsService.getProducts(url).subscribe(products => {this.products = (products['findItemsAdvancedResponse'])[0]});
  }

  clearForm() {
    this.productForm.clearValidators();
    this.productForm.updateValueAndValidity();

    this.productForm = this.formBuilder.group({
      keywords: [''],
      minPrice: [''],
      maxPrice: [''],
      condition: this.formBuilder.array([]),
      seller: [''],
      shipping: this.formBuilder.array([]),
      sortCategory: ['BestMatch']
    });

    this.products = '';

    this.conCheckboxes.forEach((element) => {
      element.nativeElement.checked = false;

    });

    this.shipCheckboxes.forEach((element) => {
      element.nativeElement.checked = false;
    });
  }

  toggleDetails(element) {
    this.show = !this.show;

    if(this.show) {
      element.textContent = "Hide details";
    } else {
      element.textContent = "Show details";
    }
  }

}
