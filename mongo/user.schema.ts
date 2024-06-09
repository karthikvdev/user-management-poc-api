import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<UserModel>;

@Schema({
    timestamps: true
})

// MongoDB schema.
export class UserModel {
    @Prop() name: string;
    @Prop() email: string;
    @Prop() phoneNumber: number;
    @Prop() address: string;
}

export const UserSchema = SchemaFactory.createForClass(UserModel);