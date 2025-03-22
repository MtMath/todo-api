import { Module } from "@nestjs/common";
import { QuoteService } from "./quote.service";
import { QuoteController } from "./quote.controller";
import { HttpModule } from "@nestjs/axios";

@Module({
  imports: [HttpModule],
  controllers: [QuoteController],
  providers: [QuoteService],
  exports: [QuoteService],
})
export class QuoteModule {}
