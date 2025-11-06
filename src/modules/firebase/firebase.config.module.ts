import { Module } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import * as admin from "firebase-admin";
import { ServiceAccount } from "firebase-admin";

export const FIREBASE_ADMIN = "FIREBASE_ADMIN";

@Module({
  providers: [
    {
      provide: FIREBASE_ADMIN,
      useFactory: (configService: ConfigService) => {
        const projectId = configService.getOrThrow<string>("FIREBASE_PROJECT_ID");
        const clientEmail = configService.getOrThrow<string>("FIREBASE_CLIENT_EMAIL");
        const storageBucket = configService.getOrThrow<string>("FIREBASE_STORAGE_BUCKET");
        const privateKey = configService
          .getOrThrow<string>("FIREBASE_PRIVATE_KEY")
          .replace(/\\n/g, "\n");

        const adminConfig: ServiceAccount = {
          projectId,
          clientEmail,
          privateKey,
        };

        if (!admin.apps.length) {
          return admin.initializeApp({
            credential: admin.credential.cert(adminConfig),
            storageBucket: storageBucket
          });
        }
        return admin.app();
      },
      inject: [ConfigService],
    },
  ],
  exports: [FIREBASE_ADMIN],
})
export class FirebaseConfigModule {}
