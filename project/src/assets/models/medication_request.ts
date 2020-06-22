export class MedicationRequest {
  id: string;
  medicationId: string;
  medication: string;
  dose: number;
  unit: string;
  resourceType = 'MedicationRequest';
  /** 藥物資料 'Medication'/medicationId */
  medicationReference:
    {
      reference: string
    };
  /** 劑量資訊 dose & taking Time */
  dosageInstruction:
   {
     text: string
   };
  reasonCode = [
    {
      coding: [
        {
          code: 'NTUTT_LAB1321'
        }
      ]
    }
  ];
}
