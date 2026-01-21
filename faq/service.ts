import { binaryToUuid, extractUserFromToken, uuidToBinary, QueryParams } from '../utils';
import {
    createFaqRepo,
    updateFaqRepo,
    deleteFaqRepo,
    getOneFaqRepo,
    getAllFaqsRepo,
    getFaqCategoriesRepo,
    faqExistsRepo,
    FaqCreateInput,
    FaqUpdateInput
} from './repository';

export interface FaqPayload {
    question: string;
    answer: string;
    category?: string;
    sortOrder?: number;
}

export interface FaqResponse {
    id: string;
    question: string;
    answer: string;
    category: string | null;
    sortOrder: number;
    createdAt: Date;
    updatedAt: Date;
}

const mapFaqToResponse = (faq: any): FaqResponse => ({
    id: binaryToUuid(faq.id),
    question: faq.question,
    answer: faq.answer,
    category: faq.category,
    sortOrder: faq.sort_order,
    createdAt: faq.created_at,
    updatedAt: faq.updated_at
});

export const createFaq = async (
    payload: FaqPayload,
    authHeader: string
): Promise<FaqResponse> => {
    const userDetails = extractUserFromToken(authHeader);

    const data: FaqCreateInput = {
        question: payload.question,
        answer: payload.answer,
        category: payload.category,
        sort_order: payload.sortOrder || 0,
        created_by: uuidToBinary(userDetails.userId)
    };

    const faq = await createFaqRepo(data);
    return mapFaqToResponse(faq);
};

export const updateFaq = async (
    faqId: string,
    payload: FaqPayload,
    authHeader: string
): Promise<FaqResponse> => {
    const userDetails = extractUserFromToken(authHeader);

    const data: FaqUpdateInput = {
        question: payload.question,
        answer: payload.answer,
        category: payload.category,
        sort_order: payload.sortOrder,
        updated_by: uuidToBinary(userDetails.userId)
    };

    const faq = await updateFaqRepo(faqId, data);
    return mapFaqToResponse(faq);
};

export const deleteFaq = async (faqId: string): Promise<void> => {
    await deleteFaqRepo(faqId);
};

export const getOneFaq = async (faqId: string): Promise<FaqResponse | null> => {
    const faq = await getOneFaqRepo(faqId);
    if (!faq) return null;
    return mapFaqToResponse(faq);
};

export const getAllFaqs = async (
    params: QueryParams,
    category?: string
): Promise<{ data: FaqResponse[]; total: number }> => {
    const { faqs, total } = await getAllFaqsRepo(params.limit, params.offset, category);
    return {
        data: faqs.map(mapFaqToResponse),
        total
    };
};

export const getFaqCategories = async (): Promise<string[]> => {
    return getFaqCategoriesRepo();
};

export const doesFaqExist = async (faqId: string): Promise<boolean> => {
    return faqExistsRepo(faqId);
};
