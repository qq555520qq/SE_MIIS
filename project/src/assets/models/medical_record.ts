import { MedicationRequest } from './medication_request';

export class MedicalRecord {
  id: string;
  patientId: string;
  doctorId: string;
  date: string;
  doctorName: string;
  medicationIds: string[];
  condition: string;
  doses: number[];
  units: string[];
  resourceType = 'CarePlan';
  /** 病例日期時間 date */
  created: string;
  /** 病症 */
  description: string;
  /** 病人參照 */
  subject:
  {
    // 'Patient'/patientId
    reference: string
  };
  /** 醫生參照 */
  author:
  {
    // 'Practitioner'/doctorId
    reference: string
  };
  /** 標籤 */
  category = [
    {
      coding: [
        {
          code: 'NTUTT_LAB1321'
        }
      ]
    }
  ];
  /** 藥物處方 */
  activity:
  {
    detail:
      {
        // 'Medication'/medicationId
        productReference: {
          reference: string
        },
        dailyAmount:
        {
          value: number,
          unit: string
        }
      }
  }[];
}
