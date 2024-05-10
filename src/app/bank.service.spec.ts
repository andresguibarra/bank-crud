import { TestBed } from "@angular/core/testing";
import { HttpClientTestingModule, HttpTestingController } from "@angular/common/http/testing";
import { BankService, FinancialProduct } from "./bank.service";

describe("BankService", () => {
  let service: BankService;
  let httpMock: HttpTestingController;

  const baseUrl = "https://tribu-ti-staffing-desarrollo-afangwbmcrhucqfh.z01.azurefd.net/ipf-msa-productosfinancieros";
  const headers = { authorId: "1" };

  const mockProduct: FinancialProduct = {
    id: "test-id",
    name: "Test Product",
    description: "Test Description",
    logo: "http://valid.url/logo.png",
    date_release: new Date(),
    date_revision: new Date()
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [BankService]
    });
    service = TestBed.inject(BankService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it("should be created", () => {
    expect(service).toBeTruthy();
  });

  it("should get financial products", () => {
    service.getFinancialProducts().subscribe((products) => {
      expect(products.length).toBe(1);
      expect(products).toEqual([mockProduct]);
    });

    const req = httpMock.expectOne(`${baseUrl}/bp/products`);
    expect(req.request.method).toBe("GET");
    expect(req.request.headers.get("authorId")).toBe(headers.authorId);
    req.flush([mockProduct]);
  });

  it("should create a product", () => {
    service.createProduct(mockProduct).subscribe();

    const req = httpMock.expectOne(`${baseUrl}/bp/products`);
    expect(req.request.method).toBe("POST");
    expect(req.request.headers.get("authorId")).toBe(headers.authorId);
    expect(req.request.body).toEqual(mockProduct);
    req.flush(null);
  });

  it("should update a product", () => {
    service.updateProduct(mockProduct).subscribe();

    const req = httpMock.expectOne(`${baseUrl}/bp/products`);
    expect(req.request.method).toBe("PUT");
    expect(req.request.headers.get("authorId")).toBe(headers.authorId);
    expect(req.request.body).toEqual(mockProduct);
    req.flush(null);
  });

  it("should delete a product", () => {
    service.deleteProduct(mockProduct.id).subscribe((result) => {
      expect(result).toBe(true);
    });

    const req = httpMock.expectOne(`${baseUrl}/bp/products?id=${mockProduct.id}`);
    expect(req.request.method).toBe("DELETE");
    expect(req.request.headers.get("authorId")).toBe(headers.authorId);
    req.flush("true");
  });

  it("should validate product exists", () => {
    service.validateProductExists(mockProduct.id).subscribe((exists) => {
      expect(exists).toBe(true);
    });

    const req = httpMock.expectOne(`${baseUrl}/bp/products/verification?id=${mockProduct.id}`);
    expect(req.request.method).toBe("GET");
    expect(req.request.headers.get("authorId")).toBe(headers.authorId);
    req.flush(true);
  });
});
