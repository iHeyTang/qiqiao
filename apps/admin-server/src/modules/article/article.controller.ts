import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { ArticleService } from './article.service';
import { ApiOkResponse, ApiProperty } from '@nestjs/swagger';
import { WithPaginationDTO } from 'src/common/openapi';

class ArticleListItemDTO {
  @ApiProperty()
  id: string;

  @ApiProperty()
  title: string;

  @ApiProperty()
  created_at: string;

  @ApiProperty()
  updated_at: string;
}

class ArticleDetailDTO {
  @ApiProperty()
  id: string;

  @ApiProperty()
  title: string;

  @ApiProperty()
  created_at: string;

  @ApiProperty()
  updated_at: string;

  @ApiProperty()
  content: string;
}

class ArticlePageResultDTO extends WithPaginationDTO {
  @ApiProperty({ type: [ArticleListItemDTO] })
  list: ArticleListItemDTO[];
}

class ArticleCreateResultDTO {
  @ApiProperty()
  id: string;

  @ApiProperty()
  created_at: string;
}

class ArticleEditResultDTO {
  @ApiProperty()
  id: string;

  @ApiProperty()
  updated_at: string;
}

class ArticleCreateDTO {
  @ApiProperty()
  title: string;

  @ApiProperty()
  content: string;
}

class ArticleEditDTO {
  @ApiProperty()
  title: string;

  @ApiProperty()
  content: string;
}

@Controller({ path: 'article' })
export class ArticleController {
  constructor(private readonly articleService: ArticleService) {}

  @Get('/')
  @ApiOkResponse({ type: ArticlePageResultDTO })
  async list(
    @Query('pageSize') pageSize: number = 1,
    @Query('current') current: number = 10,
  ): Promise<ArticlePageResultDTO> {
    const res = await this.articleService.getArticleList({
      pagination: { pageSize, current },
    });
    return {
      list: res.list,
      pagination: {
        pageSize,
        current,
        total: res.total,
      },
    };
  }

  @Get('/:id')
  @ApiOkResponse({ type: ArticleDetailDTO })
  async detail(@Param('id') id: number): Promise<ArticleDetailDTO> {
    return this.articleService.getArticleDetail(id);
  }

  @Post('/')
  @ApiOkResponse({ type: ArticleCreateResultDTO })
  async create(
    @Body() body: ArticleCreateDTO,
  ): Promise<ArticleCreateResultDTO> {
    return this.articleService.createArticle(body);
  }

  @Delete('/:id')
  async delete(@Param('id') id: number): Promise<void> {
    return this.articleService.deleteArticle(id);
  }

  @Put('/:id')
  @ApiOkResponse({ type: ArticleEditResultDTO })
  async edit(
    @Param('id') id: number,
    @Body() body: ArticleEditDTO,
  ): Promise<ArticleEditResultDTO> {
    return this.articleService.editArticle(id, body);
  }
}
