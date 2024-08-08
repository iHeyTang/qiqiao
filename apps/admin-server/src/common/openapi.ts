import { ApiProperty } from '@nestjs/swagger';

export class PaginationDTO {
  @ApiProperty()
  pageSize: number;
  @ApiProperty()
  current: number;
  @ApiProperty()
  total?: number;
}

export class WithPaginationDTO {
  @ApiProperty()
  pagination: PaginationDTO;
}
