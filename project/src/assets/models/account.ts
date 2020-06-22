export class Account {
  id: string;
  userName: string;
  idNum: string;
  password: string;
  birth: Date;
  email: string;
  status = true;
  userAddress: string;
  role: string;
  subject: string;
  resourceType: string;
  name:
    {
      text: string
    }[];
  identifier:
    {
      value: string
    }[];
  gender: string;
  birthDate: string;
  telecom:
    {
      value: string
    }[];
  active: boolean;
  address:
    {
      text: string
    }[];
  qualification: {
    identifier: {
      value: string;
    }[]
  }[];
}
