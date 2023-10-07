import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class ErrorDto {
  @ApiProperty()
  msg: string;

  @ApiPropertyOptional({ type: Object })
  props?: Record<string, any>;

  constructor(msg = '', props?: Record<string, any>) {
    this.msg = msg;
    this.props = props;
  }
}
