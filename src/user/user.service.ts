
import { Injectable } from "@nestjs/common";
import { UserModel } from "../../mongo/user.schema"
import { InjectModel } from "@nestjs/mongoose";
import * as mongoose from "mongoose";
import { CommonService, IAPIResponse } from "src/common/common.controller";
import { CreateUserDto } from "./user.dto";
import { ObjectId } from "mongoose";
import { PDFDocument, rgb } from 'pdf-lib';
import * as path from 'path';
import * as fs from 'fs';
import type { Request } from 'express';


@Injectable()
export class UserService {
    constructor(
        @InjectModel(UserModel.name)
        private userModel: mongoose.Model<UserModel>,
        private commonService: CommonService,
    ) { }

    public async createUser(payload: UserModel): Promise<IAPIResponse> {
        try {
            const isUser = await this.userModel.findOne({ email: payload?.email, phoneNumber: payload?.phoneNumber });
            if (isUser) {
                return this.commonService.FAILURE_RESPONSE({ message: 'User already exists!' });
            }
            const user = new this.userModel(payload);
            await user.save();
            return this.commonService.SUCCESS({ message: "User created succesfully" })
        } catch (error) {
            return this.commonService.FAILURE_RESPONSE({ message: error?.message });
        }
    }

    public async getAllUser(): Promise<IAPIResponse> {
        try {
            const user = await this.userModel.find();
            if (user?.length) {
                return this.commonService.SUCCESS({ data: user, message: "User details fetched successfully!" })
            }
            return this.commonService.SUCCESS({ data: user, message: "Users not found!" })
        } catch (error) {
            return this.commonService.FAILURE_RESPONSE({ message: error?.message })
        }
    }


    public async getUserById(userId: ObjectId): Promise<IAPIResponse> {
        try {
            const user = await this.userModel.findOne({ _id: userId });
            if (user) {
                return this.commonService.SUCCESS({ data: user, message: "User details fetched successfully!" })
            }
            return this.commonService.FAILURE_RESPONSE({ message: "User not found!" })
        } catch (error) {
            return this.commonService.FAILURE_RESPONSE({ message: error?.message })
        }
    }

    public async createPdf(user: UserModel): Promise<Uint8Array> {
        const pdfDoc = await PDFDocument.create();
        const page = pdfDoc.addPage([600, 400]);
        const { width, height } = page.getSize();
        const fontSize = 12;
        const margin = 50;
        const tableTopY = height - margin - fontSize;
        const drawText = (text: string, x: number, y: number) => {
            page.drawText(text, {
                x,
                y,
                size: fontSize,
                color: rgb(0, 0, 0),
            });
        };
        const rowHeight = fontSize + 4;
        const colWidth = (width - 2 * margin) / 2;
        const rows = [
            ['Name:-', user.name],
            ['Email:-', user.email],
            ['Phone Number:-', user.phoneNumber.toString()],
            ['Address:-', user.address],
        ];
        rows.forEach((row, rowIndex) => {
            const y = tableTopY - (rowIndex + 1) * rowHeight - rowHeight;
            row.forEach((cell, colIndex) => {
                drawText(cell, margin + colIndex * colWidth, y);
            });
        });
        return await pdfDoc.save();
    }

    public async downloadPdf(userId: ObjectId): Promise<IAPIResponse> {
        try {
            const user = await this.userModel.findOne({ _id: userId });
            const pdf = await this.createPdf(user);
            return this.commonService.SUCCESS({ data: { user, pdf }, message: "PDF created successfully." })

        } catch (error) {
            return this.commonService.FAILURE_RESPONSE({ message: error?.message })
        }
    }

    public async generatePdf(userId: ObjectId, req: Request): Promise<IAPIResponse> {
        try {
            const user = await this.userModel.findOne({ _id: userId });
            const pdf = await this.createPdf(user);
            const filePath = path.join(__dirname, '..', '..', 'public', 'files', `${user?._id}.pdf`);
            const dir = path.dirname(filePath);
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, { recursive: true });
            }
            fs.writeFileSync(filePath, pdf);
            const pdfUrl = `${req.protocol}://${req.get('Host')}/public/files/${user?._id}.pdf`
            return this.commonService.SUCCESS({ data: { pdf: pdfUrl }, message: "PDF created successfully." })

        } catch (error) {
            return this.commonService.FAILURE_RESPONSE({ message: error?.message })
        }
    }

    public async updateUserById(userId: ObjectId, userData: CreateUserDto): Promise<IAPIResponse> {
        try {
            const user = await this.userModel.findOneAndUpdate({ _id: userId }, userData, { returnDocument: "after" })
            if (user) {
                return this.commonService.SUCCESS({ data: user, message: "User details updated successfully!" })
            }
            return this.commonService.FAILURE_RESPONSE({ message: "User not found!" })
        } catch (error) {
            return this.commonService.FAILURE_RESPONSE({ message: error?.message })
        }
    }

    public async deleteUserById(userId: ObjectId): Promise<IAPIResponse> {
        try {
            const user = await this.userModel.deleteOne({ _id: userId });
            if (user?.deletedCount) {
                return this.commonService.SUCCESS({ message: "User deleted successfully!" })
            }
            return this.commonService.FAILURE_RESPONSE({ message: "Users not found!" })
        } catch (error) {
            return this.commonService.FAILURE_RESPONSE({ message: error?.message })
        }
    }
}