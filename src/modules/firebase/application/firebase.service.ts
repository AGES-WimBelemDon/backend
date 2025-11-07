import { BadRequestException, Inject, Injectable } from "@nestjs/common";
import { app, auth } from "firebase-admin";
import { FIREBASE_ADMIN } from "../firebase.config.module";
import { CreateExampleEntityDTO } from "src/modules/exampleEntity/application/create-exampleEntity.dto";
import { RegisterUserDTO } from "src/modules/user/application/user.dtos";
import * as admin from 'firebase-admin';
@Injectable()
export class FirebaseService {
  private readonly storage: admin.storage.Storage;
  private readonly bucket;
  constructor(
    @Inject(FIREBASE_ADMIN) private readonly firebaseAdmin: app.App,
  ) {
    this.storage = this.firebaseAdmin.storage();
    this.bucket = this.storage.bucket();
  }
  
  async createFirebaseUser(
    user: RegisterUserDTO,
  ): Promise<auth.UserRecord> {
    try {
      const userRecord = await this.firebaseAdmin.auth().createUser({
        email: user.email,
        displayName: user.name,
      });
      return userRecord;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async getFirebaseUserByEmail(email: string): Promise<auth.UserRecord | null> {
    try {
      const userRecord = await this.firebaseAdmin.auth().getUserByEmail(email);
      return userRecord;
    } catch (error) {
      if (error.code === 'auth/user-not-found') {
        return null;
      }
      throw new BadRequestException(error);
    }
  }

  async createExampleEntityOnFirebase(
    userData: CreateExampleEntityDTO,
  ): Promise<{ user: auth.UserRecord }> {
    try {
      const userRecord = await this.firebaseAdmin.auth().createUser({
        email: userData.email,
      });
      return { user: userRecord };
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async deleteFirebaseUser(uid: string): Promise<void> {
    try {
      await this.firebaseAdmin.auth().deleteUser(uid);
    } catch (error) {
      throw new BadRequestException(
        "Failed to delete Firebase user: " + error.message,
      );
    }
  }

  async verifyIdToken(token: string): Promise<auth.DecodedIdToken> {
    try {
      const decodedToken = await this.firebaseAdmin.auth().verifyIdToken(token);
      return decodedToken;
    } catch (error) {
      throw new BadRequestException(
        "Invalid or expired Firebase token: " + error.message,
      );
    }
  }
  async getPresignedUploadUrl(
    fileName: string,
    contentType: string,
  ): Promise<string> {
    const options = {
      version: "v4" as const,
      action: "write" as const,
      expires: Date.now() + 15 * 60 * 1000,
      contentType: contentType,
    };
    const [url] = await this.bucket.file(fileName).getSignedUrl(options);
    return url;
  }
  async getPresignedReadUrl(storagePath: string): Promise<string> {
    const options = {
      version: "v4" as const,
      action: "read" as const,
      expires: Date.now() + 60 * 60 * 1000,
    };

    const [readUrl] = await this.bucket.file(storagePath).getSignedUrl(options);
    return readUrl;
  }
}
