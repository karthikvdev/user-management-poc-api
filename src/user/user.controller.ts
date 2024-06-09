
import { Body, Controller, Get, Param, Post, Put, Delete, Res, Req } from "@nestjs/common";
import { UserService } from "./user.service";
import { CreateUserDto } from "./user.dto";
import { ObjectId } from "mongoose";
import { ApiBody, ApiParam, ApiTags } from "@nestjs/swagger";
import type { Request, Response } from 'express';

@ApiTags('User')
@Controller('user')
export class UserController {
    constructor(
        private userService: UserService
    ) { }

    @Post('create') createUser(@Body() user: CreateUserDto): Promise<any> {
        return this.userService.createUser(user);
    }

    @Get('') getAllUser(): Promise<any> {
        return this.userService.getAllUser();
    }

    @ApiParam({ name: 'id', required: true, description: 'User Id' })
    @Get(':id') getUserById(@Param('id') id: ObjectId): Promise<any> {
        return this.userService.getUserById(id);
    }
    @ApiParam({ name: 'id', required: true, description: 'User Id' })
    @ApiBody({ type: CreateUserDto })
    @Put('update/:id') updateUser(@Param('id') id: ObjectId, @Body() user: CreateUserDto): Promise<any> {
        return this.userService.updateUserById(id, user);
    }

    @ApiParam({ name: 'id', required: true, description: 'User Id' })
    @Delete(':userId') deleteUserById(@Param('userId') userId: ObjectId): Promise<any> {
        return this.userService.deleteUserById(userId);
    }

    @ApiParam({ name: 'id', required: true, description: 'User Id' })
    @Get(`pdf/download/:id`) async downloadPdf(@Req() req: Request, @Param('id') id: ObjectId, @Res() res: Response) {
        const pdfData = await this.userService.downloadPdf(id);
        res.set({
            'Content-Type': 'application/pdf',
            'Content-Disposition': `attachment; filename="${pdfData?.data?.user?.name?.toLowerCase()?.replace(/\s/g, '')}.pdf"`,
            'Content-Length': pdfData?.data?.pdf?.length,
        })
        res.end(pdfData?.data?.pdf);
    }

    @ApiParam({ name: 'id', required: true, description: 'User Id' })
    @Get('pdf/generate/:id') async generatePdf(@Req() req: Request, @Param('id') id: ObjectId) {
        return await this.userService.generatePdf(id, req);
    }



}