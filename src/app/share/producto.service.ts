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

  handleError(err: Response) {
    return of([]);
  }
}
