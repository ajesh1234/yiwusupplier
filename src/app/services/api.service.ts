import { Injectable } from '@angular/core';
import { Http, HttpModule, RequestOptions, Headers } from "@angular/http";
import { map, tap, switchMap } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { HttpClient, HttpHeaders, } from '@angular/common/http';
import { retry, catchError } from 'rxjs/operators';
import { Observable, throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  public appUrl :any= environment.baseUrl;
  ordercount:any=0;
  favcount:any=0;
   httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json'
    })
  }  
  constructor(public httpClient:HttpClient, public http:Http) { }

  public post(url, params) {
    // const headers = new Headers();
    // headers.append('Accept', 'application/json');
    // headers.append('Content-Type', 'application/json');
    // const options = new RequestOptions({ headers: headers });
    // return this.http
    //   .post(this.appUrl + url, JSON.stringify(params), options)
    //   .pipe(map(res => res.json()));
      // return this.httpClient.post(`${this.appUrl}/{url}/`,params);
    return this.httpClient.post(this.appUrl + url, params).pipe(retry(1),catchError(this.handleError))

  }

  public get(url, params) {
    const headers = new Headers();
    headers.append('Accept', 'application/json');
    headers.append('Content-Type', 'application/json');
    const options = new RequestOptions({
      headers: headers,
      params: params
    });
    return this.http.get(this.appUrl + url, options).pipe(map(res => res.json()));
  }
  
  public getProducts(params) {
    const headers = new Headers();
    headers.append('Accept', 'application/json');
    headers.append('Content-Type', 'application/json');
    const options = new RequestOptions({ headers: headers });
    return this.http
      .post(`${this.appUrl}/products`, JSON.stringify(params), options)
      .pipe(map(res => res.json()));
  }
  getProductsByCatIds(params) {
    const headers = new Headers();
    headers.append('Accept', 'application/json');
    headers.append('Content-Type', 'application/json');
    const options = new RequestOptions({ headers: headers });
    return this.http
      .post(`${this.appUrl}/products/${params.catslug}`, JSON.stringify(params), options)
      .pipe(map(res => res.json()));
  }
  public getProductsByIds(params) {
    const headers = new Headers();
    headers.append('Accept', 'application/json');
    headers.append('Content-Type', 'application/json');
    const options = new RequestOptions({ headers: headers });
    return this.http
      .post(`${this.appUrl}/products/${params.catslug}/${params.subslug}`, JSON.stringify(params), options)
      .pipe(map(res => res.json()));
  }
  getProductsByChildIds(params) {
    const headers = new Headers();
    headers.append('Accept', 'application/json');
    headers.append('Content-Type', 'application/json');
    const options = new RequestOptions({ headers: headers });
    return this.http
      .post(`${this.appUrl}/products/${params.catslug}/${params.subslug}/${params.childcatslug}`, JSON.stringify(params), options)
      .pipe(map(res => res.json()));
  }
  public getProductBySearch(params) {
    const headers = new Headers();
    headers.append('Accept', 'application/json');
    headers.append('Content-Type', 'application/json');
    const options = new RequestOptions({ headers: headers });
    return this.http
      .post(`${this.appUrl}/products`, JSON.stringify(params), options)
      .pipe(map(res => res.json()));
  }
   // Error handling 
   handleError(error) {
    let errorMessage = '';
    if(error.error instanceof ErrorEvent) {
      // Get client-side error
      errorMessage = error.error.message;
    } else {
      // Get server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    window.alert(errorMessage);
    return throwError(errorMessage);
 }
  }
