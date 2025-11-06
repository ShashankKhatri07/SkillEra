import { supabase } from './supabaseClient';
import { Student, Event, Project, Appeal, Message, DailyQuest } from '../types';

const BUCKET = 'documents';
const DATA_FOLDER = 'data';

// Helper to handle JSON file uploads
async function uploadJsonFile(path: string, data: any) {
    if (!supabase) return { data: null, error: { message: 'Supabase not configured' } };
    const jsonString = JSON.stringify(data, null, 2);
    const file = new File([jsonString], path.split('/').pop()!, { type: 'application/json' });
    return supabase.storage.from(BUCKET).upload(`${DATA_FOLDER}/${path}`, file, {
        cacheControl: '3600',
        upsert: true, // Overwrite existing file
    });
}

// Helper to handle JSON file downloads
async function downloadJsonFile(path: string): Promise<{ data: any | null, error: any | null }> {
    if (!supabase) return { data: null, error: { message: 'Supabase not configured' } };
    const { data: blob, error } = await supabase.storage.from(BUCKET).download(`${DATA_FOLDER}/${path}`);
    if (error) return { data: null, error };
    try {
        const text = await blob.text();
        const jsonData = JSON.parse(text);
        return { data: jsonData, error: null };
    } catch (e) {
        return { data: null, error: e };
    }
}

// --- Student-specific functions ---
export async function getStudent(studentId: string) {
    return downloadJsonFile(`students/${studentId}.json`);
}

export async function getAllStudents(): Promise<{ data: Student[] | null, error: any | null }> {
    if (!supabase) return { data: null, error: { message: 'Supabase not configured' } };
    const { data: fileList, error: listError } = await supabase.storage.from(BUCKET).list(`${DATA_FOLDER}/students`, {
        limit: 1000,
    });
    if (listError) return { data: null, error: listError };
    if (!fileList || fileList.length === 0) return { data: [], error: null };

    const studentPromises = fileList
        .filter(file => file.name.endsWith('.json'))
        .map(file => downloadJsonFile(`students/${file.name}`));
    
    const studentResults = await Promise.all(studentPromises);
    
    const students: Student[] = [];
    for (const result of studentResults) {
        if (result.error) {
            console.error("Error fetching a student file:", result.error);
            continue;
        }
        students.push(result.data);
    }
    return { data: students, error: null };
}

export async function saveStudent(student: Student) {
    return uploadJsonFile(`students/${student.id}.json`, student);
}

// --- Generic functions for array-based data ---
type CollectionName = 'events' | 'projects' | 'appeals' | 'messages' | 'quests';

export async function getCollection<T>(name: CollectionName): Promise<{ data: T[] | null, error: any | null }> {
    const { data, error } = await downloadJsonFile(`${name}.json`);
    // If file doesn't exist, Supabase download error contains "The resource was not found".
    // In this case, we treat it as an empty collection, not an error.
    if (error && error.message?.includes('The resource was not found')) {
        return { data: [], error: null };
    }
    return { data, error };
}

export async function addItemToCollection<T extends { id: string }>(name: CollectionName, item: T) {
    const { data: collection, error } = await getCollection<T>(name);
    if (error) return { data: null, error };
    const updatedCollection = [...(collection || []), item];
    return uploadJsonFile(`${name}.json`, updatedCollection);
}

export async function updateCollection<T extends { id: string }>(name: CollectionName, updatedItem: T) {
    const { data: collection, error } = await getCollection<T>(name);
    if (error) return { data: null, error };
    const updatedCollection = (collection || []).map(item => item.id === updatedItem.id ? updatedItem : item);
    return uploadJsonFile(`${name}.json`, updatedCollection);
}

export async function deleteItemFromCollection(name: CollectionName, itemId: string) {
    const { data: collection, error } = await getCollection<{ id: string }>(name);
    if (error) return { data: null, error };
    const updatedCollection = (collection || []).filter(item => item.id !== itemId);
    return uploadJsonFile(`${name}.json`, updatedCollection);
}

// --- Seeding ---
export async function checkAndSeedData(mockData: {
    students: Student[];
    events: Event[];
    projects: Project[];
    quests: Omit<DailyQuest, 'status' | 'submissionText'>[];
}) {
    if (!supabase) return;

    try {
        const { data: fileList, error: listError } = await supabase.storage.from(BUCKET).list(`${DATA_FOLDER}/students`, { limit: 1 });
        if (listError) throw listError;
        
        if (fileList && fileList.length === 0) {
            console.log('No data found in storage. Seeding...');

            const studentPromises = mockData.students.map(student => saveStudent(student));
            await Promise.all(studentPromises);

            await uploadJsonFile('events.json', mockData.events);
            await uploadJsonFile('projects.json', mockData.projects);
            await uploadJsonFile('quests.json', mockData.quests);
            await uploadJsonFile('appeals.json', []);
            await uploadJsonFile('messages.json', []);
            console.log('Seeding complete.');
        } else {
            console.log('Data already exists in storage. Skipping seed.');
        }
    } catch (e) {
        console.error("Error during seeding check:", e);
    }
}
