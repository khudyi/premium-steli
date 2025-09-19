import { supabase } from './supabaseClient';

// Завантажити зображення у bucket 'projects'
export const uploadImage = async (file) => {
  if (!file) throw new Error('Файл не вибрано');

  const fileName = `${Date.now()}_${file.name}`;

  const { data: uploadData, error: uploadError } = await supabase.storage
    .from('projects')
    .upload(fileName, file);

  if (uploadError) throw uploadError;

  // Правильний спосіб отримати public URL
  const { data } = supabase.storage
    .from('projects')
    .getPublicUrl(fileName);

  return data.publicUrl;
};