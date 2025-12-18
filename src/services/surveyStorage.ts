import { supabase } from '../lib/supabase';

const BUCKET_NAME = 'surveys';

export interface SurveyMeta {
  id: string;
  name: string;
  updatedAt: string;
}

/**
 * Lista tutti i survey salvati nel bucket
 */
export async function listSurveys(): Promise<SurveyMeta[]> {
  const { data, error } = await supabase.storage
    .from(BUCKET_NAME)
    .list('', {
      sortBy: { column: 'updated_at', order: 'desc' },
    });

  if (error) {
    console.error('Error listing surveys:', error);
    throw error;
  }

  return (data || [])
    .filter(file => file.name.endsWith('.json'))
    .map(file => ({
      id: file.name.replace('.json', ''),
      name: file.name.replace('.json', ''),
      updatedAt: file.updated_at || file.created_at || '',
    }));
}

/**
 * Carica un survey specifico dal bucket
 */
export async function getSurvey(id: string): Promise<object> {
  const { data, error } = await supabase.storage
    .from(BUCKET_NAME)
    .download(`${id}.json`);

  if (error) {
    console.error('Error downloading survey:', error);
    throw error;
  }

  const text = await data.text();
  return JSON.parse(text);
}

/**
 * Salva un survey nel bucket
 */
export async function saveSurvey(id: string, json: object): Promise<void> {
  const blob = new Blob([JSON.stringify(json, null, 2)], {
    type: 'application/json',
  });

  const { error } = await supabase.storage
    .from(BUCKET_NAME)
    .upload(`${id}.json`, blob, {
      upsert: true,
      contentType: 'application/json',
    });

  if (error) {
    console.error('Error saving survey:', error);
    throw error;
  }
}

/**
 * Elimina un survey dal bucket
 */
export async function deleteSurvey(id: string): Promise<void> {
  const { error } = await supabase.storage
    .from(BUCKET_NAME)
    .remove([`${id}.json`]);

  if (error) {
    console.error('Error deleting survey:', error);
    throw error;
  }
}
