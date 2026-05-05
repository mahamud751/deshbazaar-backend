import { Controller, Get } from "@nestjs/common";
import { ApiTags } from "@nestjs/swagger";
import { FlashSalesService } from "./flash-sales.service";

@ApiTags("Flash Sales")
@Controller()
export class FlashSalesController {
  constructor(private flashSalesService: FlashSalesService) {}

  @Get("flash-sales")
  findActive() {
    return this.flashSalesService.findActive();
  }

  @Get("flash-sales-upcoming")
  findUpcoming() {
    return this.flashSalesService.findUpcoming();
  }
}
