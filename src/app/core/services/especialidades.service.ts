import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse, Especialidad } from '../models/api.models';

@Injectable({ providedIn: 'root' })
export class EspecialidadesService {
  private readonly http = inject(HttpClient);

  listar(): Observable<Especialidad[]> {
    return this.http
      .get<ApiResponse<Especialidad[]>>(`${environment.apiUrl}/especialidades`)
      .pipe(map((response) => response.data));
  }
}
