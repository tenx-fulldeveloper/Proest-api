import {Router} from "express";
import { Routes } from "@interfaces/routes.interface";
import AuthController from "@controllers/student/auth.controller"
import validationMiddleware from "@middlewares/validation.middleware";
import {LoginUserDto} from "@dtos/loginUser.dto";
import {SignUpUserDto} from "@dtos/signUpUser.dto";
import authMiddleware from "@middlewares/auth.middleware";
import {StudentController} from "@controllers/student/student.controller";
import {CoachInvitationController} from "@controllers/coachInvitation.controller"

class StudentRoute implements Routes {
    path: string = "/student";
    router: Router = Router();

    authController = new AuthController();
    studentController = new StudentController();
    coachInvitationController = new CoachInvitationController();
    
    constructor() {
        this.initializeRoutes();
    }

    private initializeRoutes = () => {
        this.router.post(`${this.path}/register`,validationMiddleware(SignUpUserDto, 'body'), this.authController.signUp);
        this.router.post(`${this.path}/login`,validationMiddleware(LoginUserDto, 'body'), this.authController.logIn);
        this.router.get(`${this.path}/logout`,authMiddleware, this.authController.logOut);
        this.router.put(`${this.path}/:id(\\d+)`,authMiddleware, this.studentController.update);
        this.router.get(`${this.path}/find_coaches`, this.studentController.findCoachByPosition);
        this.router.post(`${this.path}/invite`, this.coachInvitationController.inviteCoachFromStudent);
    }
}

export default StudentRoute;