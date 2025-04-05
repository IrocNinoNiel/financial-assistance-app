import { Applicants, SawScoreType } from "../utils";
import { rankStudent } from "../utils/ranking";

const applicants: Applicants[] = [
    { id: "da33e2f9-df6b-4336-abaf-87d0c06bc55d", gwa: 87.31, siblings: 1, income: 29128, involvement: 9 },
    { id: "4c8a9377-5fd0-48d6-9807-d1392f59c2ca", gwa: 87.72, siblings: 5, income: 29354, involvement: 10 },
    { id: "facd9cca-90f7-44f5-b058-5d506487dd42", gwa: 91.38, siblings: 4, income: 21514, involvement: 8 },
    { id: "7d1acc88-ba19-4435-9c6f-aa4e368c9593", gwa: 76.35, siblings: 3, income: 17816, involvement: 4 },
    { id: "340aa896-011e-4dfa-816f-ed0ad430afd2", gwa: 94.62, siblings: 1, income: 17340, involvement: 9 },
    { id: "1741dbab-133f-4efe-9abf-00cbaea504bd", gwa: 91.65, siblings: 5, income: 23209, involvement: 3 },
    { id: "d9bb727e-1168-4c68-87d3-9427ebd21e57", gwa: 87.88, siblings: 1, income: 18617, involvement: 2 },
    { id: "aa992980-e033-498b-81ea-4f3199473f8e", gwa: 93.36, siblings: 1, income: 26187, involvement: 5 },
    { id: "19f985c9-7ad8-4320-8edc-e2c2419eb7f1", gwa: 96.54, siblings: 3, income: 29277, involvement: 10 },
    { id: "fbb54796-1682-4486-afae-85b04dac8ba4", gwa: 93.63, siblings: 11, income: 100, involvement: 3 }
];


const data: SawScoreType[] = rankStudent( applicants );