import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
  name: "validateUrl",
  standalone: true
})
export class ValidateUrlPipe implements PipeTransform {
  transform(value: string): boolean {
    let url;

    if (!value) {
      return false;
    }

    try {
      url = new URL(value);
    } catch (_) {
      return false;
    }

    return url.protocol === "http:" || url.protocol === "https:";
  }
}
