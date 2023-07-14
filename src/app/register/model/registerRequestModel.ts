export class RegisterRequestModel{
    associateid: string;
    name: string;
    mobile: string;
    email: string;
    password: string;
    techskills: Array<Skills>;
    nontechskills: Array<Skills>;
}

export class Skills{
    skillId: string;
    topic: string;
    rating: string;
}

//Strict Property Initialization used in tsconfig.json