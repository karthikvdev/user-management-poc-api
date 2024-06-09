import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString, IsMongoId, IsNumber, IsOptional } from "class-validator";
import { ObjectId } from 'mongodb';

export class CreateUserDto {
    @ApiProperty({ type: String, description: 'This is a required property' }) @IsNotEmpty() @IsString() readonly name: string;
    @ApiProperty({ type: String, description: 'This is a required property' }) @IsNotEmpty() @IsEmail({}, { message: "Provide Valid email" }) readonly email: string;
    @ApiProperty({ type: Number, description: 'This is a required property' }) @IsNotEmpty() @IsNumber() readonly phoneNumber: number;
    @ApiProperty({ type: String, description: 'This is a required property' }) @IsNotEmpty() @IsString() readonly address: string;
}

export class DeleteUserDto {
    @IsMongoId() readonly userId: ObjectId;
}

