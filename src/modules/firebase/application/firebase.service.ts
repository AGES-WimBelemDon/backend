import { BadRequestException, Inject, Injectable } from "@nestjs/common";
import * as admin from "firebase-admin";
import { FIREBASE_ADMIN } from "../firebase.config.module";
import { CreateExampleEntityDTO } from "src/modules/exampleEntity/application/create-exampleEntity.dto";
import { RegisterUserDTO } from "src/modules/user/application/user.dtos";

@Injectable()
export class FirebaseService {
  constructor(
    @Inject(FIREBASE_ADMIN) private readonly firebaseAdmin: admin.app.App,
  ) {}

  async createFirebaseUser(
    user: RegisterUserDTO,
  ): Promise<admin.auth.UserRecord> {
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

  async getFirebaseUserByEmail(email: string): Promise<admin.auth.UserRecord> {
    try {
      const userRecord = await this.firebaseAdmin.auth().getUserByEmail(email);
      return userRecord;
    } catch (error) {
      throw new BadRequestException(error);
    }
  }

  async createExampleEntityOnFirebase(
    userData: CreateExampleEntityDTO,
  ): Promise<{
    user: admin.auth.UserRecord;
  }> {
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

  async verifyIdToken(token: string): Promise<admin.auth.DecodedIdToken> {
    try {
      const decodedToken = await this.firebaseAdmin.auth().verifyIdToken(token);
      return decodedToken;
    } catch (error) {
      throw new BadRequestException(
        "Invalid or expired Firebase token: " + error.message,
      );
    }
  }
}
