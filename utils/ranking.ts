import { Applicants, SawScoreType } from "./types";

// const pairwiseMatrix = [
//     [1.00, 4.00, 1/4, 3.00], 
//     [1/4, 1.00, 1/6, 2.00], 
//     [4.00, 6.00, 1.00, 5.00], 
//     [1/3, 0.50, 0.20, 1.00]  

// ];
const pairwiseMatrix: number[][] = [
    [1.00, 4.00, 0.25, 3.00], 
    [0.25, 1.00, 0.17, 2.00], 
    [4.00, 6.00, 1.00, 5.00], 
    [0.33, 0.50, 0.20, 1.00]
];

function calculateAHPWeights(matrix: number[][]): number[] {
    const n = matrix.length;
    
    const columnSums: number[] = matrix[0].map((_, colIndex) => matrix.reduce((sum, row) => sum + row[colIndex], 0));
    const normalizedMatrix: number[][] = matrix.map(row => row.map((val, j) => val / columnSums[j]));
    
    const weights: number[] = normalizedMatrix.map(row => row.reduce((sum, val) => sum + val, 0) / n);
    return weights;
}


function normalizeSAW(data: Applicants[], criteria: string[], isBenefit: boolean[]): number[][] {
    return criteria.map((criterion, index) => {
        const values: number[] = data.map(applicant => {
            if (typeof applicant[criterion] !== 'number') {
                throw new Error(`Invalid value for criterion ${criterion} in applicant ${applicant.id}`);
            }
            return applicant[criterion];
        });
        const max: number = Math.max(...values);
        const min: number = Math.min(...values);

        if (max === min) {
            return data.map(() => 1);
        }
        
        return data.map(applicant => isBenefit[index] ? applicant[criterion] / max : min / applicant[criterion]);
    });
}

function calculateSAWScores(normalizedMatrix: number[][], weights: number[], applicants: Applicants[], criteriaNames: string[]): SawScoreType[] {
    return applicants.map((applicant, i) => {
        const score: number = criteriaNames.reduce((sum, _, j) => sum + (normalizedMatrix[j][i] * weights[j]), 0);
        return { id: applicant.id, score };
    });
}



export const rankStudent = ( applicants: Applicants[] ): SawScoreType[] => {
    const criteriaWeights: number[] = calculateAHPWeights(pairwiseMatrix);
    console.debug("AHP Criteria Weights:", criteriaWeights);

    const criteriaNames: string[] = ['gwa', 'siblings', 'income', 'involvement'];
    const isBenefit: boolean[] = [true, true, false, true];

    const normalizedMatrix: number[][] = normalizeSAW(applicants, criteriaNames, isBenefit);
    console.debug("normalize matrix", normalizedMatrix);

    const scores: SawScoreType[] = calculateSAWScores(normalizedMatrix, criteriaWeights, applicants, criteriaNames);
    const rankedApplicants: SawScoreType[] = scores.sort((a, b) => {
        if (b.score === a.score) {
            return a.id.localeCompare(b.id);  // Example fallback for tie-breaking
        }
        return b.score - a.score;
    });
    console.debug("Final Rankings:", rankedApplicants);
    return rankedApplicants;
}
