export class Medical {
  id: string;
  acitve: boolean;
  name: string;
  nowdate: Date;
  addresstus: string;
  subject: string;
  body: string;
  medicaltype: string;
  resourceType = 'Condition';
  conditionName: string;
  recordedDate: string;
  note: string;
  identifier:
    {
      value: string
    }[];
  /** 對應patient_id */
  severity: {
    coding:
    {
      display: string
    }[]
  };
  /** 辨識為ntut所需資料 */
  category = [
    {
      coding: [
        {
          code: 'NTUTT_m1'
        }
      ]
    }
  ];
  /** 病歷 */
  code:
    {
      coding:
      {
        display: string
      }[]
    };
  /** 生病的部位 */
  bodySite:
    {
      text: string
    }[];
}
