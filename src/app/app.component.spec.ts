import { ComponentFixture, TestBed } from "@angular/core/testing";
import { HttpClientTestingModule } from "@angular/common/http/testing";
import { RouterTestingModule } from "@angular/router/testing";
import { CommonModule } from "@angular/common";
import { ValidateUrlPipe } from "./valid-url.pipe";
import { BankService, FinancialProduct } from "./bank.service";
import { Router } from "@angular/router";
import { AppComponent } from "./app.component";
import { of } from "rxjs";

describe("AppComponent", () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let router: Router;
  let bankService: BankService;

  const mockFinancialProducts: FinancialProduct[] = [
    {
      id: '1',
      name: 'Product 1',
      description: 'Description 1',
      logo: 'http://valid.url/logo1.png',
      date_release: new Date(),
      date_revision: new Date()
    },
    {
      id: '2',
      name: 'Product 2',
      description: 'Description 2',
      logo: 'http://valid.url/logo2.png',
      date_release: new Date(),
      date_revision: new Date()
    }
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        CommonModule,
        ValidateUrlPipe
      ],
      providers: [BankService]
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    router = TestBed.inject(Router);
    bankService = TestBed.inject(BankService);

    spyOn(router, 'navigate');
    spyOn(bankService, 'getFinancialProducts').and.returnValue(of(mockFinancialProducts));
    fixture.detectChanges();
  });

  it('should create the app', () => {
    expect(component).toBeTruthy();
  });

  it('should navigate to home on header click', () => {
    const header = fixture.nativeElement.querySelector('h1');
    header.click();
    expect(router.navigate).toHaveBeenCalledWith(['']);
  });
});
