import { supabase } from './supabaseClient';

// Отримати заявки
export const getSubmissions = async () => {
  const { data, error } = await supabase
    .from('submissions')
    .select('*')
    .order('timestamp', { ascending: false });
  if (error) throw error;
  return data;
};

// Видалити заявку
export const deleteSubmission = async (id) => {
  const { data, error } = await supabase
    .from('submissions')
    .delete()
    .eq('id', id);
  if (error) throw error;
  return data;
};
