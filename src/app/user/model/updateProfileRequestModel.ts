export class UpdateProfileRequestModel{
    associateid: string;
    name: string;
    mobile: string;
    email: string;
    lastupdated: string;
    techskills: Array<Skills>;
    nontechskills: Array<Skills>;
}

export class Skills{
    id: string;
    skillId: string;
    topic: string;
    rating: string;
}