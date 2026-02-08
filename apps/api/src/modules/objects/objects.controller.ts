import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  UseInterceptors,
  UploadedFile,
  ParseFilePipe,
  MaxFileSizeValidator,
  FileTypeValidator,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiConsumes,
  ApiQuery,
} from '@nestjs/swagger';
import { ObjectsService } from './objects.service';
import { CreateObjectDto } from './dto/create-object.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Public } from '../auth/decorators/public.decorator';
import { User } from '@heyama/shared';
import { MAX_FILE_SIZE } from '@heyama/shared';

@ApiTags('objects')
@Controller('objects')
export class ObjectsController {
  constructor(private readonly objectsService: ObjectsService) {}

  @Post()
  @UseGuards(JwtAuthGuard)
  @UseInterceptors(FileInterceptor('image'))
  @ApiBearerAuth()
  @ApiConsumes('multipart/form-data')
  @ApiOperation({ summary: 'Create a new object with image' })
  @ApiResponse({ status: 201, description: 'Object created successfully' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  async create(
    @Body() createObjectDto: CreateObjectDto,
    @UploadedFile(
      new ParseFilePipe({
        validators: [
          new MaxFileSizeValidator({ maxSize: MAX_FILE_SIZE }),
          new FileTypeValidator({ fileType: /(jpg|jpeg|png|webp|gif)$/ }),
        ],
      }),
    )
    file: Express.Multer.File,
    @CurrentUser() user: User,
  ) {
    const object = await this.objectsService.create(createObjectDto, file, user._id);
    return this.objectsService.toPublicObject(object);
  }

  @Public()
  @Get()
  @ApiOperation({ summary: 'Get all objects with pagination' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiResponse({ status: 200, description: 'List of objects' })
  async findAll(
    @Query('page') page: number = 1,
    @Query('limit') limit: number = 10,
  ) {
    return this.objectsService.findAll(page, Math.min(limit, 100));
  }

  @Public()
  @Get(':id')
  @ApiOperation({ summary: 'Get a single object by ID' })
  @ApiResponse({ status: 200, description: 'Object details' })
  @ApiResponse({ status: 404, description: 'Object not found' })
  async findOne(@Param('id') id: string) {
    const object = await this.objectsService.findOne(id);
    return this.objectsService.toPublicObject(object);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Delete an object' })
  @ApiResponse({ status: 200, description: 'Object deleted' })
  @ApiResponse({ status: 401, description: 'Unauthorized' })
  @ApiResponse({ status: 403, description: 'Forbidden - not owner' })
  @ApiResponse({ status: 404, description: 'Object not found' })
  async delete(@Param('id') id: string, @CurrentUser() user: User) {
    await this.objectsService.delete(id, user._id);
    return { message: 'Object deleted successfully' };
  }
}
