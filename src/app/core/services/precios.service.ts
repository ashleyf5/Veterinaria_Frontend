import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse, Precio } from '../models/api.models';

@Injectable({ providedIn: 'root' })
export class PreciosService {
  private readonly http = inject(HttpClient);

  listar(): Observable<Precio[]> {
    return this.http
      .get<ApiResponse<Precio[]>>(`${environment.apiUrl}/precios`)
      .pipe(map((response) => response.data));
  }
}
