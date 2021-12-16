import {NextFunction, Request, Response} from "express";
import AuthService from "@services/student/auth.service";
import {LoginUserDto} from "@dtos/loginUser.dto";
import {SignUpUserDto} from "@dtos/signUpUser.dto";
import {Student} from "@entity/student";
import { SchoolYearService } from "@services/schoolYear.service";
import {PositionService} from "@services/position.service";
import {PitchingBattingService} from "@services/pitchingBatting.service";
import {RequestWithUser} from "@interfaces/auth.interface";


class AuthController{

    public authService = new AuthService();
    public schoolYearService = new SchoolYearService();
    public positionService = new PositionService();
    public pitchingBatting = new PitchingBattingService();
    
    constructor() {}
    signUp = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const userData: SignUpUserDto  = req.body;
            const signUpUser: Student = await this.authService.signUp(userData);
            res.status(201).json({ data: signUpUser, message: 'signup' });
        } catch (error) {
            next(error);
        }
    }

    logIn = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const userData: LoginUserDto = req.body;
            const user = await this.authService.logIn(userData);
            
            const school_years = this.schoolYearService.findAll();
            const positions = this.positionService.findAll();
            const pitching_battings = this.pitchingBatting.findAll();
            const resData = {
                user: user,
                schoolYear: school_years,
                position: positions,
                pitchingBatting: pitching_battings
            }
            res.status(200).json({ ...resData, message: 'login', status: "1"});
        }catch (error){
            next(error);
        }
    }

    logOut = async (req: RequestWithUser, res: Response, next: NextFunction): Promise<void> => {
        try {
            const userData = req.user;
            const logOutUserData: Student = await this.authService.logOut(userData);

            res.status(200).json({data: logOutUserData, message: 'logout'});
        } catch (error){
            next(error);
        }
    };
}

export default AuthController