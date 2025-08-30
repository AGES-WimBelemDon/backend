import { Module } from "@nestjs/common";
import { FirebaseService } from "./application/firebase.service";
import { FirebaseConfigModule } from "./firebase.config.module";



@Module({
  imports: [FirebaseConfigModule],
  providers:[
    FirebaseService],
  exports:[FirebaseService, FirebaseConfigModule],
    })
export class FirebaseModule {}