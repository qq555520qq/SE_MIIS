export class Appointment {
  id: string;
  name: string;
  idNum: string;
  date: Date;
  time: string;
  subject: string;
  doctor: string;
  location: string;
  resourceType = 'Appointment';
  identifier:
    {
      value: string
    }[];
  status = 'booked';
  specialty:
    {
      text: string
    }[];
  reasonCode = [
    {
      coding: [
        {
          code: 'NTUTT_LAB1321'
        }
      ]
    }
  ];
  start: string;
  participant:
    {
      actor: {
        reference: string;
        display: string;
      };
    }[];
}
