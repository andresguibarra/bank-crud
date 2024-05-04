import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

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
    authorId: "499"
  };
  constructor(private httpClient: HttpClient) {}

  getFinancialProducts(): Observable<FinancialProduct[]> {
    return this.httpClient.get<FinancialProduct[]>(
      this.baseUrl + "/bp/products",
      { headers: this.headers }
    );
  }
}
