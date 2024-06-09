import { Module } from "@nestjs/common";
import { UserService } from "./user.service";
import { ModelDefinition, MongooseModule } from "@nestjs/mongoose";
import { UserSchema } from "mongo/user.schema";
import { CommonService } from "src/common/common.controller";
import * as dotenv from 'dotenv';
import { UserController } from "./user.controller";
dotenv.config();

export const SCHEMAS: ModelDefinition[] = [
    {
        name: "UserModel",
        schema: UserSchema
    }
]

// list of imports for user modules
const USER_MODULE_IMPORTS = [
    MongooseModule.forFeature(SCHEMAS),
]

// list of controllers for auth modules
const USER_MODULE_CONTROLLERS = [
    UserController,
]

// list of providers or service  for auth modules
const USER_MODULE_PROVIDERS = [
    UserService,
    CommonService,
]

@Module({
    imports: USER_MODULE_IMPORTS,
    controllers: USER_MODULE_CONTROLLERS,
    providers: USER_MODULE_PROVIDERS
})

export class UserModule {
    constructor() {

    }
}