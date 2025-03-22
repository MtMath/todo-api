import { Controller, Get } from "@nestjs/common";
import { QuoteService } from "./quote.service";
import { Quote } from "./interfaces/quote.interface";
import { Observable } from "rxjs";

@Controller("quotes")
export class QuoteController {
  constructor(private quoteService: QuoteService) {}

  @Get("random")
  getRandomQuote(): Observable<Quote> {
    return this.quoteService.getRandomQuote();
  }
}
