import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';

import { Producto } from './producto';

@Injectable({
  providedIn: 'root'
})
export class ProductoService {

  private url = 'http://localhost:8888/productos.php';

  constructor(
    private http: HttpClient,

  ) { }

  get(): Observable<Producto[]> {
    return this.http.get<Producto[]>(this.url)
            .pipe(catchError(this.handleError));
  }

  delete(id: number): Observable<any> {
    return this.http.delete
      (`${this.url}/${id}`)
        .pipe(catchError(this.handleError));
  }

  put(producto: Producto): Observable<any> {
    let payload = JSON.stringify(producto);
    return this.http.put<Producto>(this.url,
      payload)
      .pipe(catchError(this.handleError)
      );
  }

  post(producto: Producto): Observable<any> {
    let payload = JSON.stringify(producto);
    return this.http.post<Producto>(this.url, payload)
      .pipe(catchError(this.handleError));
  }


  public handleError(err: Response) {
    alert(err.statusText);
    return of([]);
  }
}
