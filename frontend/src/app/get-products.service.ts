import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class GetProductsService {
	httpOptions = {
		headers: new HttpHeaders({'Access-Control-Allow-Origin': '*'})
	};
	constructor(private _http: HttpClient) { }

	getProducts(url: string) {
		return this._http.get(url, this.httpOptions);
	}
}
