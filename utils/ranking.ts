// const pairwiseMatrix = [
//     [1.00, 4.00, 1/4, 3.00], 
//     [1/4, 1.00, 1/6, 2.00], 
//     [4.00, 6.00, 1.00, 5.00], 
//     [1/3, 0.50, 0.20, 1.00]  
// ];
const pairwiseMatrix = [
    [1.00, 4.00, 0.25, 3.00], 
    [0.25, 1.00, 0.167, 2.00], 
    [4.00, 6.00, 1.00, 5.00], 
    [0.333, 0.50, 0.20, 1.00]
];

// Step 2: Compute AHP Weights
function calculateAHPWeights(matrix: number[][]): number[] {
    const n = matrix.length;
    
    // Normalize the matrix
    const columnSums = matrix[0].map((_, colIndex) => matrix.reduce((sum, row) => sum + row[colIndex], 0));
    const normalizedMatrix = matrix.map(row => row.map((val, j) => val / columnSums[j]));
    
    // Calculate priority vector (mean of rows)
    const weights = normalizedMatrix.map(row => row.reduce((sum, val) => sum + val, 0) / n);
    return weights;
}

const criteriaWeights = calculateAHPWeights(pairwiseMatrix);
console.log("AHP Criteria Weights:", criteriaWeights);

// Step 3: Define Applicants Data
const applicants = [
    { id: 1, gwa: 90, siblings: 3, income: 15000, involvement: 8 },
    { id: 2, gwa: 85, siblings: 5, income: 1000, involvement: 7 },
    { id: 3, gwa: 88, siblings: 2, income: 20000, involvement: 6 }
];

// // Step 4: Normalize Decision Matrix (SAW)
function normalizeSAW(data: any[], criteria: string[], isBenefit: boolean[]): number[][] {
    return criteria.map((criterion, index) => {
        const values = data.map(applicant => applicant[criterion]);
        const max = Math.max(...values);
        const min = Math.min(...values);
        
        return data.map(applicant => isBenefit[index] ? applicant[criterion] / max : min / applicant[criterion]);
    });
}

// Define criteria names and type (true = higher is better, false = lower is better)
const criteriaNames = ['gwa', 'siblings', 'income', 'involvement'];
const isBenefit = [true, true, false, true];

const normalizedMatrix = normalizeSAW(applicants, criteriaNames, isBenefit);
console.log("normalize matrix", normalizedMatrix);

// Step 5: Calculate SAW Scores
function calculateSAWScores(normalizedMatrix: number[][], weights: number[]): { id: number, score: number }[] {
    return applicants.map((applicant, i) => {
        const score = criteriaNames.reduce((sum, _, j) => sum + (normalizedMatrix[j][i] * weights[j]), 0);
        return { id: applicant.id, score };
    });
}

const scores = calculateSAWScores(normalizedMatrix, criteriaWeights);
const rankedApplicants = scores.sort((a, b) => b.score - a.score);

console.log("Final Rankings:", rankedApplicants);
