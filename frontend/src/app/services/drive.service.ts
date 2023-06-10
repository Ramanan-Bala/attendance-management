import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";

@Injectable({
  providedIn: "root",
})
export class FileUploadService {
  private apiEndpoint = "http://localhost:3000/api/upload";

  constructor(private http: HttpClient) {}

  uploadFile(file: File): Observable<any> {
    const formData = new FormData();
    formData.append("file", file, file.name);

    return this.http.post(this.apiEndpoint, formData);
  }
}
