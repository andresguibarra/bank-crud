import { ValidateUrlPipe } from "./valid-url.pipe";

describe('ValidateUrlPipe', () => {
  let pipe: ValidateUrlPipe;

  beforeEach(() => {
    pipe = new ValidateUrlPipe();
  });

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('should return true for valid http URL', () => {
    const result = pipe.transform('http://example.com');
    expect(result).toBeTrue();
  });

  it('should return true for valid https URL', () => {
    const result = pipe.transform('https://example.com');
    expect(result).toBeTrue();
  });

  it('should return false for invalid URL', () => {
    const result = pipe.transform('invalid-url');
    expect(result).toBeFalse();
  });

  it('should return false for URLs with other protocols', () => {
    const result = pipe.transform('ftp://example.com');
    expect(result).toBeFalse();
  });

  it('should return false for empty string', () => {
    const result = pipe.transform('');
    expect(result).toBeFalse();
  });

  it('should return false for null value', () => {
    const result = pipe.transform(null as any);
    expect(result).toBeFalse();
  });

  it('should return false for undefined value', () => {
    const result = pipe.transform(undefined as any);
    expect(result).toBeFalse();
  });

  it('should return false for string with spaces', () => {
    const result = pipe.transform('   ');
    expect(result).toBeFalse();
  });

  it('should return false for URL without protocol', () => {
    const result = pipe.transform('www.example.com');
    expect(result).toBeFalse();
  });
});
