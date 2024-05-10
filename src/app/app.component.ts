import { Component, OnInit } from "@angular/core";
import { Router, RouterOutlet } from "@angular/router";
import { BankService, FinancialProduct } from "./bank.service";
import { HttpClientModule } from "@angular/common/http";
import { CommonModule } from "@angular/common";
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
  constructor(readonly bankService: BankService, protected router: Router) {}

  ngOnInit(): void {}
}
