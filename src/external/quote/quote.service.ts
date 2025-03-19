import { Injectable, Logger } from "@nestjs/common";
import { Quote } from "./interfaces/quote.interface";
import { catchError, map } from "rxjs/operators";
import { Observable, of } from "rxjs";
import { HttpService } from "@nestjs/axios";

@Injectable()
export class QuoteService {
  private readonly logger = new Logger(QuoteService.name);
  private readonly fallbackQuotes: Quote[] = [
    {
      content: "The only way to do great work is to love what you do.",
      author: "Steve Jobs",
      tags: ["motivation", "work"],
    },
    {
      content: "Life is what happens when you're busy making other plans.",
      author: "John Lennon",
      tags: ["life", "planning"],
    },
    {
      content:
        "The future belongs to those who believe in the beauty of their dreams.",
      author: "Eleanor Roosevelt",
      tags: ["future", "dreams"],
    },
  ];

  constructor(private httpService: HttpService) {}

  getRandomQuote(): Observable<Quote> {
    return this.httpService.get("https://api.quotable.io/random").pipe(
      map((response) => response.data),
      catchError((error) => {
        this.logger.error(`Failed to fetch quote: ${error.message}`);
        return of(this.getFallbackQuote());
      })
    );
  }

  private getFallbackQuote(): Quote {
    const randomIndex = Math.floor(Math.random() * this.fallbackQuotes.length);
    return this.fallbackQuotes[randomIndex];
  }
}
