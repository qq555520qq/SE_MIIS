export class RentalAppointment {
  id: string;
  patientName: string;
  deviceName: string;
  quantity: string;
  startDate: Date;
  endDate: Date;
  resourceType = 'Appointment';
  start: string;
  end: string;
  participant:
    {
      type: {
        text: string;
      }[],
      actor: {
        reference: string;
        display: string;
      }
    }[];
  status = 'booked';
  reasonCode = [
    {
      coding: [
        {
          code: 'NTUTT_LAB1321_Rental'
        }
      ]
    }
  ];
}
