import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AuthModule } from './modules/auth/auth.module';
import { Auth } from './modules/auth/entities/auth.entity';
import { StudentsModule } from './modules/students/students.module';
import { Students } from './modules/students/entities/student.entity';
import { Teacher } from './modules/teachers/entities/teacher.entity';
import { Group } from './modules/groups/entities/group.entity';
import { TeachersModule } from './modules/teachers/teachers.module';
import { GroupsModule } from './modules/groups/groups.module';


@Module({
  imports: [
    ConfigModule.forRoot({envFilePath:".env", isGlobal:true}),
    TypeOrmModule.forRoot({
      type:"postgres",
      host:"localhost",
      username:"postgres",
      port:5432,
      database:process.env.DB_NAME,
      password:process.env.DB_PASSWORD,
      entities:[Auth, Students, Teacher, Group],
      autoLoadEntities:true, 
      synchronize:true,
      migrations:[]
    }),
    AuthModule,
    StudentsModule,
    TeachersModule,
    GroupsModule
    
  ],
  controllers: [],
  providers: [],
})
export class AppModule {}
