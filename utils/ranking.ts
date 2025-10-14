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

export const calculateAHPWeights = (matrix: number[][]): number[] =>  {
    const n = matrix.length;
    
    const columnSums: number[] = matrix[0].map((_, colIndex) => matrix.reduce((sum, row) => sum + row[colIndex], 0));
    const normalizedMatrix: number[][] = matrix.map(row => row.map((val, j) => val / columnSums[j]));
    
    const weights: number[] = normalizedMatrix.map(row => row.reduce((sum, val) => sum + val, 0) / n);
    return weights;
}

/** TOPSIS NEW CALCULATION */
function normalizeMatrix(matrix: number[][]): number[][] {

    const n = matrix[0].length;
    const m = matrix.length;
    const colNorms = Array(n).fill(0);
    for (let j = 0; j < n; j++) {
        for (let i = 0; i < m; i++) {
        colNorms[j] += matrix[i][j] ** 2;
        }
        colNorms[j] = Math.sqrt(colNorms[j]);
    }
    return matrix.map(row => row.map((val, j) => val / (colNorms[j] || 1)));
}

export const topsis = (applicants: Record<string, any>[], criteriaNames: string[], isBenefit: boolean[], weights: number[]): SawScoreType[] => {
    const decisionMatrix = applicants.map(app => criteriaNames.map(c => app[c]));

    // 1. Normalize
    const normMatrix = normalizeMatrix(decisionMatrix);

    // 2. Apply weights
    const weighted = normMatrix.map(row => row.map((val, j) => val * weights[j]));

    

    // 3. Ideal best/worst
    const idealBest: number[] = [];
    const idealWorst: number[] = [];
    for (let j = 0; j < criteriaNames.length; j++) {
        const col = weighted.map(r => r[j]);
        if (isBenefit[j]) {
        idealBest[j] = Math.max(...col);
        idealWorst[j] = Math.min(...col);
        } else {
        idealBest[j] = Math.min(...col);
        idealWorst[j] = Math.max(...col);
        }
    }

    // 4. Distances
    const scores: SawScoreType[] = applicants.map((app, i) => {

        const { id, name, ...appWithoutId } = app;
        const SiPlus = Math.sqrt(weighted[i].reduce((sum, val, j) => sum + (val - idealBest[j]) ** 2, 0));
        const SiMinus = Math.sqrt(weighted[i].reduce((sum, val, j) => sum + (val - idealWorst[j]) ** 2, 0));
        const CC = SiMinus / (SiPlus + SiMinus);
        return { id: id, name: name, score: CC, evaluation: appWithoutId };
    });

    // 5. Sort
    return scores.sort((a, b) => b.score - a.score);
}



export const rankStudent = ( applicants: Applicants[] ): SawScoreType[] => {
    const criteriaWeights: number[] = calculateAHPWeights(pairwiseMatrix);
    console.debug("AHP Criteria Weights:", criteriaWeights);

    const criteriaNames: string[] = ['gwa', 'siblings', 'income', 'involvement'];
    const isBenefit: boolean[] = [true, true, false, true];

    const rankedApplicants: SawScoreType[] = topsis(applicants, criteriaNames, isBenefit, criteriaWeights);
    console.debug("Final Rankings:", rankedApplicants);
    return rankedApplicants;
}
