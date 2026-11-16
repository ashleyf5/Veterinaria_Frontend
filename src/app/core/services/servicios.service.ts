import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse, Servicio } from '../models/api.models';

@Injectable({ providedIn: 'root' })
export class ServiciosService {
  private readonly http = inject(HttpClient);

  listar(): Observable<Servicio[]> {
    return this.http
      .get<ApiResponse<Servicio[]>>(`${environment.apiUrl}/servicios`)
      .pipe(map((response) => response.data));
  }
}
