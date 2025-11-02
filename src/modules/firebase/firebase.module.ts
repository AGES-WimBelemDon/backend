import { Module } from "@nestjs/common";
import { FirebaseService } from "./application/firebase.service";
import { FirebaseConfigModule } from "./firebase.config.module";
import { FirebaseAuthGuard } from "src/common/guards/firebase-auth.guard";
import { DevConfigModule } from "src/config/dev.config.module";
import { DbGuard } from "src/common/guards/db.guard";
import { RolesGuard } from "src/common/guards/role.guard";

@Module({
  imports: [FirebaseConfigModule, DevConfigModule],
  providers: [FirebaseService, FirebaseAuthGuard, DbGuard, RolesGuard],
  exports: [
    FirebaseService,
    FirebaseConfigModule,
    DevConfigModule,
    FirebaseAuthGuard,
    DbGuard,
    RolesGuard,
  ],
})
export class FirebaseModule {}