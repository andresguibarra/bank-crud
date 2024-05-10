import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable, map, tap } from "rxjs";

export type FinancialProduct = {
  id: string;
  name: string;
  description: string;
  logo: string;
  date_release: Date;
  date_revision: Date;
};

@Injectable({
  providedIn: "root"
})
export class BankService {
  private baseUrl =
    "https://tribu-ti-staffing-desarrollo-afangwbmcrhucqfh.z01.azurefd.net/ipf-msa-productosfinancieros";
  private headers = {
    authorId: "1"
  };
  constructor(private httpClient: HttpClient) {}

  getFinancialProducts(): Observable<FinancialProduct[]> {
    return this.httpClient
      .get<FinancialProduct[]>(this.baseUrl + "/bp/products", {
        headers: this.headers
      })
      .pipe(tap(console.log));
  }

  createProduct(value: any): Observable<void> {
    return this.httpClient
      .post<FinancialProduct[]>(this.baseUrl + "/bp/products", value, {
        headers: this.headers
      })
      .pipe(tap(console.log));
  }

  updateProduct(value: any): Observable<void> {
    return this.httpClient
      .put<FinancialProduct[]>(this.baseUrl + "/bp/products", value, {
        headers: this.headers
      })
      .pipe(tap(console.log));
  }

  deleteProduct(id: string | number): Observable<boolean | null> {
    return this.httpClient
      .delete(this.baseUrl + "/bp/products", {
        headers: this.headers,
        params: { id },
        responseType: "text"
      })
      .pipe(map((value)=> !!value));
  }

  validateProductExists(id: string | number): Observable<boolean> {
    return this.httpClient
      .get<boolean>(this.baseUrl + "/bp/products/verification", {
        headers: this.headers,
        params: { id }
      })
  }
}
