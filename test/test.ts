import { Applicants, SawScoreType } from "../utils";
import { rankStudent } from "../utils/ranking";

const applicants: Applicants[] = [
    { id: "Alternative 1", gwa: 91.000, siblings: 1, income: 10000, involvement: 1 },
    { id: "Alternative 2", gwa: 88.000, siblings: 5, income: 20000, involvement: 0 },
    { id: "Alternative 3", gwa: 91.000, siblings: 3, income: 15000, involvement: 0 },
    { id: "Alternative 4", gwa: 92.000, siblings: 4, income: 20000, involvement: 0 },
    { id: "Alternative 5", gwa: 93.000, siblings: 2, income: 5000, involvement: 0 },
    // { id: "Alternative 6", gwa: 86.000, siblings: 7, income: 10000, involvement: 1 },
    // { id: "Alternative 7", gwa: 82.000, siblings: 5, income: 3000, involvement: 0 },
    // { id: "Alternative 8", gwa: 90.000, siblings: 4, income: 8000, involvement: 1 },
    // { id: "Alternative 9", gwa: 90.000, siblings: 1, income: 5000, involvement: 1 },
    // { id: "Alternative 10", gwa: 85.000, siblings: 4, income: 18000, involvement: 1 },
    // { id: "Alternative 11", gwa: 80.000, siblings: 0, income: 3000, involvement: 1 },
    // { id: "Alternative 12", gwa: 88.000, siblings: 2, income: 7000, involvement: 0 },
    // { id: "Alternative 13", gwa: 87.000, siblings: 6, income: 8000, involvement: 0 },
    // { id: "Alternative 14", gwa: 95.000, siblings: 4, income: 3000, involvement: 0 },
    // { id: "Alternative 15", gwa: 84.000, siblings: 5, income: 12000, involvement: 1 },
    // { id: "Alternative 16", gwa: 89.000, siblings: 9, income: 2500, involvement: 1 },
    // { id: "Alternative 17", gwa: 90.000, siblings: 1, income: 5500, involvement: 0 },
    // { id: "Alternative 18", gwa: 80.000, siblings: 10, income: 3500, involvement: 1 },
    // { id: "Alternative 19", gwa: 85.000, siblings: 3, income: 6000, involvement: 0 },
    // { id: "Alternative 20", gwa: 90.000, siblings: 1, income: 1500, involvement: 1 }
  ];


const data: SawScoreType[] = rankStudent( applicants );