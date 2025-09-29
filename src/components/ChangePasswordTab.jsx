import { supabase } from "../lib/supabaseClient";

import { useState } from "react";

export const ChangePasswordTab = ({ showNotification }) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChangePassword = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      showNotification('Новий пароль і підтвердження не співпадають!', 'error');
      return;
    }
    setLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({ password: newPassword });
      if (error) throw error;
      showNotification('Пароль успішно змінено!', 'success');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      showNotification('Помилка при зміні пароля: ' + err.message, 'error');
    }
    setLoading(false);
  };

  return (
    <div className="card p-6 max-w-md">
      <h2 className="text-2xl font-bold mb-4">Змінити пароль</h2>
      <form onSubmit={handleChangePassword}>
        <div className="form-group mb-4">
          <label className="form-label">Поточний пароль</label>
          <input
            type="password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            className="form-input"
            required
          />
        </div>
        <div className="form-group mb-4">
          <label className="form-label">Новий пароль</label>
          <input
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            className="form-input"
            required
          />
        </div>
        <div className="form-group mb-4">
          <label className="form-label">Підтвердити новий пароль</label>
          <input
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            className="form-input"
            required
          />
        </div>
        <button type="submit" disabled={loading} className="btn btn-primary w-full">
          {loading ? 'Змінюємо...' : 'Змінити пароль'}
        </button>
      </form>
    </div>
  );
};