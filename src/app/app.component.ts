import { Component, OnInit } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { BankService, FinancialProduct } from "./bank.service";
import { HttpClientModule } from "@angular/common/http";
import { CommonModule } from "@angular/common";
import { take, takeUntil } from "rxjs";
import { ValidateUrlPipe } from "./valid-url.pipe";

@Component({
  selector: "app-root",
  standalone: true,
  imports: [RouterOutlet, CommonModule, HttpClientModule, ValidateUrlPipe],
  templateUrl: "./app.component.html",
  styleUrl: "./app.component.scss",
  providers: [BankService]
})
export class AppComponent implements OnInit {
  financialProducts: FinancialProduct[] = [];
  constructor(readonly bankService: BankService) {}

  ngOnInit(): void {
    this.bankService
      .getFinancialProducts()
      .pipe(take(1))
      .subscribe(
        (financialProducts) => (this.financialProducts = financialProducts)
      );
  }
}
