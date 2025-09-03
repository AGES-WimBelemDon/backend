import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import * as admin from "firebase-admin";
import { ServiceAccount } from "firebase-admin";


export const FIREBASE_ADMIN = "FIREBASE_ADMIN";
@Module({
  imports: [],
  providers:[
    {
        provide : FIREBASE_ADMIN,
        useFactory: (configService: ConfigService) => {
            const projectId = configService.getOrThrow<string>("FIREBASE_PROJECT_ID");
            const privateKey = configService.getOrThrow<string>("FIREBASE_PRIVATE_KEY");
            const clientEmail = configService.getOrThrow<string>("FIREBASE_CLIENT_EMAIL");

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
  exports:[FIREBASE_ADMIN],
    })
export class FirebaseConfigModule {}