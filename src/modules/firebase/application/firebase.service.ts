import { BadRequestException, Inject, Injectable } from "@nestjs/common";
import * as admin from "firebase-admin";
import { FIREBASE_ADMIN } from "../firebase.config.module";
import { CreateExampleEntityDTO } from "src/modules/exampleEntity/application/create-exampleEntity.dto";

@Injectable()
export class FirebaseService{
    
    constructor(
    @Inject(FIREBASE_ADMIN) private readonly firebaseAdmin: admin.app.App
  ) {};
    async createExampleEntityOnFirebase(userData: CreateExampleEntityDTO): Promise<{
      user: admin.auth.UserRecord;
    }> {
      try {
        const userRecord = await this.firebaseAdmin.auth().createUser({
        email: userData.email
      });
      return { user : userRecord }; 
      } catch (error) {
        throw new BadRequestException(error);
      };
  }
}