import { supabase } from './supabaseClient';

// Отримати всі проєкти
export const getProjects = async () => {
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .order('date', { ascending: false });
  if (error) throw error;
  return data;
};

// Додати новий проєкт
export const addProject = async (project) => {
  const { data, error } = await supabase
    .from('projects')
    .insert([{
      title: project.title,
      category: project.category,
      description: project.description,
      date: project.date,
      image_url: project.image_url // <--- обов’язково!
    }]);
  if (error) throw error;
  return data;
};

// Оновити проєкт
export const updateProject = async (id, project) => {
  const { data, error } = await supabase
    .from('projects')
    .update({
      title: project.title,
      category: project.category,
      description: project.description,
      date: project.date,
      image_url: project.image_url
    })
    .eq('id', id);
  if (error) throw error;
  return data;
};


// Видалити проєкт
export const deleteProject = async (id) => {
  const { data, error } = await supabase
    .from('projects')
    .delete()
    .eq('id', id);
  if (error) throw error;
  return data;
};
