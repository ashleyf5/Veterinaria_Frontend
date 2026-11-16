import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ApiResponse, FotoGaleria } from '../models/api.models';

@Injectable({ providedIn: 'root' })
export class GaleriaService {
  private readonly http = inject(HttpClient);

  listar(): Observable<FotoGaleria[]> {
    return this.http
      .get<ApiResponse<FotoGaleria[]>>(`${environment.apiUrl}/galeria`)
      .pipe(map((response) => response.data));
  }
}
