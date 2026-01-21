import { binaryToUuid, extractUserFromToken, uuidToBinary } from '../utils';
import {
    createOrUpdateStaticContentRepo,
    updateStaticContentRepo,
    getStaticContentByTypeRepo,
    getAllStaticContentRepo,
    deleteStaticContentRepo,
    ContentType,
    StaticContentCreateInput,
    StaticContentUpdateInput
} from './repository';

export interface StaticContentPayload {
    title: string;
    content: string;
}

export interface StaticContentResponse {
    id: string;
    contentType: string;
    title: string;
    content: string;
    createdAt: Date;
    updatedAt: Date;
}

const mapStaticContentToResponse = (content: any): StaticContentResponse => ({
    id: binaryToUuid(content.id),
    contentType: content.content_type,
    title: content.title,
    content: content.content,
    createdAt: content.created_at,
    updatedAt: content.updated_at
});

const validateContentType = (type: string): ContentType => {
    const validTypes: ContentType[] = ['ABOUT_US', 'CONTACT_US'];
    if (!validTypes.includes(type as ContentType)) {
        throw new Error(`Invalid content type. Must be one of: ${validTypes.join(', ')}`);
    }
    return type as ContentType;
};

export const createOrUpdateStaticContent = async (
    contentType: string,
    payload: StaticContentPayload,
    authHeader: string
): Promise<StaticContentResponse> => {
    const userDetails = extractUserFromToken(authHeader);
    const validContentType = validateContentType(contentType);

    const data: StaticContentCreateInput = {
        content_type: validContentType,
        title: payload.title,
        content: payload.content,
        created_by: uuidToBinary(userDetails.userId)
    };

    const content = await createOrUpdateStaticContentRepo(data);
    return mapStaticContentToResponse(content);
};

export const updateStaticContent = async (
    contentType: string,
    payload: StaticContentPayload,
    authHeader: string
): Promise<StaticContentResponse | null> => {
    const userDetails = extractUserFromToken(authHeader);
    const validContentType = validateContentType(contentType);

    const data: StaticContentUpdateInput = {
        title: payload.title,
        content: payload.content,
        updated_by: uuidToBinary(userDetails.userId)
    };

    const content = await updateStaticContentRepo(validContentType, data);
    if (!content) return null;
    return mapStaticContentToResponse(content);
};

export const getStaticContentByType = async (
    contentType: string
): Promise<StaticContentResponse | null> => {
    const validContentType = validateContentType(contentType);
    const content = await getStaticContentByTypeRepo(validContentType);
    if (!content) return null;
    return mapStaticContentToResponse(content);
};

export const getAllStaticContent = async (): Promise<StaticContentResponse[]> => {
    const contents = await getAllStaticContentRepo();
    return contents.map(mapStaticContentToResponse);
};

export const deleteStaticContent = async (contentType: string): Promise<void> => {
    const validContentType = validateContentType(contentType);
    await deleteStaticContentRepo(validContentType);
};

export const getAvailableContentTypes = (): string[] => {
    return ['ABOUT_US', 'CONTACT_US'];
};
