import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface MedicalProfileRequest {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: string;
  bloodType: string;
  height: number;
  emergencyContact: string;
  allergies: string[];
  conditions: string[];
  medications: string[];
}

export interface MedicalProfileResponse {
  id: number;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  gender: string;
  bloodType: string;
  height: number;
  emergencyContact: string;
  allergies: string[];
  conditions: string[];
  medications: string[];
  complete: boolean;
}

export interface BiometricRequest {
  weight: number;
  height: number;
  bodyFat?: number | null;
  muscleMass?: number | null;
  systolic?: number | null;
  diastolic?: number | null;
  glucose?: number | null;
  notes?: string;
}

export interface BiometricResponse {
  id: number;
  weight: number;
  height: number;
  bmi: number;
  bodyFat: number | null;
  muscleMass: number | null;
  systolic: number | null;
  diastolic: number | null;
  glucose: number | null;
  notes: string;
  recordedAt: string;
}

export interface HealthAlertDto {
  type: string;
  metric: string;
  message: string;
  value: string;
}

@Injectable({ providedIn: 'root' })
export class ApiService {

  private base = 'http://localhost:8090/peakwell/api';

  constructor(private http: HttpClient) {}

  // ── Medical Profile ──────────────────────────────
  getProfile(): Observable<MedicalProfileResponse> {
    return this.http.get<MedicalProfileResponse>(`${this.base}/profile`);
  }

  saveProfile(data: MedicalProfileRequest): Observable<MedicalProfileResponse> {
    return this.http.post<MedicalProfileResponse>(`${this.base}/profile`, data);
  }

  updateProfile(data: MedicalProfileRequest): Observable<MedicalProfileResponse> {
    return this.http.put<MedicalProfileResponse>(`${this.base}/profile`, data);
  }

  // ── Biometrics ───────────────────────────────────
  getBiometrics(): Observable<BiometricResponse[]> {
    return this.http.get<BiometricResponse[]>(`${this.base}/biometrics`);
  }

  addBiometric(data: BiometricRequest): Observable<BiometricResponse> {
    return this.http.post<BiometricResponse>(`${this.base}/biometrics`, data);
  }

  getLatestBiometric(): Observable<BiometricResponse> {
    return this.http.get<BiometricResponse>(`${this.base}/biometrics/latest`);
  }

  deleteBiometric(id: number): Observable<void> {
    return this.http.delete<void>(`${this.base}/biometrics/${id}`);
  }

  getAlerts(): Observable<HealthAlertDto[]> {
    return this.http.get<HealthAlertDto[]>(`${this.base}/biometrics/alerts`);
  }
}