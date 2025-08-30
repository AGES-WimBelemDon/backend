import { Module, Global } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import * as admin from "firebase-admin";
import { ServiceAccount } from "firebase-admin";


export const FIREBASE_ADMIN = "FIREBASE_ADMIN";

@Global()
@Module({
  imports: [ConfigModule],
  providers:[
    {
        provide : FIREBASE_ADMIN,
        useFactory: (configService: ConfigService) => {
            const projectId = configService.get<string>("FIREBASE_PROJECT_ID");
            const privateKey = configService.get<string>("FIREBASE_PRIVATE_KEY");
            const clientEmail = configService.get<string>("FIREBASE_CLIENT_EMAIL");
            if (!projectId || !privateKey || !clientEmail) {
            throw new Error("Missing required Firebase configuration. Please check your environment variables: FIREBASE_PROJECT_ID, FIREBASE_PRIVATE_KEY, FIREBASE_CLIENT_EMAIL");
            }

            const adminConfig: ServiceAccount = {
                projectId,
                privateKey: privateKey.replace(/\\n/g, "\n"),
                clientEmail,
            };

            if (!admin.apps.length) {
            return admin.initializeApp({
                credential: admin.credential.cert(adminConfig),
            });
            } else {
            return admin.app();
            }
        },
        inject: [ConfigService],
  }],
  exports:[],
    })
export class AuthModule {}


