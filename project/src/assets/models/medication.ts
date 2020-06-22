export class Medication {
  id: string;
  name: string;
  medicForm: string;
  description: string;
  resourceType = 'Medication';
  /** 藥品名稱 name */
  identifier:
    {
      value: string
    }[];
  /** 藥品資料  */
  form:
    {
      coding:
        {
          // medicForm = powder | tablets | capsule
          code: string
        }[],
      // description
      text: string
    };
  code = [
    {
      coding: [
        {
          code: 'NTUTT_LAB1321'
        }
      ]
    }
  ];
}
